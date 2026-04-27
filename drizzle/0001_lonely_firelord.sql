CREATE TABLE `promotionalVideos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoNumber` int NOT NULL,
	`title` varchar(255) NOT NULL DEFAULT '宣傳片',
	`videoUrl` text,
	`videoKey` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `promotionalVideos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `works` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workNumber` int NOT NULL,
	`title` varchar(255) NOT NULL DEFAULT '作品',
	`author` varchar(255) NOT NULL DEFAULT '創作者',
	`image1Url` text,
	`image1Key` varchar(255),
	`image2Url` text,
	`image2Key` varchar(255),
	`videoUrl` text,
	`videoKey` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `works_id` PRIMARY KEY(`id`)
);
