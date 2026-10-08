CREATE TABLE `r_campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`data` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rCampaigns_lookup` ON `r_campaigns` (`owner_id`);--> statement-breakpoint
CREATE TABLE `r_events` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`team_id` text,
	`kind` text NOT NULL,
	`detail` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rEvents_lookup` ON `r_events` (`session_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `r_locations` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`team_id` text NOT NULL,
	`lat` text NOT NULL,
	`lng` text NOT NULL,
	`accuracy` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rLocations_lookup` ON `r_locations` (`session_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `r_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`team_id` text,
	`channel` text NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rMessages_lookup` ON `r_messages` (`session_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `r_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`team_id` text NOT NULL,
	`mission_id` text NOT NULL,
	`object_key` text NOT NULL,
	`caption` text NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`reviewed` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `r_photos_team_mission` ON `r_photos` (`team_id`,`mission_id`);--> statement-breakpoint
CREATE INDEX `r_photos_session` ON `r_photos` (`session_id`);--> statement-breakpoint
CREATE TABLE `r_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`mode` text NOT NULL,
	`status` text NOT NULL,
	`duration` integer NOT NULL,
	`campaign` text NOT NULL,
	`started_at` integer,
	`deadline` integer,
	`paused_at` integer,
	`paused_ms` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `r_sessions_code_unique` ON `r_sessions` (`code`);--> statement-breakpoint
CREATE INDEX `rSessions_lookup` ON `r_sessions` (`owner_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `r_teams` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`name` text NOT NULL,
	`members` text NOT NULL,
	`token_hash` text NOT NULL,
	`recovery_hash` text NOT NULL,
	`state` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`lat` text,
	`lng` text,
	`accuracy` text,
	`located_at` integer,
	`distance` integer DEFAULT 0 NOT NULL,
	`steps` integer DEFAULT 0 NOT NULL,
	`steps_supported` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rTeams_lookup` ON `r_teams` (`session_id`);