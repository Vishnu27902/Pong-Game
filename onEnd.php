<?php
    $data=[];
    $server="localhost:3306";
    $user="pong";
    $password="";
    $databaseName="PongGame";
    $playername=$_POST["playername"];
    $highscore=$_POST["highscore"];
    $computerscore=$_POST["computerscore"];

    $connection = new mysqli($server,$user,$password);

    if($connection->connect_error){
        die($connection);
    }

    $query="CREATE DATABASE IF NOT EXISTS ".$databaseName.";";
    $connection->query($query);

    $query="USE ".$databaseName.";";
    $connection->query($query);

    $query="CREATE TABLE IF NOT EXISTS player (sno INTEGER PRIMARY KEY,playername INTEGER NOT NULL,playerscore INTEGER NOT NULL,computerscore INTEGER NOT NULL);";
    $connection->query($query);

    $query="SELECT * FROM player";
    $result=$connection->query($query);

    if($result->num_rows>0){
        while($row=$result->fetch_assoc()){
            $data["highscore"]=(int)$row["playerscore"];
            $data["computerscore"]=(int)$row["computerscore"];
        }
    }

    if($highscore > $data["highscore"]){
        $query="UPDATE player SET playername='".$playername."', playerscore=".$highscore.", computerscore=".$computerscore." WHERE sno=1;";
        $result=$connection->query($query);
    }

    echo $highscore;
?>