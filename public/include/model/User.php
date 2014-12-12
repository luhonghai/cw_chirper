<?php

namespace Model;

use Database\Connector;
require_once(__INCLUDE__.'/database/Connector.php');
require_once(__INCLUDE__.'/model/AbstractModel.php');

class User extends AbstractModel {
    var $id;
    var $first_name;
    var $last_name;
    var $email;
    var $gender;
    var $username;
    var $password;
    var $country;
    var $bio;
    var $avatar;
    var $created_date;

    /**
     * Create new user
     */
    public static function User($id,$first_name, $last_name,  $email, $gender,
                         $username, $country, $bio, $avatar) {
        $instance = new self();
        $instance->id = $id;
        $instance->first_name = $first_name;
        $instance->last_name = $last_name;
        $instance->email = $email;
        $instance->gender = $gender;
        $instance->username = $username;
        $instance->country = $country;
        $instance->bio = $bio;
        $instance->avatar = $avatar;
        return $instance;
    }

    /**
     * Login to system
     * @param $username
     * @param $password
     * @return bool
     */
    public static function login($username, $password) {
        $db = new Connector($GLOBALS['config']);
        $conn = $db->open();
        $sql = "select * from user where deleted=FALSE and (username='".mysqli_escape_string($conn,$username).
        "' or email='".mysqli_escape_string($conn, $username).
        "') and password=md5('".mysqli_escape_string($conn, $password)."');";
        try {
            $result = mysqli_query($conn, $sql) or die("Could not login: ".mysqli_error($conn));
            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $user  = User::User($row['user_id'], $row['first_name'], $row['last_name'],
                    $row['email'],$row['gender'], $row['username'], $row['country'],
                    $row['bio'],$row['avatar']);
                $user->setAsCurrentUser();
                return true;
            } else {
                return false;
            }
            $db->close();
            return true;
        } catch (\Exception $e) {
            $db->close();
            return false;
        }
    }

    /**
     * Logout system
     */
    public static function logout() {
        $_SESSION['user'] = null;
        session_destroy();
    }

    /**
     * Set user as current login user
     */
    public function setAsCurrentUser() {
        session_regenerate_id();
        $_SESSION['user'] = $this;
        session_write_close();
    }

    /**
     * @return current login user
     */
    public static function currentUser() {
        if (empty($_SESSION['user'])) return null;
        return $_SESSION['user'];
    }

    /**
     * @return bool Return true if user is loginned
     */
    public static function isLogin() {
        if (empty($_SESSION['user'])) return false;
        return $_SESSION['user'] != null;
    }

    /**
     * Save user to database.
     * If ID is not null => Update database record
     * If ID is null => Create new database record
     */

    public function save() {
        $db = new Connector($GLOBALS['config']);
        $conn = $db->open();
        $done = false;
        if (empty($this->id)) {
            $current_unix_time = time();
            $this->created_date=gmdate('d/m/Y', $current_unix_time);
            $sql = "insert into user(first_name, last_name, email, gender, username, password, country, bio, avatar, created_date)
                      VALUES (
                        '".mysqli_escape_string($conn, $this->first_name)."',
                        '".mysqli_escape_string($conn, $this->last_name)."',
                        '".mysqli_escape_string($conn, $this->email)."',
                        ".($this->gender ? 1 : 0).",
                        '".mysqli_escape_string($conn, $this->username)."',
                        md5('".mysqli_escape_string($conn, $this->password)."'),
                        '".mysqli_escape_string($conn, $this->country)."',
                        '".mysqli_escape_string($conn, $this->bio)."',
                        '".mysqli_escape_string($conn, $this->avatar)."',
                        FROM_UNIXTIME(".$current_unix_time.")
                      )";
        } else {
            $sql = "update user set
                      first_name='".mysqli_escape_string($conn,$this->first_name)."',
                      last_name='".mysqli_escape_string($conn,$this->last_name)."',
                      email='".mysqli_escape_string($conn,$this->email)."',
                      gender=".($this->gender ? 1 : 0).",
                      username='".mysqli_escape_string($conn,$this->username)."',
                      country='".mysqli_escape_string($conn,$this->country)."',
                      bio='".mysqli_escape_string($conn,$this->bio)."',
                      avatar='".mysqli_escape_string($conn,$this->avatar)."'";
            if (!empty($this->password)) {
                $sql.=", password=md5('".mysqli_escape_string($conn,$this->password)."')";
            }
            $sql .= " where user_id=" . $this->id . " and deleted=FALSE";
        }
        try {
            $done = mysqli_query($conn, $sql) or die("Could not save user ".$this->username." ".mysqli_error($conn));
            if (empty($this->id)) $this->id = mysqli_insert_id($conn);
        } catch (\Exception $e) {

        }
        $db->close();
        return $done;
    }

    /**
     * Delete user by id
     */
    public function delete() {
        $db = new Connector($GLOBALS['config']);
        $conn = $db->open();
        $sql = "update user set deleted=TRUE where user_id=".$this->id." and deleted=FALSE";
        try {
            $result = mysqli_query($conn, $sql) or die("Could not delete user id ".$this->id." ".mysqli_error($conn));
            $db->close();
            return $result;
        } catch (\Exception $e) {
            $db->close();
            return false;
        }
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
        $user = null;
        $sql = "select * from user where deleted=FALSE and user_id=".mysqli_escape_string($conn,$id);
        try {
            $result = mysqli_query($conn, $sql) or die("Could not get user data: ".mysqli_error($conn));
            if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $user  = User::User($row['user_id'], $row['first_name'], $row['last_name'],
                    $row['email'],$row['gender'], $row['username'], $row['country'],
                    $row['bio'],$row['avatar']);
            }
        } catch (\Exception $e) {
        }
        $db->close();
        return $user;
    }

    /**
     * Find all models
     * @return mixed
     */
    public function findAll()
    {
        // TODO: Implement findAll() method.
    }

}