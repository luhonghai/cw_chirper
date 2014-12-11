<?php
use Model\User;
require_once('../include/config.php');
require_once(__INCLUDE__ . '/model/User.php');

User::logout();
header("Location:/login");