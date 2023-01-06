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


-- Dumping database structure for tugas_sistem_informasi_semester_3
CREATE DATABASE IF NOT EXISTS `tugas_sistem_informasi_semester_3` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `tugas_sistem_informasi_semester_3`;

-- Dumping structure for table tugas_sistem_informasi_semester_3.books
CREATE TABLE IF NOT EXISTS `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(1000) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `year` varchar(50) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `link_read` varchar(1000) DEFAULT NULL,
  `list_price` varchar(11) DEFAULT NULL,
  `retail_price` varchar(11) DEFAULT NULL,
  `currency` varchar(5) DEFAULT NULL,
  `is_completed` tinyint(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `FK_books_users` (`user_id`),
  CONSTRAINT `FK_books_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table tugas_sistem_informasi_semester_3.books: ~0 rows (approximately)

-- Dumping structure for table tugas_sistem_informasi_semester_3.currency
CREATE TABLE IF NOT EXISTS `currency` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `code` varchar(3) DEFAULT NULL,
  `symbol` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8;

-- Dumping data for table tugas_sistem_informasi_semester_3.currency: ~113 rows (approximately)
INSERT INTO `currency` (`id`, `name`, `code`, `symbol`) VALUES
	(1, 'Leke', 'ALL', 'Lek'),
	(2, 'Dollars', 'USD', '$'),
	(3, 'Afghanis', 'AFN', '؋'),
	(4, 'Pesos', 'ARS', '$'),
	(5, 'Guilders', 'AWG', 'ƒ'),
	(6, 'Dollars', 'AUD', '$'),
	(7, 'New Manats', 'AZN', 'ман'),
	(8, 'Dollars', 'BSD', '$'),
	(9, 'Dollars', 'BBD', '$'),
	(10, 'Rubles', 'BYR', 'p.'),
	(11, 'Euro', 'EUR', '€'),
	(12, 'Dollars', 'BZD', 'BZ$'),
	(13, 'Dollars', 'BMD', '$'),
	(14, 'Bolivianos', 'BOB', '$b'),
	(15, 'Convertible Marka', 'BAM', 'KM'),
	(16, 'Pula', 'BWP', 'P'),
	(17, 'Leva', 'BGN', 'лв'),
	(18, 'Reais', 'BRL', 'R$'),
	(19, 'Pounds', 'GBP', '£'),
	(20, 'Dollars', 'BND', '$'),
	(21, 'Riels', 'KHR', '៛'),
	(22, 'Dollars', 'CAD', '$'),
	(23, 'Dollars', 'KYD', '$'),
	(24, 'Pesos', 'CLP', '$'),
	(25, 'Yuan Renminbi', 'CNY', '¥'),
	(26, 'Pesos', 'COP', '$'),
	(27, 'Colón', 'CRC', '₡'),
	(28, 'Kuna', 'HRK', 'kn'),
	(29, 'Pesos', 'CUP', '₱'),
	(30, 'Koruny', 'CZK', 'Kč'),
	(31, 'Kroner', 'DKK', 'kr'),
	(32, 'Pesos', 'DOP', 'RD$'),
	(33, 'Dollars', 'XCD', '$'),
	(34, 'Pounds', 'EGP', '£'),
	(35, 'Colones', 'SVC', '$'),
	(36, 'Pounds', 'FKP', '£'),
	(37, 'Dollars', 'FJD', '$'),
	(38, 'Cedis', 'GHC', '¢'),
	(39, 'Pounds', 'GIP', '£'),
	(40, 'Quetzales', 'GTQ', 'Q'),
	(41, 'Pounds', 'GGP', '£'),
	(42, 'Dollars', 'GYD', '$'),
	(43, 'Lempiras', 'HNL', 'L'),
	(44, 'Dollars', 'HKD', '$'),
	(45, 'Forint', 'HUF', 'Ft'),
	(46, 'Kronur', 'ISK', 'kr'),
	(47, 'Rupees', 'INR', 'Rp'),
	(48, 'Rupiahs', 'IDR', 'Rp'),
	(49, 'Rials', 'IRR', '﷼'),
	(50, 'Pounds', 'IMP', '£'),
	(51, 'New Shekels', 'ILS', '₪'),
	(52, 'Dollars', 'JMD', 'J$'),
	(53, 'Yen', 'JPY', '¥'),
	(54, 'Pounds', 'JEP', '£'),
	(55, 'Tenge', 'KZT', 'лв'),
	(56, 'Won', 'KPW', '₩'),
	(57, 'Won', 'KRW', '₩'),
	(58, 'Soms', 'KGS', 'лв'),
	(59, 'Kips', 'LAK', '₭'),
	(60, 'Lati', 'LVL', 'Ls'),
	(61, 'Pounds', 'LBP', '£'),
	(62, 'Dollars', 'LRD', '$'),
	(63, 'Switzerland Francs', 'CHF', 'CHF'),
	(64, 'Litai', 'LTL', 'Lt'),
	(65, 'Denars', 'MKD', 'ден'),
	(66, 'Ringgits', 'MYR', 'RM'),
	(67, 'Rupees', 'MUR', '₨'),
	(68, 'Pesos', 'MXN', '$'),
	(69, 'Tugriks', 'MNT', '₮'),
	(70, 'Meticais', 'MZN', 'MT'),
	(71, 'Dollars', 'NAD', '$'),
	(72, 'Rupees', 'NPR', '₨'),
	(73, 'Guilders', 'ANG', 'ƒ'),
	(74, 'Dollars', 'NZD', '$'),
	(75, 'Cordobas', 'NIO', 'C$'),
	(76, 'Nairas', 'NGN', '₦'),
	(77, 'Krone', 'NOK', 'kr'),
	(78, 'Rials', 'OMR', '﷼'),
	(79, 'Rupees', 'PKR', '₨'),
	(80, 'Balboa', 'PAB', 'B/.'),
	(81, 'Guarani', 'PYG', 'Gs'),
	(82, 'Nuevos Soles', 'PEN', 'S/.'),
	(83, 'Pesos', 'PHP', 'Php'),
	(84, 'Zlotych', 'PLN', 'zł'),
	(85, 'Rials', 'QAR', '﷼'),
	(86, 'New Lei', 'RON', 'lei'),
	(87, 'Rubles', 'RUB', 'руб'),
	(88, 'Pounds', 'SHP', '£'),
	(89, 'Riyals', 'SAR', '﷼'),
	(90, 'Dinars', 'RSD', 'Дин.'),
	(91, 'Rupees', 'SCR', '₨'),
	(92, 'Dollars', 'SGD', '$'),
	(93, 'Dollars', 'SBD', '$'),
	(94, 'Shillings', 'SOS', 'S'),
	(95, 'Rand', 'ZAR', 'R'),
	(96, 'Rupees', 'LKR', '₨'),
	(97, 'Kronor', 'SEK', 'kr'),
	(98, 'Dollars', 'SRD', '$'),
	(99, 'Pounds', 'SYP', '£'),
	(100, 'New Dollars', 'TWD', 'NT$'),
	(101, 'Baht', 'THB', '฿'),
	(102, 'Dollars', 'TTD', 'TT$'),
	(103, 'Lira', 'TRY', '₺'),
	(104, 'Liras', 'TRL', '£'),
	(105, 'Dollars', 'TVD', '$'),
	(106, 'Hryvnia', 'UAH', '₴'),
	(107, 'Pesos', 'UYU', '$U'),
	(108, 'Sums', 'UZS', 'лв'),
	(109, 'Bolivares Fuertes', 'VEF', 'Bs'),
	(110, 'Dong', 'VND', '₫'),
	(111, 'Rials', 'YER', '﷼'),
	(112, 'Zimbabwe Dollars', 'ZWD', 'Z$'),
	(113, 'Rupees', 'INR', '₹');

-- Dumping structure for table tugas_sistem_informasi_semester_3.login_session
CREATE TABLE IF NOT EXISTS `login_session` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `jwt_token` varchar(255) NOT NULL,
  `is_valid` tinyint(1) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `jwt_token` (`jwt_token`),
  KEY `FK_login_session_users` (`user_id`),
  CONSTRAINT `FK_login_session_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table tugas_sistem_informasi_semester_3.login_session: ~0 rows (approximately)

-- Dumping structure for table tugas_sistem_informasi_semester_3.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL DEFAULT 'user',
  `password` varchar(100) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table tugas_sistem_informasi_semester_3.users: ~1 rows (approximately)
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `photo`, `created_at`, `updated_at`) VALUES
	(1, 'Rizal Fauzi', 'rizlfauzy', 'rizalfauzi774@gmail.com', '$2b$10$hQVDh3oS6xtYkzqnY1YGzutpJVcQO345ObLeFjh5L9gWeBhosttc6', 'foto_resmi_rizal_fauzi.jpeg', '2023-01-02 10:02:04', '2023-01-06 08:12:03');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
