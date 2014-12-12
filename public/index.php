<?php
require 'include/libs/Smarty.class.php';

ob_start();
session_start();
$smarty = new Smarty;
$smarty->assign("title", "Chirper - Social Networking Music", true);
$smarty->display('index.tpl');