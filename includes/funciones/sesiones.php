<?php 
//importar en cualquier pagina que queramos asegurar
function usuario_autenticado(){
    //4. sino esta agregada la sesion
    if (!revisar_usuario()) {
        //5. entonces redirecciona
        header('Location:login.php');
        exit();
    }
}

function revisar_usuario(){
    return isset($_SESSION['nombre']);//3. revisa que la sesion exista
}
//en php hay algo llamado sesiones
session_start();//1. arrancar una sesion
usuario_autenticado();//2. abre usuario autenticado

?>