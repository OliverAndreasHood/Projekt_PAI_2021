--
-- Basic tables
--

CREATE TABLE `user` ( 
    `User_ID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `Name` VARCHAR(255) NOT NULL , 
    `Password` VARCHAR(255) NOT NULL , 
    `Alias` VARCHAR(6) NOT NULL , 
    `Country` VARCHAR(255) NULL DEFAULT NULL , 
    `Register` DATE NOT NULL , 
    PRIMARY KEY (`User_ID`), 
    UNIQUE (`Name`), 
    UNIQUE (`Alias`)) 
    ENGINE = InnoDB; 

CREATE TABLE `fields` ( 
    `Field_ID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `Name` VARCHAR(255) NOT NULL , 
    `Alias` VARCHAR(4) NOT NULL , 
    PRIMARY KEY (`Field_ID`), 
    UNIQUE (`Name`), 
    UNIQUE (`Alias`)) 
    ENGINE = InnoDB; 

CREATE TABLE `organisation` ( 
    `Org_ID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `Name` VARCHAR(255) NOT NULL , 
    `Leader_ID` INT(11) UNSIGNED NOT NULL , 
    `Description` TEXT NULL DEFAULT NULL , 
    `Private` BOOLEAN NOT NULL DEFAULT FALSE , 
    `Register` DATE NOT NULL , 
    PRIMARY KEY (`Org_ID`), 
    UNIQUE (`Name`)) 
    ENGINE = InnoDB; 

CREATE TABLE `projects` ( 
    `Proj_ID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `Name` VARCHAR(255) NOT NULL , 
    `Org_ID` INT(11) UNSIGNED NOT NULL , 
    `Proj_Leader_ID` INT(11) UNSIGNED NOT NULL , 
    `Description` VARCHAR(5000) NULL , 
    `Private` BOOLEAN NOT NULL DEFAULT FALSE , 
    `Date_create` DATE NOT NULL , 
    PRIMARY KEY (`Proj_ID`), 
    UNIQUE (`Name`)) 
    ENGINE = InnoDB; 

CREATE TABLE `charts` ( 
    `Chart_ID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `Name` VARCHAR(255) NOT NULL , 
    `Project_ID` INT(11) UNSIGNED NOT NULL , 
    `Chart_Leader` INT(11) UNSIGNED NOT NULL , 
    `Description` VARCHAR(5000) NULL DEFAULT NULL , 
    `Private` BOOLEAN NOT NULL DEFAULT FALSE , 
    PRIMARY KEY (`Chart_ID`)) 
    ENGINE = InnoDB; 

CREATE TABLE `columns` ( 
    `Col_ID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `Name` VARCHAR(255) NOT NULL , 
    `Chart_ID` INT(11) UNSIGNED NOT NULL , 
    `Archive` BOOLEAN NOT NULL DEFAULT FALSE , 
    `Position` INT(2) UNSIGNED NOT NULL , 
    PRIMARY KEY (`Col_Id`)) 
    ENGINE = InnoDB; 

CREATE TABLE `notes` ( 
    `Note_ID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `Title_note` VARCHAR(50) NOT NULL , 
    `Col_ID` INT(11) UNSIGNED NOT NULL , 
    `Field_ID` INT(11) UNSIGNED NOT NULL , 
    `Color` VARCHAR(6) NOT NULL DEFAULT '5e7cb8' COMMENT '[HEX] color representation' , 
    `Description` VARCHAR(5000) NULL , 
    `Owner` INT(11) UNSIGNED NOT NULL , 
    `Date_Create` DATE NOT NULL , 
    `Date_End` DATE NULL , 
    `SEV_level` INT(1) NOT NULL DEFAULT '4',
    `Urgent` BOOLEAN NOT NULL DEFAULT FALSE , 
    `Done` BOOLEAN NOT NULL DEFAULT FALSE , 
    `Archive` BOOLEAN NOT NULL DEFAULT FALSE , 
    PRIMARY KEY (`Note_ID`)) 
    ENGINE = InnoDB; 

--
-- Middle tables
--

CREATE TABLE `mid1_fi_us` ( 
    `ID` INT(11) NOT NULL AUTO_INCREMENT , 
    `User` INT(11) UNSIGNED NOT NULL , 
    `Field` INT(11) UNSIGNED NOT NULL , 
    PRIMARY KEY (`ID`)) 
    ENGINE = InnoDB; 
CREATE TABLE `mid2_or_us` ( 
    `ID` INT(11) NOT NULL AUTO_INCREMENT , 
    `Organisation` INT(11) UNSIGNED NOT NULL , 
    `User` INT(11) UNSIGNED NOT NULL , 
    PRIMARY KEY (`ID`)) 
    ENGINE = InnoDB; 
CREATE TABLE `mid3_pro_us` ( 
    `ID` INT(11) NOT NULL AUTO_INCREMENT , 
    `Project` INT(11) UNSIGNED NOT NULL , 
    `User` INT(11) UNSIGNED NOT NULL , 
    PRIMARY KEY (`ID`)) 
    ENGINE = InnoDB; 
CREATE TABLE `mid4_ch_us` ( 
    `ID` INT(11) NOT NULL AUTO_INCREMENT , 
    `Chart` INT(11) UNSIGNED NOT NULL , 
    `User` INT(11) UNSIGNED NOT NULL , 
    PRIMARY KEY (`ID`)) 
    ENGINE = InnoDB; 
CREATE TABLE `mid5_no_us` ( 
    `ID` INT(11) NOT NULL AUTO_INCREMENT , 
    `Note` INT(11) UNSIGNED NOT NULL , 
    `User` INT(11) UNSIGNED NOT NULL , 
    PRIMARY KEY (`ID`)) 
    ENGINE = InnoDB;

--
-- 'Important' table
--

CREATE TABLE `severity` ( 
    `ID` INT(11) NOT NULL AUTO_INCREMENT , 
    `Description` VARCHAR(20) NOT NULL , 
    `Alias` VARCHAR(4) NOT NULL ,
    PRIMARY KEY (`ID`),
    UNIQUE (`Alias`)) 
    ENGINE = InnoDB;

INSERT INTO `severity` (`ID`, `Description`, `Alias`) VALUES
(1, 'Critical Impact', 'SEV1'),
(2, 'Significant Impact', 'SEV2'),
(3, 'Low Impact', 'SEV3'),
(4, 'None Impact', 'None');

--
-- Altering table relations
--

ALTER TABLE mid1_fi_us ADD FOREIGN KEY (User) REFERENCES user(User_ID);
ALTER TABLE mid2_or_us ADD FOREIGN KEY (User) REFERENCES user(User_ID);
ALTER TABLE mid3_pro_us ADD FOREIGN KEY (User) REFERENCES user(User_ID);
ALTER TABLE mid4_ch_us ADD FOREIGN KEY (User) REFERENCES user(User_ID);
ALTER TABLE mid5_no_us ADD FOREIGN KEY (User) REFERENCES user(User_ID);

ALTER TABLE mid1_fi_us ADD FOREIGN KEY (Field) REFERENCES fields(Field_ID);
ALTER TABLE mid2_or_us ADD FOREIGN KEY (Organisation) REFERENCES organisation(Org_ID);
ALTER TABLE mid3_pro_us ADD FOREIGN KEY (Project) REFERENCES projects(Proj_ID);
ALTER TABLE mid4_ch_us ADD FOREIGN KEY (Chart) REFERENCES charts(Chart_ID);
ALTER TABLE mid5_no_us ADD FOREIGN KEY (Note) REFERENCES notes(Note_ID);

ALTER TABLE organisation ADD FOREIGN KEY (Leader_ID) REFERENCES user(User_ID);
ALTER TABLE projects ADD FOREIGN KEY (Proj_Leader_ID) REFERENCES user(User_ID);
ALTER TABLE projects ADD FOREIGN KEY (Org_ID) REFERENCES organisation(Org_ID);

ALTER TABLE charts ADD FOREIGN KEY (Chart_Leader) REFERENCES user(User_ID);
ALTER TABLE charts ADD FOREIGN KEY (Project_ID) REFERENCES projects(Proj_ID);

ALTER TABLE columns ADD FOREIGN KEY (Chart_ID) REFERENCES charts(Chart_ID);

ALTER TABLE notes ADD FOREIGN KEY (Col_ID) REFERENCES columns(Col_ID);
ALTER TABLE notes ADD FOREIGN KEY (Owner) REFERENCES user(User_ID);
ALTER TABLE notes ADD FOREIGN KEY (Field_ID) REFERENCES fields(Field_ID);
ALTER TABLE notes ADD FOREIGN KEY (SEV_level) REFERENCES severity(ID);

--
-- Dumping data
--

INSERT INTO `user` (`User_ID`, `Name`, `Password`, `Alias`, `Country`, `Register`) VALUES 
(NULL, 'ExampleJohn', '1234', 'ExJohn', 'pl', CURRENT_DATE()), 
(NULL, 'ExampleAna', '1234', 'ExaAna', 'en', CURRENT_DATE()), 
(NULL, 'ExampleDanny', '1234', 'ExaDan', 'fr', CURRENT_DATE()), 
(NULL, 'ExampleSteve', '1234', 'ExaSte', 'de', CURRENT_DATE()), 
(NULL, 'ExampleJoe', '1234', 'ExaJoe', NULL, CURRENT_DATE()), 
(NULL, 'ExampleMisako', '1234', 'ExMisa', 'JP', CURRENT_DATE());

INSERT INTO `fields` (`Field_ID`, `Name`, `Alias`) VALUES 
(NULL, 'Frontend Dev', 'FEND'), 
(NULL, 'Backend Dev', 'BEND'), 
(NULL, 'Logistic', 'LOGI'), 
(NULL, 'Human Resources', 'HRES'), 
(NULL, 'Validation', 'VALD');

INSERT INTO `mid1_fi_us` (`ID`, `User`, `Field`) VALUES 
(NULL, '1', '3'), (NULL, '1', '4'), (NULL, '1', '5'),
(NULL, '2', '1'), (NULL, '2', '3'),
(NULL, '3', '2'), (NULL, '3', '4'), (NULL, '3', '5'), 
(NULL, '4', '2'), 
(NULL, '5', '1'), (NULL, '5', '2'), (NULL, '5', '4'), 
(NULL, '6', '3'), (NULL, '6', '5');

INSERT INTO `organisation` (`Org_ID`, `Name`, `Leader_ID`, `Description`, `Private`, `Register`) VALUES 
(NULL, 'JohnyPhonex', '1', NULL, '0', CURRENT_DATE()), 
(NULL, 'JoePotatoes', '5', NULL, '1', CURRENT_DATE());

INSERT INTO `mid2_or_us` (`ID`, `Organisation`, `User`) VALUES 
(NULL, '1', '1'), (NULL, '1', '2'), (NULL, '1', '3'), 
(NULL, '2', '4'), (NULL, '2', '5'), (NULL, '2', '6');

INSERT INTO `projects` (`Proj_ID`, `Name`, `Org_ID`, `Proj_Leader_ID`, `Description`, `Private`, `Date_create`) VALUES 
(NULL, 'NewPhone', '1', '3', NULL, '0', CURRENT_DATE()), 
(NULL, 'Brand New Website', '1', '1', NULL, '0', CURRENT_DATE()), 
(NULL, 'New Agreement', '2', '4', NULL, '0', CURRENT_DATE());

INSERT INTO `mid3_pro_us` (`ID`, `Project`, `User`) VALUES 
(NULL, '1', '3'), (NULL, '1', '2'), 
(NULL, '2', '1'), (NULL, '2', '2'), (NULL, '2', '3'), 
(NULL, '3', '5'), (NULL, '3', '4'), (NULL, '3', '6');

INSERT INTO `charts` (`Chart_ID`, `Name`, `Project_ID`, `Chart_Leader`, `Description`, `Private`) VALUES 
(NULL, 'Phone Model logistic', '1', '2', NULL, '0'), 
(NULL, 'Phone Documentation Site', '1', '3', NULL, '0'), 
(NULL, 'New Website', '2', '1', NULL, '0'), 
(NULL, 'New Agreement Project', '3', '5', NULL, '0');

INSERT INTO `mid4_ch_us` (`ID`, `Chart`, `User`) VALUES 
(NULL, '1', '2'), (NULL, '1', '1'), (NULL, '1', '3'), 
(NULL, '2', '3'), (NULL, '2', '1'), 
(NULL, '3', '1'), 
(NULL, '4', '5'), (NULL, '4', '4'), (NULL, '4', '6');

INSERT INTO `columns` (`Col_ID`, `Name`, `Chart_ID`, `Archive`, `Position`) VALUES 
(NULL, 'To Do', '1', '0', '1'), 
(NULL, 'On Table', '1', '0', '2'), 
(NULL, 'Done', '1', '0', '3'), 
(NULL, 'To Do', '2', '0', '1'), 
(NULL, 'In progress', '2', '0', '2'), 
(NULL, 'Review', '2', '0', '3'),
(NULL, 'Done', '2', '0', '4'), 
(NULL, 'To Do', '3', '0', '1'), 
(NULL, 'In Progress', '3', '0', '2'), 
(NULL, 'Done', '3', '0', '3'), 
(NULL, 'To do', '4', '0', '1'), 
(NULL, 'In Progress', '4', '0', '2'), 
(NULL, 'Done', '4', '0', '3'), 
(NULL, 'Archive', '4', '0', '4'), 
(NULL, 'Other', '4', '0', '5');

INSERT INTO `notes` (`Note_ID`, `Title_note`, `Col_ID`, `Field_ID`, `Color`, `Description`, `Owner`, `Date_Create`, `Date_End`, `SEV_level`, `Urgent`, `Done`, `Archive`) VALUES 
(NULL, 'Plan', '2', '3', '5e7cb8', 'Make a workflow and goals', '2', CURRENT_DATE(), NULL, '4', '0', '0', '0'), 
(NULL, 'Project', '3', '4', '5e7cb8', 'Organise project contributors', '3', CURRENT_DATE(), NULL, '1', '0', '1', '0'), 
(NULL, 'Project', '10', '1', '5e7cb8', 'Note1', '2', CURRENT_DATE(), NULL, '2', '0', '0', '0'), 
(NULL, 'Project', '1', '2', '5e7cb8', 'Note2', '3', CURRENT_DATE(), NULL, '3', '0', '0', '0'), 
(NULL, 'Project', '1', '3', '5e7cb8', 'Note3', '3', CURRENT_DATE(), NULL, '2', '0', '0', '0'), 
(NULL, 'Documentation', '5', '3', '5e7cb8', 'Note1', '2', CURRENT_DATE(), NULL, '2', '1', '0', '0'), 
(NULL, 'Documentation', '4', '1', '5e7cb8', 'Note2', '3', CURRENT_DATE(), NULL, '2', '0', '0', '0'), 
(NULL, 'Site', '4', '1', '5e7cb8', 'Note3', '3', CURRENT_DATE(), NULL, '1', '0', '0', '0'), 
(NULL, 'Site', '5', '2', '5e7cb8', 'Note4', '3', CURRENT_DATE(), NULL, '1', '0', '0', '0'), 
(NULL, 'Site', '7', '4', '5e7cb8', 'Note5', '2', CURRENT_DATE(), NULL, '1', '0', '1', '0'), 
(NULL, 'Front', '8', '1', '5e7cb8', 'Note1', '1', CURRENT_DATE(), NULL, '2', '0', '0', '0'), 
(NULL, 'Back', '8', '2', '5e7cb8', 'Note2', '1', CURRENT_DATE(), NULL, '2', '0', '0', '0'), 
(NULL, 'DataBase', '8', '3', '5e7cb8', 'Note3', '1', CURRENT_DATE(), NULL, '1', '0', '0', '0'), 
(NULL, 'Site', '9', '3', '5e7cb8', 'Note4', '1', CURRENT_DATE(), NULL, '1', '1', '0', '0'), 
(NULL, 'Site', '10', '4', '5e7cb8', 'Note5', '1', CURRENT_DATE(), NULL, '1', '0', '1', '0'), 
(NULL, 'Paper', '11', '3', '5e7cb8', 'Note1', '6', CURRENT_DATE(), NULL, '1', '0', '0', '0'), 
(NULL, 'Paper', '12', '4', '5e7cb8', 'Note2', '5', CURRENT_DATE(), NULL, '2', '1', '0', '0'), 
(NULL, 'Site', '12', '2', '5e7cb8', 'Note3', '4', CURRENT_DATE(), NULL, '4', '0', '0', '0'), 
(NULL, 'Paper', '14', '3', '5e7cb8', 'Note4', '5', CURRENT_DATE(), NULL, '4', '0', '0', '0');


INSERT INTO `mid5_no_us` (`ID`, `Note`, `User`) VALUES 
(NULL, '1', '1'), (NULL, '1', '2'), (NULL, '1', '3'), 
(NULL, '13', '6');