DROP INDEX `idx_learners_owner_user_id`;--> statement-breakpoint
CREATE INDEX `idx_learners_owner_user_id` ON `learners` (`owner_user_id`);