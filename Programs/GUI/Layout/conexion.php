<?php
    $password="";
    $user="root";
    $database_name="health_connection";
    try{
        $database= new PDO('mysql:host=localhost;dbname='.$database_name,$user,$password);
    }
    catch(Exception $error){
        echo"Ocurrio algo con la base de datos: ".$error->getMessage();
    }


    

?>