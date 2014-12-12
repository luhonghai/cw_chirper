<?php
define('__INCLUDE__', dirname(__FILE__));
define('__ROOT__', dirname(__INCLUDE__));

session_start();
$config = [];
/**
 *  Database configuration
 */
$config['db.url'] = 'localhost';
$config['db.name'] = 'chirper';
$config['db.username'] = 'luhonghai';
$config['db.password'] = 'hurricane';

/**
 *  Default configuration
 */

$config['data.dir'] = '';
$config['avatars.dir'] = $config['data.dir'].'/avatars';
$config['images.dir'] = $config['data.dir'].'/images';

$GLOBALS['config'] = $config;

