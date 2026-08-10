import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: text("user_id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const learners = sqliteTable(
  "learners",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => users.userId, { onDelete: "cascade" }),
    name: text("name").notNull().default("My learner"),
    ageBand: text("age_band").notNull().default("6–8"),
    currentLevel: integer("current_level").notNull().default(1),
    xp: integer("xp").notNull().default(0),
    streak: integer("streak").notNull().default(1),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_learners_owner_user_id").on(table.ownerUserId),
  ],
);

export const learningProgress = sqliteTable(
  "learning_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    learnerId: integer("learner_id")
      .notNull()
      .references(() => learners.id, { onDelete: "cascade" }),
    track: text("track").notNull(),
    itemId: text("item_id").notNull(),
    status: text("status").notNull().default("started"),
    score: integer("score").notNull().default(0),
    attempts: integer("attempts").notNull().default(1),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_progress_learner_item").on(
      table.learnerId,
      table.itemId,
    ),
    index("idx_progress_learner_track").on(table.learnerId, table.track),
  ],
);

export const artworks = sqliteTable(
  "artworks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    learnerId: integer("learner_id")
      .notNull()
      .references(() => learners.id, { onDelete: "cascade" }),
    sceneId: text("scene_id").notNull(),
    title: text("title").notNull(),
    strokesJson: text("strokes_json").notNull(),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_artworks_learner_scene").on(
      table.learnerId,
      table.sceneId,
    ),
  ],
);

export const teacherBookings = sqliteTable(
  "teacher_bookings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    learnerId: integer("learner_id")
      .notNull()
      .references(() => learners.id, { onDelete: "cascade" }),
    teacherName: text("teacher_name").notNull(),
    lessonSlot: text("lesson_slot").notNull(),
    focus: text("focus").notNull().default("Conversation confidence"),
    status: text("status").notNull().default("requested"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_bookings_learner").on(table.learnerId)],
);

export const contentItems = sqliteTable(
  "content_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    authorUserId: text("author_user_id")
      .notNull()
      .references(() => users.userId, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    arabic: text("arabic").notNull(),
    english: text("english").notNull().default(""),
    level: integer("level").notNull().default(1),
    payloadJson: text("payload_json").notNull().default("{}"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_content_author_type_level").on(
      table.authorUserId,
      table.type,
      table.level,
    ),
  ],
);
