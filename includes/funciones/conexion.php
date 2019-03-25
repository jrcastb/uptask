<?php 
$conn = new mysqli('localhost','root','', 'uptask');
//verificar que la base de datos está conectada
/*echo "<pre>";
    var_dump($conn->ping());
echo "</pre>";*/
//muestra el error solo si existe 
if ($conn->connect_error) {
    echo $conn->connect_error;
}
$conn->set_charset('utf8');
?>