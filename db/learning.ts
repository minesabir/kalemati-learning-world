import { eq } from "drizzle-orm";
import type { ChatGPTUser } from "../app/chatgpt-auth";
import { getDb } from ".";
import { learners, users } from "./schema";

export async function ensureLearner(user: ChatGPTUser) {
  const db = getDb();
  await db
    .insert(users)
    .values({
      userId: user.userId,
      email: user.email,
      displayName: user.displayName,
    })
    .onConflictDoUpdate({
      target: users.userId,
      set: {
        email: user.email,
        displayName: user.displayName,
        updatedAt: new Date().toISOString(),
      },
    });

  const [existing] = await db
    .select()
    .from(learners)
    .where(eq(learners.ownerUserId, user.userId))
    .limit(1);

  if (existing) return existing;

  const inferredName = user.fullName?.split(" ")[0] || "My learner";
  const [created] = await db
    .insert(learners)
    .values({ ownerUserId: user.userId, name: inferredName })
    .returning();
  return created;
}
