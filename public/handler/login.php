<?php
use Model\User;
require_once('../include/config.php');
require_once(__INCLUDE__.'/functions.php');
require_once(__INCLUDE__ . '/model/User.php');
if (User::login(Utilities::get_request_data('username'), Utilities::get_request_data('password'))) {
    $_SESSION['message'] = 'Login successfully';
} else {
    $_SESSION['message'] = 'Invalid username or password';
}
header("Location:/");