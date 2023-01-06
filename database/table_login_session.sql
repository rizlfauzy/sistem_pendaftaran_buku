-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.24-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.2.0.6576
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table sticker_cut.login_session
CREATE TABLE IF NOT EXISTS `login_session` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `user_login_id` int(4) NOT NULL,
  `jwt_token` varchar(255) NOT NULL,
  `is_valid` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `jwt_token` (`jwt_token`),
  KEY `user_login_id` (`user_login_id`),
  CONSTRAINT `login_session_ibfk_1` FOREIGN KEY (`user_login_id`) REFERENCES `user_login_data` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table sticker_cut.login_session: ~3 rows (approximately)
INSERT INTO `login_session` (`id`, `user_login_id`, `jwt_token`, `is_valid`, `created_at`) VALUES
	(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN1cGVyYWRtaW4iLCJpYXQiOjE2NTg1NTkwMjQsImV4cCI6MTY1ODU4MDYyNH0.NQ6we1kwXGcbzAQbVTUpmxM6V563YVtcFwnkNdy8yg0', 0, '2022-07-23 06:50:24'),
	(2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN1cGVyYWRtaW4iLCJpYXQiOjE2NTg1NTk5NjEsImV4cCI6MTY1ODU4MTU2MX0.ATOQy7axC4XDrrUaiBZMhRGsDBkc-pXDRoNZzZqP6KA', 1, '2022-07-23 07:06:01'),
	(3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN1cGVyYWRtaW4iLCJpYXQiOjE2NTg3NTc4MzEsImV4cCI6MTY1ODc3OTQzMX0.tQ8SKssZLEJL8XzIhQwc4ZPv8kc13otOu0G9xMQaF4I', 1, '2022-07-25 14:03:51');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
