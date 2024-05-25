CREATE TABLE `members_to_products` (
	`member_id` text NOT NULL,
	`product_id` text NOT NULL,
	PRIMARY KEY(`member_id`, `product_id`),
	FOREIGN KEY (`member_id`) REFERENCES `member`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`settlement_id` text NOT NULL,
	FOREIGN KEY (`settlement_id`) REFERENCES `settlement`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`settlement_id` text NOT NULL,
	FOREIGN KEY (`settlement_id`) REFERENCES `settlement`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `settlement` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`owner` text NOT NULL,
	`is_public` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `member_settlement_idx` ON `member` (`settlement_id`);--> statement-breakpoint
CREATE INDEX `product_settlement_idx` ON `product` (`settlement_id`);