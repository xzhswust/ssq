/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50022
Source Host           : localhost:3306
Source Database       : todo

Target Server Type    : MYSQL
Target Server Version : 50022
File Encoding         : 65001

Date: 2012-06-30 11:46:02
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `todo`
-- ----------------------------
DROP TABLE IF EXISTS `todo`;
CREATE TABLE `todo` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(300) default NULL,
  `finished` int(11) default '0',
  `post_date` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of todo
-- ----------------------------
INSERT INTO `todo` VALUES ('12', '完成todo的建设 zoup', '0', '2012-06-29 12:37:56');
INSERT INTO `todo` VALUES ('22', '日不死的仙人', '1', '2012-06-29 21:37:56');
INSERT INTO `todo` VALUES ('23', 'xzh 学习Express', '1', '2012-06-29 12:37:47');
INSERT INTO `todo` VALUES ('24', 'zoup 完成todo建设', '0', '2012-06-29 21:27:02');
