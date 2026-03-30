SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `six_huit_production`
--

-- --------------------------------------------------------

--
-- Table structure for table `adultaccount`
--

CREATE TABLE `adultaccount` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `teacher` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `childaccount`
--

CREATE TABLE `childaccount` (
  `id` int NOT NULL AUTO_INCREMENT,
  `adultId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `age` int DEFAULT NULL,
  `instrument` varchar(100) DEFAULT NULL,
  `duree` int DEFAULT NULL,
  `ecole` varchar(255) DEFAULT NULL,
  `mascotte` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `adultId` (`adultId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adultchildpermissions`
--

CREATE TABLE `adultchildpermissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `adult_id` int NOT NULL,
  `child_id` int NOT NULL,
  `can_view` tinyint(1) DEFAULT '0',
  `can_edit` tinyint(1) DEFAULT '0',
  `can_view_sessions` tinyint(1) DEFAULT '0',
  `can_edit_weekly_plan` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `adult_id` (`adult_id`),
  KEY `child_id` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auditlog`
--

CREATE TABLE `auditlog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `action_type` enum('session_created','weekly_plan_changed','streak_updated','login','logout') NOT NULL,
  `action_details` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `child_id` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `following`
--

CREATE TABLE `following` (
  `following_child_id` int NOT NULL,
  `followed_child_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`following_child_id`,`followed_child_id`),
  KEY `followed_child_id` (`followed_child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `session_date` date NOT NULL,
  `hapiness` tinyint NOT NULL,
  `quality` tinyint NOT NULL,
  `practice_day` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `child_id` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `streaks`
--

CREATE TABLE `streaks` (
  `child_id` int NOT NULL,
  `current_streak` int DEFAULT '0',
  `last_practice_date` date DEFAULT NULL,
  PRIMARY KEY (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `weekly_plan`
--

CREATE TABLE `weekly_plan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `day_of_week` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  `practice` tinyint(1) DEFAULT '0',
  `color` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `child_id` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Constraints for Foreign Keys
--

ALTER TABLE `adultchildpermissions`
  ADD CONSTRAINT `adultchildpermissions_ibfk_1` FOREIGN KEY (`adult_id`) REFERENCES `adultaccount` (`id`),
  ADD CONSTRAINT `adultchildpermissions_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `childaccount` (`id`);

ALTER TABLE `auditlog`
  ADD CONSTRAINT `auditlog_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `childaccount` (`id`);

ALTER TABLE `childaccount`
  ADD CONSTRAINT `childaccount_ibfk_1` FOREIGN KEY (`adultId`) REFERENCES `adultaccount` (`id`);

ALTER TABLE `following`
  ADD CONSTRAINT `following_ibfk_1` FOREIGN KEY (`following_child_id`) REFERENCES `childaccount` (`id`),
  ADD CONSTRAINT `following_ibfk_2` FOREIGN KEY (`followed_child_id`) REFERENCES `childaccount` (`id`);

ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `childaccount` (`id`);

ALTER TABLE `streaks`
  ADD CONSTRAINT `streaks_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `childaccount` (`id`);

ALTER TABLE `weekly_plan`
  ADD CONSTRAINT `weekly_plan_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `childaccount` (`id`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;