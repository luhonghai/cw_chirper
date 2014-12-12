<?php

namespace Model;
use Model\User;
use Database\Connector;
require_once(__INCLUDE__.'/database/Connector.php');
require_once(__INCLUDE__.'/model/AbstractModel.php');
require_once(__INCLUDE__.'/model/User.php');

class Comment extends AbstractModel {

    var $id;
    var $post_id;
    var $user_id;
    var $user;
    var $comment;
    var $image;
    var $timestamp;
    var $created_date;

    public static function Comment($id, $post_id, $user_id, $comment, $image, $timestamp, $created_date) {
        $instance = new self();
        $instance->id= $id;
        $instance->post_id = $post_id;
        $instance->user_id = $user_id;
        $instance->comment = $comment;
        $instance->image = $image;
        $instance->timestamp = $timestamp;
        $instance->created_date = $created_date;
    }

    /**
     * Find model by id
     * @param $id
     * @return mixed
     */
    public function findOne($id)
    {
        $db = new Connector($GLOBALS['config']);
        $conn = $db->open();
        $result = null;
        $sql = "select c.comment_id, c.post_id, c.user_id, c.comment, c.image, c.created_date,
                  u.first_name, u.last_name, u.email, u.gender, u.username, u.country, u.bio,
                  u.avatar, c.`timestamp` from
                  ((comment as c inner join post as p on p.post_id = c.post_id)
                    inner join user as u on u.user_id = c.user_id)
                    where u.deleted = FALSE and p.deleted = FALSE and c.deleted = FALSE
                    and c.comment_id = '".mysqli_escape_string($conn, $id)."'
                ";
        try {
            $rs = mysqli_query($conn, $sql) or die("Could not find comment by id ".$id." ".mysqli_error($conn));
            if (mysqli_num_rows($rs) > 0) {
                $row = mysqli_fetch_assoc($rs);
                $result = Post::rowToModel($row);
            }
        } catch (\Exception $e) {
        }
        $db->close();
        return $result;
    }

    /**
     * Find all models
     * @return mixed
     */
    public function findAll($post_id = false)
    {
        $db = new Connector($GLOBALS['config']);
        $conn = $db->open();
        $result = array();
        if ($post_id) {
            $sql = "select c.comment_id, c.post_id, c.user_id, c.comment, c.image, c.created_date,
                  u.first_name, u.last_name, u.email, u.gender, u.username, u.country, u.bio,
                  u.avatar, c.`timestamp` from
                  ((comment as c inner join post as p on p.post_id = c.post_id)
                    inner join user as u on u.user_id = c.user_id)
                    where u.deleted = FALSE and p.deleted = FALSE and c.deleted = FALSE
                    and c.post_id = '".mysqli_escape_string($conn, $post_id)."'
                ";
        } else {
            $sql = "select c.comment_id, c.post_id, c.user_id, c.comment, c.image, c.created_date,
                  u.first_name, u.last_name, u.email, u.gender, u.username, u.country, u.bio,
                  u.avatar, c.`timestamp` from
                  ((comment as c inner join post as p on p.post_id = c.post_id)
                    inner join user as u on u.user_id = c.user_id)
                    where u.deleted = FALSE and p.deleted = FALSE and c.deleted = FALSE
                ";
        }
        try {
            $rs = mysqli_query($conn, $sql) or die("Could not find all comments ".mysqli_error($conn));
            if (mysqli_num_rows($rs) > 0) {
                while($row = mysqli_fetch_assoc($rs)){
                    array_push($result, Comment::rowToModel($row));
                }
            }
        } catch (\Exception $e) {
        }
        $db->close();
        return $result;
    }

    /**
     * Convert database row to model object
     * @param $row
     * @return Post
     */
    public static function rowToModel($row) {
        $user = User::User($row['user_id'], $row['first_name'], $row['last_name'],
            $row['email'],$row['gender'], $row['username'], '', $row['country'],
            $row['bio'],$row['avatar']);
        $comment  = Comment::Comment($row['comment_id'], $row['post_id'], $row['user_id'], $row['comment'],
            $row['image'], $row['timestamp'], $row['created_date']);
        $comment->user = $user;
        return $comment;
    }

    /**
     * Delete current model in database
     * @return mixed
     */
    public function delete()
    {
        $db = new Connector($GLOBALS['config']);
        $conn = $db->open();
        $sql = "update comment set deleted=TRUE where comment_id=".$this->id." and deleted=FALSE";
        try {
            $result = mysqli_query($conn, $sql) or die("Could not delete comment id ".$this->id." ".mysqli_error($conn));
            $db->close();
            return $result;
        } catch (\Exception $e) {
            $db->close();
            return false;
        }
    }

    /**
     * Save current model
     * If ID is null => create new
     * If ID is not null => update
     * @return mixed
     */
    public function save()
    {
        $db = new Connector($GLOBALS['config']);
        $conn = $db->open();
        $result = false;
        if (empty($this->id)) {
            $this->timestamp = time();
            $this->created_date=gmdate('d/m/Y', $this->timestamp);
            $sql = "insert into comment(post_id, user_id, comment, image, `timestamp`, created_date)
                VALUES (
                   '".mysqli_escape_string($conn,$this->post_id)."',
                    '".mysqli_escape_string($conn,$this->user_id)."',
                    '".mysqli_escape_string($conn,$this->comment)."',
                    '".mysqli_escape_string($conn,$this->image)."',
                    ".mysqli_escape_string($conn,$this->timestamp).",
                    FROM_UNIXTIME(".mysqli_escape_string($conn,$this->timestamp).")
                )";
        } else {
            $sql = "update comment set
                     comment='".mysqli_escape_string($conn,$this->comment)."',
                     image='".mysqli_escape_string($conn,$this->image)."'
                     WHERE comment_id='".mysqli_escape_string($conn,$this->id)."'
                      and deleted=FALSE
                    ";
        }
        try {
            $result = mysqli_query($conn, $sql) or die("Could not save comment id ".$this->id." ".mysqli_error($conn));
            if (empty($this->id)) $this->id = mysqli_insert_id($conn);
        } catch (\Exception $e) {
        }
        $db->close();
        return $result;
    }
}