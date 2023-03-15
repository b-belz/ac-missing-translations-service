DROP TABLE IF EXISTS `usertask`;
CREATE TABLE `usertask` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `task` json DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `flag` tinyint(1) DEFAULT '0',
  `readTimestamp` int DEFAULT NULL,
  `customerId` int DEFAULT NULL,
  `creatorId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

