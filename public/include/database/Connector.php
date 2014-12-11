<?php

namespace Database;

class Connector {

    var $db_url;
    var $db_name;
    var $db_username;
    var $db_password;

    var $conn;

    public function __construct($config) {
        $this->db_url = $config['db.url'];
        $this->db_name = $config['db.name'];
        $this->db_username = $config['db.username'];
        $this->db_password = $config['db.password'];
    }

    public function open() {
        $this->conn = mysqli_connect($this->db_url, $this->db_username, $this->db_password, $this->db_name);
        // Check connection
        if (!$this->conn) {
            die("Connection failed: " . mysqli_connect_error());
        }
        return $this->conn;
    }

    public function close() {
        mysqli_close($this->conn);
    }
} 