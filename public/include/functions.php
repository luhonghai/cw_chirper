<?php

class Utilities {
    public static function get_request_data($name, $default = null) {
        return isset($_REQUEST[$name]) ? $_REQUEST[$name] : (isset($default) ? $default : '');
    }
}
