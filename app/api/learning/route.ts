import { and, asc, desc, eq, sql } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { ensureLearner } from "../../../db/learning";
import {
  artworks,
  contentItems,
  learners,
  learningProgress,
  teacherBookings,
} from "../../../db/schema";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const clean = (value: unknown, max = 120) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function levelFromXp(xp: number) {
  const thresholds = [0, 140, 360, 720, 1250, 1900];
  return thresholds.reduce(
    (level, threshold, index) => (xp >= threshold ? index + 1 : level),
    1,
  );
}

function routeError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("no such table")) {
    return Response.json(
      { error: "Learning storage is being prepared. Please try again shortly." },
      { status: 503 },
    );
  }
  return Response.json({ error: message }, { status: 500 });
}

const ageBands = ["4–5", "6–8", "9–12", "13+"];

function requestedLearnerId(value: unknown) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ authenticated: false });

  try {
    const db = getDb();
    const defaultLearner = await ensureLearner(user);
    const learnerProfiles = await db
      .select()
      .from(learners)
      .where(eq(learners.ownerUserId, user.userId))
      .orderBy(asc(learners.createdAt), asc(learners.id));
    const learnerId = requestedLearnerId(
      new URL(request.url).searchParams.get("learnerId"),
    );
    const learner = learnerId
      ? learnerProfiles.find((item) => item.id === learnerId)
      : defaultLearner;
    if (!learner) {
      return Response.json({ error: "Learner profile not found." }, { status: 404 });
    }
    const progress = await db
      .select()
      .from(learningProgress)
      .where(eq(learningProgress.learnerId, learner.id))
      .orderBy(desc(learningProgress.updatedAt));
    const savedArt = await db
      .select()
      .from(artworks)
      .where(eq(artworks.learnerId, learner.id))
      .orderBy(desc(artworks.updatedAt));
    const bookings = await db
      .select()
      .from(teacherBookings)
      .where(eq(teacherBookings.learnerId, learner.id))
      .orderBy(desc(teacherBookings.createdAt));
    const customContent = await db
      .select()
      .from(contentItems)
      .where(eq(contentItems.authorUserId, user.userId))
      .orderBy(desc(contentItems.createdAt));

    return Response.json({
      authenticated: true,
      owner: { displayName: user.displayName, email: user.email },
      learners: learnerProfiles,
      learner,
      progress,
      artworks: savedArt,
      bookings,
      customContent,
    });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "Sign in is required." }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const action = clean(payload.action, 30);
    const db = getDb();
    let learner = await ensureLearner(user);
    const learnerId = requestedLearnerId(payload.learnerId);
    if (learnerId) {
      const [ownedLearner] = await db
        .select()
        .from(learners)
        .where(
          and(
            eq(learners.id, learnerId),
            eq(learners.ownerUserId, user.userId),
          ),
        )
        .limit(1);
      if (!ownedLearner) {
        return Response.json({ error: "Learner profile not found." }, { status: 404 });
      }
      learner = ownedLearner;
    }

    if (action === "learner-create") {
      const learnerProfiles = await db
        .select()
        .from(learners)
        .where(eq(learners.ownerUserId, user.userId))
        .orderBy(asc(learners.createdAt), asc(learners.id));
      if (learnerProfiles.length >= 6) {
        return Response.json(
          { error: "A family account can include up to six learners." },
          { status: 400 },
        );
      }
      const name = clean(payload.name, 30);
      const ageBand = clean(payload.ageBand, 10);
      const currentLevel = clamp(Number(payload.currentLevel) || 1, 1, 6);
      if (!name) {
        return Response.json({ error: "Learner name is required." }, { status: 400 });
      }
      const [createdLearner] = await db
        .insert(learners)
        .values({
          ownerUserId: user.userId,
          name,
          ageBand: ageBands.includes(ageBand) ? ageBand : "6–8",
          currentLevel,
        })
        .returning();
      return Response.json({
        ok: true,
        learner: createdLearner,
        learners: [...learnerProfiles, createdLearner],
      });
    }

    if (action === "progress") {
      const itemId = clean(payload.itemId, 80);
      const track = clean(payload.track, 30);
      const status = clean(payload.status, 20) || "completed";
      const score = clamp(Number(payload.score) || 0, 0, 100);
      if (!itemId || !track) {
        return Response.json({ error: "itemId and track are required" }, { status: 400 });
      }

      const [previous] = await db
        .select()
        .from(learningProgress)
        .where(
          and(
            eq(learningProgress.learnerId, learner.id),
            eq(learningProgress.itemId, itemId),
          ),
        )
        .limit(1);
      const improved = !previous || score > previous.score;
      const xpGain = improved ? clamp(Math.round(score / 5), 5, 20) : 1;

      await db
        .insert(learningProgress)
        .values({ learnerId: learner.id, itemId, track, status, score })
        .onConflictDoUpdate({
          target: [learningProgress.learnerId, learningProgress.itemId],
          set: {
            status,
            score: sql`MAX(${learningProgress.score}, ${score})`,
            attempts: sql`${learningProgress.attempts} + 1`,
            updatedAt: new Date().toISOString(),
          },
        });

      const nextXp = learner.xp + xpGain;
      await db
        .update(learners)
        .set({
          xp: nextXp,
          currentLevel: Math.max(learner.currentLevel, levelFromXp(nextXp)),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(learners.id, learner.id));
      const [updatedLearner] = await db
        .select()
        .from(learners)
        .where(eq(learners.id, learner.id))
        .limit(1);
      return Response.json({ ok: true, learner: updatedLearner, xpGain });
    }

    if (action === "artwork") {
      const sceneId = clean(payload.sceneId, 50);
      const title = clean(payload.title, 80);
      const strokesJson = clean(payload.strokesJson, 120_000);
      if (!sceneId || !title || !strokesJson) {
        return Response.json({ error: "Incomplete artwork" }, { status: 400 });
      }
      await db
        .insert(artworks)
        .values({ learnerId: learner.id, sceneId, title, strokesJson })
        .onConflictDoUpdate({
          target: [artworks.learnerId, artworks.sceneId],
          set: { title, strokesJson, updatedAt: new Date().toISOString() },
        });
      return Response.json({ ok: true });
    }

    if (action === "booking") {
      const teacherName = clean(payload.teacherName, 60);
      const lessonSlot = clean(payload.lessonSlot, 80);
      const focus = clean(payload.focus, 100) || "Conversation confidence";
      if (!teacherName || !lessonSlot) {
        return Response.json({ error: "Teacher and time are required" }, { status: 400 });
      }
      const [booking] = await db
        .insert(teacherBookings)
        .values({ learnerId: learner.id, teacherName, lessonSlot, focus })
        .returning();
      return Response.json({ ok: true, booking });
    }

    if (action === "profile") {
      const name = clean(payload.name, 30) || learner.name;
      const ageBand = clean(payload.ageBand, 10);
      const currentLevel = clamp(
        Number(payload.currentLevel) || learner.currentLevel,
        1,
        6,
      );
      await db
        .update(learners)
        .set({
          name,
          ageBand: ageBands.includes(ageBand) ? ageBand : learner.ageBand,
          currentLevel,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(learners.id, learner.id));
      [learner] = await db
        .select()
        .from(learners)
        .where(eq(learners.id, learner.id))
        .limit(1);
      return Response.json({ ok: true, learner });
    }

    if (action === "content") {
      const type = clean(payload.type, 20);
      const title = clean(payload.title, 80);
      const arabic = clean(payload.arabic, 1200);
      const english = clean(payload.english, 300);
      const level = clamp(Number(payload.level) || 1, 1, 6);
      if (!["story", "sentence", "game", "coloring", "lesson"].includes(type)) {
        return Response.json({ error: "Unsupported content type" }, { status: 400 });
      }
      if (!title || !arabic) {
        return Response.json({ error: "Title and Arabic content are required" }, { status: 400 });
      }
      const [item] = await db
        .insert(contentItems)
        .values({ authorUserId: user.userId, type, title, arabic, english, level })
        .returning();
      return Response.json({ ok: true, item });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return routeError(error);
  }
}
