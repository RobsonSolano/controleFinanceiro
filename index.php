<?php 
session_start();
require_once("vendor/autoload.php");

use \NanoChallenge\PageAdmin;
use \Slim\Slim;

$app = new Slim();

$app->config('debug', true);

$app->get('/admin', function() {

	$page = new PageAdmin();

    $page->setTpl("index");
});

$app->run();

 ?>