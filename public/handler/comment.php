<?php
use Model\Comment;
require_once('../include/config.php');
require_once(__INCLUDE__.'/functions.php');
require_once(__INCLUDE__ . '/model/Comment.php');
$type = Utilities::get_post_data('type');
if ($type == 'save') {
    if (isset($_POST['data'])) {
        $comment = new Comment(Utilities::get_post_data('data'));
        if ($comment->save()) {
            echo json_encode($comment->findOne($comment->id));
        } else {
            echo 'Could not save comment';
        }
    } else {
        echo 'Missing parameter';
    }
} else if ($type == 'list') {
    if (isset($_POST['pid'])) {
        $comment = new Comment();
        return json_encode($comment->findAll(Utilities::get_post_data('pid'),0));
    } else {
        echo 'Missing parameter';
    }
} else if ($type == 'delete') {
    if (isset($_POST['data'])) {
        $comment = new Comment();
        if ($comment->delete()) {
            echo 'Completed';
        } else {
            echo 'Failed';
        }

    } else {
        echo 'Missing parameter';
    }
}