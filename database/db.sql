--
--  Table structure for table `User`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL DEFAULT '',
  `last_name` VARCHAR(100) NOT NULL DEFAULT '',
  `email` varchar(80) NOT NULL DEFAULT '',
  `gender` BOOLEAN DEFAULT true, -- Male is true, Female is false
  `username` varchar(80) NOT NULL DEFAULT '',
  `password` varchar(50) NOT NULL DEFAULT '',
  `country` VARCHAR(100),
  `bio` VARCHAR(500),
  `avatar` VARCHAR(200),
  `created_date` DATETIME DEFAULT now(),
  `deleted` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
-- Insert default data
INSERT INTO user (first_name, last_name, email, gender, username, password, country)
VALUES ('Admin', 'Super', 'admin@chirper.com', TRUE , 'admin', md5('admin'), 'UK');


--
--  Table structure for table `Post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `post_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT(20) NOT NULL,
  `song` VARCHAR(100) NOT NULL DEFAULT '',
  `artist` VARCHAR(100) NOT NULL DEFAULT '',
  `comment` VARCHAR(140) NOT NULL DEFAULT '',
  `image` VARCHAR(150),
  `timestamp` long,
  `created_date` DATETIME DEFAULT now(),
  `deleted` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`post_id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
--  Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `comment_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT(20) NOT NULL,
  `user_id` BIGINT(20) NOT NULL,
  `comment` VARCHAR(200) NOT NULL DEFAULT '',
  `image` VARCHAR(150),
  `timestamp` long,
  `created_date` DATETIME DEFAULT now(),
  `deleted` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`comment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
