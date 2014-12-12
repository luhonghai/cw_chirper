<?php
use Model\Post;
require_once('../include/config.php');
require_once(__INCLUDE__.'/functions.php');
require_once(__INCLUDE__ . '/model/Post.php');

$type = Utilities::get_post_data('type');
if ($type == 'save') {
    if (isset($_POST['data'])) {
        $post = new Post(Utilities::get_post_data('data'));
        if ($post->save()) {
            echo json_encode($post->findOne($post->id));
        } else {
            echo 'Could not save post';
        }
    } else {
        echo 'Missing parameter';
    }
} else if ($type == 'list') {
    $post = new Post();
    if (isset($_POST['uid'])) {
        echo json_encode($post->findAll(Utilities::get_post_data('uid')));
    } else {
        echo json_encode($post->findAll());
    }
} else if ($type == 'delete') {
    if (isset($_POST['data'])) {
        $post = new Post(Utilities::get_post_data('data'));
        if ($post->delete()) {
            echo "Completed";
        } else {
            echo "Failed";
        }
    } else {
        echo 'Missing parameter';
    }
}