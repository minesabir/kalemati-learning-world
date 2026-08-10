CREATE TABLE `artworks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_id` integer NOT NULL,
	`scene_id` text NOT NULL,
	`title` text NOT NULL,
	`strokes_json` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_artworks_learner_scene` ON `artworks` (`learner_id`,`scene_id`);--> statement-breakpoint
CREATE TABLE `content_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`arabic` text NOT NULL,
	`english` text DEFAULT '' NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`payload_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_content_author_type_level` ON `content_items` (`author_user_id`,`type`,`level`);--> statement-breakpoint
CREATE TABLE `learners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_user_id` text NOT NULL,
	`name` text DEFAULT 'My learner' NOT NULL,
	`age_band` text DEFAULT '6–8' NOT NULL,
	`current_level` integer DEFAULT 1 NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`streak` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_learners_owner_user_id` ON `learners` (`owner_user_id`);--> statement-breakpoint
CREATE TABLE `learning_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_id` integer NOT NULL,
	`track` text NOT NULL,
	`item_id` text NOT NULL,
	`status` text DEFAULT 'started' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`attempts` integer DEFAULT 1 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_progress_learner_item` ON `learning_progress` (`learner_id`,`item_id`);--> statement-breakpoint
CREATE INDEX `idx_progress_learner_track` ON `learning_progress` (`learner_id`,`track`);--> statement-breakpoint
CREATE TABLE `teacher_bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_id` integer NOT NULL,
	`teacher_name` text NOT NULL,
	`lesson_slot` text NOT NULL,
	`focus` text DEFAULT 'Conversation confidence' NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_bookings_learner` ON `teacher_bookings` (`learner_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
PRAGMA optimize;
