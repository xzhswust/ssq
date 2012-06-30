/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50022
Source Host           : localhost:3306
Source Database       : ssq

Target Server Type    : MYSQL
Target Server Version : 50022
File Encoding         : 65001

Date: 2012-06-30 11:18:10
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `history`
-- ----------------------------
DROP TABLE IF EXISTS `history`;
CREATE TABLE `history` (
  `id` int(10) unsigned NOT NULL,
  `r1` tinyint(3) unsigned NOT NULL,
  `r2` tinyint(3) unsigned NOT NULL,
  `r3` tinyint(3) unsigned NOT NULL,
  `r4` tinyint(3) unsigned NOT NULL,
  `r5` tinyint(3) unsigned NOT NULL,
  `r6` tinyint(3) unsigned NOT NULL,
  `blue` tinyint(4) NOT NULL,
  `sum_red` tinyint(3) unsigned default NULL,
  `sum_all` tinyint(3) unsigned default NULL,
  `ac` tinyint(3) unsigned default NULL,
  `sd` tinyint(3) unsigned default NULL,
  `date` date default NULL,
  `sale` int(10) unsigned default NULL,
  `first_count` int(11) default NULL,
  `first_reward` int(11) default NULL,
  `second_count` int(11) default NULL,
  `second_reward` int(11) default NULL,
  `third_count` int(11) default NULL,
  `third_reward` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of history
-- ----------------------------
