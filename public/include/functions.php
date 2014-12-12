<?php

class Utilities {
    public static function get_request_data($name, $default = null) {
        return isset($_REQUEST[$name]) ? $_REQUEST[$name] : (isset($default) ? $default : '');
    }

    public static function get_post_data($name, $default = null) {
        return isset($_POST[$name]) ? $_POST[$name] : (isset($default) ? $default : '');
    }
}
