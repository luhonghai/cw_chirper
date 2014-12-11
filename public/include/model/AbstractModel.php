<?php

namespace Model;

abstract class AbstractModel {
    /**
     * Default constructor: pass JSON string to model object
     */
    public function __construct($json = false) {
        if ($json) $this->set(json_decode($json, true));
    }

    /**
     * Pass JSON object to model object
     * @param $data
     */
    public function set($data) {
        foreach ($data AS $key => $value) {
            if (is_array($value)) {
                $sub = new JSONObject;
                $sub->set($value);
                $value = $sub;
            }
            $this->{$key} = $value;
        }
    }

    /**
     * Find model by id
     * @param $id
     * @return mixed
     */
    public abstract function findOne($id);

    /**
     * Find all models
     * @return mixed
     */
    public abstract function findAll();

    /**
     * Delete current model in database
     * @return mixed
     */
    public abstract function delete();

    /**
     * Save current model
     * If ID is null => create new
     * If ID is not null => update
     * @return mixed
     */
    public abstract function save();
} 