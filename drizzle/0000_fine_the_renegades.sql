CREATE TABLE `arcade_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`game` text NOT NULL,
	`started` integer NOT NULL,
	`used` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `arcade_scores` (
	`id` text PRIMARY KEY NOT NULL,
	`game` text NOT NULL,
	`name` text NOT NULL,
	`score` integer NOT NULL,
	`created` integer NOT NULL
);
