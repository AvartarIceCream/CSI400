CREATE TABLE `week4` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(365) NOT NULL,
  `role` varchar(45) NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`user_id`,`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci