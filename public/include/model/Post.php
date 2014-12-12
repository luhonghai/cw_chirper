<?php

namespace Model;
use Model\User;
use Database\Connector;
require_once(__INCLUDE__.'/database/Connector.php');
require_once(__INCLUDE__.'/model/AbstractModel.php');
require_once(__INCLUDE__.'/model/User.php');

class Post extends AbstractModel {

    var $id;
    var $user_id;
    var $user;
    var $song;
    var $artist;
    var $comment;
    var $image;
    var $timestamp;
    var $created_date;

    public static function Post($id, $song, $artist, $comment, $image, $timestamp, $created_date) {
        $instance = new self();
        $instance->id = $id;
        $instance->song = $song;
        $instance->artist = $artist;
        $instance->comment = $comment;
        $instance->image = $image;
        $instance->timestamp = $timestamp;
        $instance->created_date = $created_date;
        return $instance;
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
        $sql = "select p.song, p.artist,p.comment,p.user_id, p.post_id,p.image,
                      u.first_name, u.last_name, u.email,u.gender,u.username, u.country,
                      u.bio, u.avatar,
                      p.`timestamp`, p.created_date
                  from post as p inner join user as u on p.user_id = u.user_id
                  where p.deleted = FALSE  and u.deleted = FALSE
                    and p.post_id='".mysqli_escape_string($conn, $id)."'
                ";
        try {
            $rs = mysqli_query($conn, $sql) or die("Could not find post by id ".$id." ".mysqli_error($conn));
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
     * Convert database row to model object
     * @param $row
     * @return Post
     */
    public static function rowToModel($row) {
        $user = User::User($row['user_id'], $row['first_name'], $row['last_name'],
            $row['email'],$row['gender'], $row['username'], '', $row['country'],
            $row['bio'],$row['avatar']);
        $post  = Post::Post($row['post_id'], $row['song'], $row['artist'], $row['comment'],
            $row['image'], $row['timestamp'], $row['created_date']);
        $post->user_id = $user->id;
        $post->user = $user;
        return $post;
    }

    /**
     * Find all models
     * @return mixed
     */
    public function findAll($id = false)
    {
        $db = new Connector($GLOBALS['config']);
        $conn = $db->open();
        $result = array();
        $sql = "select p.song, p.artist,p.comment,p.user_id, p.post_id,p.image,
                      u.first_name, u.last_name, u.email,u.gender,u.username, u.country,
                      u.bio, u.avatar,
                      p.`timestamp`, p.created_date
                  from post as p inner join user as u on p.user_id = u.user_id
                  where p.deleted = FALSE  and u.deleted = FALSE order by p.created_date DESC
                ";
        if ($id) {
            $sql .= " and u.user_id = '".mysqli_escape_string($conn, $id)."'";
        }
        try {
            $rs = mysqli_query($conn, $sql) or die("Could not find all post ".mysqli_error($conn));
            if (mysqli_num_rows($rs) > 0) {
                while($row = mysqli_fetch_assoc($rs)){
                   array_push($result, Post::rowToModel($row));
                }
            }
        } catch (\Exception $e) {
        }
        $db->close();
        return $result;
    }

    /**
     * Delete current model in database
     * @return mixed
     */
    public function delete()
    {
        $db = new Connector($GLOBALS['config']);
        $conn = $db->open();
        $sql = "update post set deleted=TRUE where user_id=".$this->id." and deleted=FALSE";
        try {
            $result = mysqli_query($conn, $sql) or die("Could not delete post id ".$this->id." ".mysqli_error($conn));
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
            $sql = "insert into post(user_id, song, artist, comment, image, `timestamp`, created_date)
                VALUES (
                   '".mysqli_escape_string($conn,$this->user_id)."',
                    '".mysqli_escape_string($conn,$this->song)."',
                    '".mysqli_escape_string($conn,$this->artist)."',
                    '".mysqli_escape_string($conn,$this->comment)."',
                    '".mysqli_escape_string($conn,$this->image)."',
                    ".mysqli_escape_string($conn,$this->timestamp).",
                    FROM_UNIXTIME(".mysqli_escape_string($conn,$this->timestamp).")
                )";
        } else {
            $sql = "update post set
                     song='".mysqli_escape_string($conn,$this->song)."',
                     artist='".mysqli_escape_string($conn,$this->artist)."',
                     comment='".mysqli_escape_string($conn,$this->comment)."',
                     image='".mysqli_escape_string($conn,$this->image)."'
                     WHERE post_id='".mysqli_escape_string($conn,$this->id)."'
                      and deleted=FALSE
                    ";
        }
        try {
            $result = mysqli_query($conn, $sql) or die("Could not save post id ".$this->id." ".mysqli_error($conn));
            if (empty($this->id)) $this->id = mysqli_insert_id($conn);
        } catch (\Exception $e) {
        }
        $db->close();
        return $result;
    }
}