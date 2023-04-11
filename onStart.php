<?php
    $data=[];
    $playername=$_POST['name'];
    
    if(empty($playername)){
        $data['status']=false;
        $data['message']="Error";
    }
    else{
        $data['status']=true;
        $data['message']="Success!";
        $server="localhost:3306";
        $username="pong";
        $password="";
        $databaseName="PongGame";

        $connection = new mysqli($server,$username,$password);

        if($connection->connect_error){
            die($connection);
        }

        $query="CREATE DATABASE IF NOT EXISTS ".$databaseName.";";
        $connection->query($query);

        $query="USE ".$databaseName.";";
        $connection->query($query);

        $query="CREATE TABLE IF NOT EXISTS player (sno INTEGER PRIMARY KEY,playername VARCHAR(25) NOT NULL,playerscore INTEGER NOT NULL,computerscore INTEGER NOT NULL);";
        $connection->query($query);
        
        $query="SELECT * FROM player";
        $result=$connection->query($query);

        if($result->num_rows<1){
            $preparedStatements=$connection->prepare("INSERT INTO player VALUES (?,?,?,?);");

            $tempsno=1;
            $tempplayername="None";
            $tempplayerscore=0;
            $tempcomputerscore=0;

            $preparedStatements->bind_param("isii", $tempsno, $tempplayername, $tempplayerscore, $tempcomputerscore);
            $preparedStatements->execute();
            
            $data["playername"]=$tempplayername;
            $data["highscore"]=$tempplayerscore;
            $data["computerscore"]=$tempcomputerscore;
        }
        else{
            while($row=$result->fetch_assoc()){
                $data["playername"]=$row["playername"];
                $data["highscore"]=(int)$row["playerscore"];
                $data["computerscore"]=(int)$row["computerscore"];
            }
        }
    }
    echo json_encode($data);
?>