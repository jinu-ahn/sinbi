DROP TABLE IF EXISTS `Account`;
CREATE TABLE `Account` (
  `account_id` bigint NOT NULL AUTO_INCREMENT,
  `account_num` varchar(255) NOT NULL,
  `amount` bigint NOT NULL,
  `bank_type` enum('HANA','IBK','IM','KAKAO','KB','NH','SHINHAN','SINBI','TOSS','WOORI') NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_phone` varchar(255) NOT NULL,
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Receiver`;
CREATE TABLE `Receiver` (
  `recv_id` bigint NOT NULL AUTO_INCREMENT,
  `bank_type` enum('HANA','IBK','IM','KAKAO','KB','NH','SHINHAN','SINBI','TOSS','WOORI') NOT NULL,
  `recv_account_num` varchar(255) NOT NULL,
  `recv_alias` varchar(255) DEFAULT NULL,
  `recv_name` varchar(255) NOT NULL,
  `user_phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`recv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `TransactionHistory`;
CREATE TABLE `TransactionHistory` (
  `transaction_history_id` bigint NOT NULL AUTO_INCREMENT,
  `history_date` datetime(6) DEFAULT NULL,
  `bank_type` enum('HANA','IBK','IM','KAKAO','KB','NH','SHINHAN','SINBI','TOSS','WOORI') NOT NULL,
  `recv_account_name` varchar(255) NOT NULL,
  `recv_account_num` varchar(255) NOT NULL,
  `transaction_history_type` varchar(255) NOT NULL,
  `transfer_amount` varchar(255) NOT NULL,
  `account_id` bigint DEFAULT NULL,
  PRIMARY KEY (`transaction_history_id`),
  KEY `FK7h4ku74wnkg1yl04be2ox9pwp` (`account_id`),
  CONSTRAINT `FK7h4ku74wnkg1yl04be2ox9pwp` FOREIGN KEY (`account_id`) REFERENCES `Account` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `user_face_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_phone` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `User_roles`;
CREATE TABLE `User_roles` (
  `User_user_id` bigint NOT NULL,
  `roles` varchar(255) DEFAULT NULL,
  KEY `FKetvx2foidy555fbdl4rqewtcr` (`User_user_id`),
  CONSTRAINT `FKetvx2foidy555fbdl4rqewtcr` FOREIGN KEY (`User_user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `VirtualAccount`;
CREATE TABLE `VirtualAccount` (
  `virtual_account_id` bigint NOT NULL AUTO_INCREMENT,
  `account_num` varchar(255) NOT NULL,
  `amount` bigint NOT NULL,
  `bank_type` enum('HANA','IBK','IM','KAKAO','KB','NH','SHINHAN','SINBI','TOSS','WOORI') NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_phone` varchar(255) NOT NULL,
  `virtual_account_password` int NOT NULL,
  PRIMARY KEY (`virtual_account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


