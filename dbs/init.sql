--
-- docker create
--

CREATE USER docker;
CREATE DATABASE docker;
USE docker;


-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 29, 2021 at 12:59 PM
-- Server version: 5.7.24
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pai_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `charts`
--

CREATE TABLE `charts` (
  `Chart_ID` int(11) UNSIGNED NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Project_ID` int(11) UNSIGNED NOT NULL,
  `Chart_Leader` int(11) UNSIGNED NOT NULL,
  `Description` varchar(5000) DEFAULT NULL,
  `Private` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `charts`
--

INSERT INTO `charts` (`Chart_ID`, `Name`, `Project_ID`, `Chart_Leader`, `Description`, `Private`) VALUES
(1, 'Phone Model logistic', 1, 2, NULL, 0),
(2, 'Phone Documentation Site', 1, 3, NULL, 0),
(3, 'New Website', 2, 1, NULL, 0),
(4, 'New Agreement Project', 3, 5, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `columns`
--

CREATE TABLE `columns` (
  `Col_ID` int(11) UNSIGNED NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Chart_ID` int(11) UNSIGNED NOT NULL,
  `Archive` tinyint(1) NOT NULL DEFAULT '0',
  `Position` int(2) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `columns`
--

INSERT INTO `columns` (`Col_ID`, `Name`, `Chart_ID`, `Archive`, `Position`) VALUES
(1, 'To Do', 1, 0, 1),
(2, 'On Table', 1, 0, 2),
(3, 'Done', 1, 0, 3),
(4, 'To Do', 2, 0, 1),
(5, 'In progress', 2, 0, 2),
(6, 'Review', 2, 0, 3),
(7, 'Done', 2, 0, 4),
(8, 'To Do', 3, 0, 1),
(9, 'In Progress', 3, 0, 2),
(10, 'Done', 3, 0, 3),
(11, 'To do', 4, 0, 1),
(12, 'In Progress', 4, 0, 2),
(13, 'Done', 4, 0, 3),
(14, 'Archive', 4, 0, 4),
(15, 'Other', 4, 0, 5);

-- --------------------------------------------------------

--
-- Table structure for table `fields`
--

CREATE TABLE `fields` (
  `Field_ID` int(11) UNSIGNED NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Alias` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `fields`
--

INSERT INTO `fields` (`Field_ID`, `Name`, `Alias`) VALUES
(1, 'Frontend Dev', 'FEND'),
(2, 'Backend Dev', 'BEND'),
(3, 'Logistic', 'LOGI'),
(4, 'Human Resources', 'HRES'),
(5, 'Validation', 'VALD');

-- --------------------------------------------------------

--
-- Table structure for table `mid1_fi_us`
--

CREATE TABLE `mid1_fi_us` (
  `ID` int(11) NOT NULL,
  `User` int(11) UNSIGNED NOT NULL,
  `Field` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mid1_fi_us`
--

INSERT INTO `mid1_fi_us` (`ID`, `User`, `Field`) VALUES
(1, 1, 3),
(2, 1, 4),
(3, 1, 5),
(4, 2, 1),
(5, 2, 3),
(6, 3, 2),
(7, 3, 4),
(8, 3, 5),
(9, 4, 2),
(10, 5, 1),
(11, 5, 2),
(12, 5, 4),
(13, 6, 3),
(14, 6, 5);

-- --------------------------------------------------------

--
-- Table structure for table `mid2_or_us`
--

CREATE TABLE `mid2_or_us` (
  `ID` int(11) NOT NULL,
  `Organisation` int(11) UNSIGNED NOT NULL,
  `User` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mid2_or_us`
--

INSERT INTO `mid2_or_us` (`ID`, `Organisation`, `User`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 2, 4),
(5, 2, 5),
(6, 2, 6);

-- --------------------------------------------------------

--
-- Table structure for table `mid3_pro_us`
--

CREATE TABLE `mid3_pro_us` (
  `ID` int(11) NOT NULL,
  `Project` int(11) UNSIGNED NOT NULL,
  `User` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mid3_pro_us`
--

INSERT INTO `mid3_pro_us` (`ID`, `Project`, `User`) VALUES
(1, 1, 3),
(2, 1, 2),
(3, 2, 1),
(4, 2, 2),
(5, 2, 3),
(6, 3, 5),
(7, 3, 4),
(8, 3, 6);

-- --------------------------------------------------------

--
-- Table structure for table `mid4_ch_us`
--

CREATE TABLE `mid4_ch_us` (
  `ID` int(11) NOT NULL,
  `Chart` int(11) UNSIGNED NOT NULL,
  `User` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mid4_ch_us`
--

INSERT INTO `mid4_ch_us` (`ID`, `Chart`, `User`) VALUES
(1, 1, 2),
(2, 1, 1),
(3, 1, 3),
(4, 2, 3),
(5, 2, 1),
(6, 3, 1),
(7, 4, 5),
(8, 4, 4),
(9, 4, 6);

-- --------------------------------------------------------

--
-- Table structure for table `mid5_no_us`
--

CREATE TABLE `mid5_no_us` (
  `ID` int(11) NOT NULL,
  `Note` int(11) UNSIGNED NOT NULL,
  `User` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mid5_no_us`
--

INSERT INTO `mid5_no_us` (`ID`, `Note`, `User`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 13, 6);

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `Note_ID` int(11) UNSIGNED NOT NULL,
  `Title_note` varchar(50) NOT NULL,
  `Col_ID` int(11) UNSIGNED NOT NULL,
  `Field_ID` int(11) UNSIGNED NOT NULL,
  `Color` varchar(6) NOT NULL DEFAULT '5e7cb8' COMMENT '[HEX] color representation',
  `Description` varchar(5000) DEFAULT NULL,
  `Owner` int(11) UNSIGNED NOT NULL,
  `Date_Create` date NOT NULL,
  `Date_End` date DEFAULT NULL,
  `SEV_level` int(1) NOT NULL DEFAULT '4',
  `Urgent` tinyint(1) NOT NULL DEFAULT '0',
  `Done` tinyint(1) NOT NULL DEFAULT '0',
  `Archive` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`Note_ID`, `Title_note`, `Col_ID`, `Field_ID`, `Color`, `Description`, `Owner`, `Date_Create`, `Date_End`, `SEV_level`, `Urgent`, `Done`, `Archive`) VALUES
(1, 'Plan', 2, 3, '5e7cb8', 'Make a workflow and goals', 2, '2021-05-25', NULL, 4, 0, 0, 0),
(2, 'Project', 3, 4, '5e7cb8', 'Organise project contributors', 3, '2021-05-25', NULL, 1, 0, 1, 0),
(3, 'Project', 10, 1, '5e7cb8', 'Note1', 2, '2021-05-25', NULL, 2, 0, 0, 0),
(4, 'Project', 1, 2, '5e7cb8', 'Note2', 3, '2021-05-25', NULL, 3, 0, 0, 0),
(5, 'Project', 1, 3, '5e7cb8', 'Note3', 3, '2021-05-25', NULL, 2, 0, 0, 0),
(6, 'Documentation', 5, 3, '5e7cb8', 'Note1', 2, '2021-05-25', NULL, 2, 1, 0, 0),
(7, 'Documentation', 4, 1, '5e7cb8', 'Note2', 3, '2021-05-25', NULL, 2, 0, 0, 0),
(8, 'Site', 4, 1, '5e7cb8', 'Note3', 3, '2021-05-25', NULL, 1, 0, 0, 0),
(9, 'Site', 5, 2, '5e7cb8', 'Note4', 3, '2021-05-25', NULL, 1, 0, 0, 0),
(10, 'Site', 7, 4, '5e7cb8', 'Note5', 2, '2021-05-25', NULL, 1, 0, 1, 0),
(11, 'Front', 8, 1, '5e7cb8', 'Note1', 1, '2021-05-25', NULL, 2, 0, 0, 0),
(12, 'Back', 8, 2, '5e7cb8', 'Note2', 1, '2021-05-25', NULL, 2, 0, 0, 0),
(13, 'DataBase', 8, 3, '5e7cb8', 'Note3', 1, '2021-05-25', NULL, 1, 0, 0, 0),
(14, 'Site', 9, 3, '5e7cb8', 'Note4', 1, '2021-05-25', NULL, 1, 1, 0, 0),
(15, 'Site', 10, 4, '5e7cb8', 'Note5', 1, '2021-05-25', NULL, 1, 0, 1, 0),
(16, 'Paper', 11, 3, '5e7cb8', 'Note1', 6, '2021-05-25', NULL, 1, 0, 0, 0),
(17, 'Paper', 12, 4, '5e7cb8', 'Note2', 5, '2021-05-25', NULL, 2, 1, 0, 0),
(18, 'Site', 12, 2, '5e7cb8', 'Note3', 4, '2021-05-25', NULL, 4, 0, 0, 0),
(19, 'Paper', 14, 3, '5e7cb8', 'Note4', 5, '2021-05-25', NULL, 4, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `organisation`
--

CREATE TABLE `organisation` (
  `Org_ID` int(11) UNSIGNED NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Leader_ID` int(11) UNSIGNED NOT NULL,
  `Description` text,
  `Private` tinyint(1) NOT NULL DEFAULT '0',
  `Register` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `organisation`
--

INSERT INTO `organisation` (`Org_ID`, `Name`, `Leader_ID`, `Description`, `Private`, `Register`) VALUES
(1, 'JohnyPhonex', 1, NULL, 0, '2021-05-25'),
(2, 'JoePotatoes', 5, NULL, 1, '2021-05-25');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `Proj_ID` int(11) UNSIGNED NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Org_ID` int(11) UNSIGNED NOT NULL,
  `Proj_Leader_ID` int(11) UNSIGNED NOT NULL,
  `Description` varchar(5000) DEFAULT NULL,
  `Private` tinyint(1) NOT NULL DEFAULT '0',
  `Date_create` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`Proj_ID`, `Name`, `Org_ID`, `Proj_Leader_ID`, `Description`, `Private`, `Date_create`) VALUES
(1, 'NewPhone', 1, 3, NULL, 0, '2021-05-25'),
(2, 'Brand New Website', 1, 1, NULL, 0, '2021-05-25'),
(3, 'New Agreement', 2, 4, NULL, 0, '2021-05-25');

-- --------------------------------------------------------

--
-- Table structure for table `severity`
--

CREATE TABLE `severity` (
  `ID` int(11) NOT NULL,
  `Description` varchar(20) NOT NULL,
  `Alias` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `severity`
--

INSERT INTO `severity` (`ID`, `Description`, `Alias`) VALUES
(1, 'Critical Impact', 'SEV1'),
(2, 'Significant Impact', 'SEV2'),
(3, 'Low Impact', 'SEV3'),
(4, 'None Impact', 'None');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `User_ID` int(11) UNSIGNED NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Alias` varchar(6) NOT NULL,
  `Country` varchar(255) DEFAULT NULL,
  `Register` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`User_ID`, `Name`, `Password`, `Alias`, `Country`, `Register`) VALUES
(1, 'ExampleJohn', '1234', 'ExJohn', 'pl', '2021-05-25'),
(2, 'ExampleAna', '1234', 'ExaAna', 'en', '2021-05-25'),
(3, 'ExampleDanny', '1234', 'ExaDan', 'fr', '2021-05-25'),
(4, 'ExampleSteve', '1234', 'ExaSte', 'de', '2021-05-25'),
(5, 'ExampleJoe', '1234', 'ExaJoe', NULL, '2021-05-25'),
(6, 'ExampleMisako', '1234', 'ExMisa', 'JP', '2021-05-25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `charts`
--
ALTER TABLE `charts`
  ADD PRIMARY KEY (`Chart_ID`),
  ADD KEY `Chart_Leader` (`Chart_Leader`),
  ADD KEY `Project_ID` (`Project_ID`);

--
-- Indexes for table `columns`
--
ALTER TABLE `columns`
  ADD PRIMARY KEY (`Col_ID`),
  ADD KEY `Chart_ID` (`Chart_ID`);

--
-- Indexes for table `fields`
--
ALTER TABLE `fields`
  ADD PRIMARY KEY (`Field_ID`),
  ADD UNIQUE KEY `Name` (`Name`),
  ADD UNIQUE KEY `Alias` (`Alias`);

--
-- Indexes for table `mid1_fi_us`
--
ALTER TABLE `mid1_fi_us`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User` (`User`),
  ADD KEY `Field` (`Field`);

--
-- Indexes for table `mid2_or_us`
--
ALTER TABLE `mid2_or_us`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User` (`User`),
  ADD KEY `Organisation` (`Organisation`);

--
-- Indexes for table `mid3_pro_us`
--
ALTER TABLE `mid3_pro_us`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User` (`User`),
  ADD KEY `Project` (`Project`);

--
-- Indexes for table `mid4_ch_us`
--
ALTER TABLE `mid4_ch_us`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User` (`User`),
  ADD KEY `Chart` (`Chart`);

--
-- Indexes for table `mid5_no_us`
--
ALTER TABLE `mid5_no_us`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User` (`User`),
  ADD KEY `Note` (`Note`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`Note_ID`),
  ADD KEY `Col_ID` (`Col_ID`),
  ADD KEY `Owner` (`Owner`),
  ADD KEY `Field_ID` (`Field_ID`),
  ADD KEY `SEV_level` (`SEV_level`);

--
-- Indexes for table `organisation`
--
ALTER TABLE `organisation`
  ADD PRIMARY KEY (`Org_ID`),
  ADD UNIQUE KEY `Name` (`Name`),
  ADD KEY `Leader_ID` (`Leader_ID`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`Proj_ID`),
  ADD UNIQUE KEY `Name` (`Name`),
  ADD KEY `Proj_Leader_ID` (`Proj_Leader_ID`),
  ADD KEY `Org_ID` (`Org_ID`);

--
-- Indexes for table `severity`
--
ALTER TABLE `severity`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Alias` (`Alias`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Name` (`Name`),
  ADD UNIQUE KEY `Alias` (`Alias`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `charts`
--
ALTER TABLE `charts`
  MODIFY `Chart_ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `columns`
--
ALTER TABLE `columns`
  MODIFY `Col_ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `fields`
--
ALTER TABLE `fields`
  MODIFY `Field_ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `mid1_fi_us`
--
ALTER TABLE `mid1_fi_us`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `mid2_or_us`
--
ALTER TABLE `mid2_or_us`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mid3_pro_us`
--
ALTER TABLE `mid3_pro_us`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `mid4_ch_us`
--
ALTER TABLE `mid4_ch_us`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `mid5_no_us`
--
ALTER TABLE `mid5_no_us`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `Note_ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `organisation`
--
ALTER TABLE `organisation`
  MODIFY `Org_ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `Proj_ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `severity`
--
ALTER TABLE `severity`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `User_ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `charts`
--
ALTER TABLE `charts`
  ADD CONSTRAINT `charts_ibfk_1` FOREIGN KEY (`Chart_Leader`) REFERENCES `user` (`User_ID`),
  ADD CONSTRAINT `charts_ibfk_2` FOREIGN KEY (`Project_ID`) REFERENCES `projects` (`Proj_ID`);

--
-- Constraints for table `columns`
--
ALTER TABLE `columns`
  ADD CONSTRAINT `columns_ibfk_1` FOREIGN KEY (`Chart_ID`) REFERENCES `charts` (`Chart_ID`);

--
-- Constraints for table `mid1_fi_us`
--
ALTER TABLE `mid1_fi_us`
  ADD CONSTRAINT `mid1_fi_us_ibfk_1` FOREIGN KEY (`User`) REFERENCES `user` (`User_ID`),
  ADD CONSTRAINT `mid1_fi_us_ibfk_2` FOREIGN KEY (`Field`) REFERENCES `fields` (`Field_ID`);

--
-- Constraints for table `mid2_or_us`
--
ALTER TABLE `mid2_or_us`
  ADD CONSTRAINT `mid2_or_us_ibfk_1` FOREIGN KEY (`User`) REFERENCES `user` (`User_ID`),
  ADD CONSTRAINT `mid2_or_us_ibfk_2` FOREIGN KEY (`Organisation`) REFERENCES `organisation` (`Org_ID`);

--
-- Constraints for table `mid3_pro_us`
--
ALTER TABLE `mid3_pro_us`
  ADD CONSTRAINT `mid3_pro_us_ibfk_1` FOREIGN KEY (`User`) REFERENCES `user` (`User_ID`),
  ADD CONSTRAINT `mid3_pro_us_ibfk_2` FOREIGN KEY (`Project`) REFERENCES `projects` (`Proj_ID`);

--
-- Constraints for table `mid4_ch_us`
--
ALTER TABLE `mid4_ch_us`
  ADD CONSTRAINT `mid4_ch_us_ibfk_1` FOREIGN KEY (`User`) REFERENCES `user` (`User_ID`),
  ADD CONSTRAINT `mid4_ch_us_ibfk_2` FOREIGN KEY (`Chart`) REFERENCES `charts` (`Chart_ID`);

--
-- Constraints for table `mid5_no_us`
--
ALTER TABLE `mid5_no_us`
  ADD CONSTRAINT `mid5_no_us_ibfk_1` FOREIGN KEY (`User`) REFERENCES `user` (`User_ID`),
  ADD CONSTRAINT `mid5_no_us_ibfk_2` FOREIGN KEY (`Note`) REFERENCES `notes` (`Note_ID`);

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`Col_ID`) REFERENCES `columns` (`Col_ID`),
  ADD CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`Owner`) REFERENCES `user` (`User_ID`),
  ADD CONSTRAINT `notes_ibfk_3` FOREIGN KEY (`Field_ID`) REFERENCES `fields` (`Field_ID`),
  ADD CONSTRAINT `notes_ibfk_4` FOREIGN KEY (`SEV_level`) REFERENCES `severity` (`ID`);

--
-- Constraints for table `organisation`
--
ALTER TABLE `organisation`
  ADD CONSTRAINT `organisation_ibfk_1` FOREIGN KEY (`Leader_ID`) REFERENCES `user` (`User_ID`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`Proj_Leader_ID`) REFERENCES `user` (`User_ID`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`Org_ID`) REFERENCES `organisation` (`Org_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
