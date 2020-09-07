
create database pradeep_test;

CREATE TABLE `qss_contact`.`users`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `email` varchar
(255) NOT NULL,
  `password` text NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE KEY `index_users_on_email`
(`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


CREATE TABLE `qss_contact`.`contacts`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `email` varchar
(255) NOT NULL DEFAULT '',
  `fullname` varchar
(255) NOT NULL DEFAULT '',
  `Address` varchar
(255) NOT NULL DEFAULT '',
  `mobile` varchar
(15) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `is_notify` tinyint
(1) NOT NULL DEFAULT '0',
  PRIMARY KEY
(`id`),
  UNIQUE KEY `index_users_on_email`
(`email`) USING BTREE,
  UNIQUE KEY `index_users_on_mobile`
(`mobile`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `
qss_contact`.`contacts
`
(`id`, `email`, `fullname`, `Address`, `mobile`, `created_at`, `is_notify`) VALUES
('1', 'ajay@gmail.com', 'Pradeep Chauhan', 'Noida', '9876543210', '2020-09-06 13:23:45', '0');

INSERT INTO
`
qss_contact`.`users
`
(`id`, `email`, `password`, `created_at`) VALUES
('1', 'qssAjay@gmail.com', '$2a$10$8I3DVVLc3nI684dqGJdmye5QO3UKAKcP.SJ2rAklh/tQw5gkMzoh.', '2020-09-06 13:14:24');

