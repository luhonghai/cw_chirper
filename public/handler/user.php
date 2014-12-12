<?php
use Model\User;
require_once('../include/config.php');
require_once(__INCLUDE__.'/functions.php');
require_once(__INCLUDE__ . '/model/User.php');

$type = Utilities::get_post_data('type');
if ($type == 'save') {
    if (isset($_POST['data'])) {
        $user = new User(Utilities::get_post_data('data'));
        if ($user->save()) {
            $user->setAsCurrentUser();
            echo json_encode($user);
        } else {
            echo 'Could not save user ' . $user->username;
        }
    } else {
        echo 'Missing parameter';
    }
} else if ($type == 'current') {
    if (User::isLogin()) {
        echo json_encode(User::currentUser());
    } else {
        echo "Not login";
    }
} else if ($type == 'login') {
    if (User::login(Utilities::get_post_data('username'), Utilities::get_post_data('password'))) {
        echo json_encode(User::currentUser());
    } else {
        echo 'Invalid username or password';
    }
} else if ($type == 'logout') {
    User::logout();
    echo 'Completed';
}