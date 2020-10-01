<?php
    require_once("vendor/autoload.php");

    $app = new \Slim\Slim();

    $app->get("/:name",function($name){
        echo "<h1>Bem vindo, $name</h1>";
    });

    $app->run();

?>