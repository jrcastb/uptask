<?php

function obtenerPaginaActual() { 
    $archivo = basename($_SERVER['PHP_SELF']);//obtiene el nombre de la pagina actual
    $pagina = str_replace(".php", "", $archivo);
    return $pagina;
}

//CONSULTAS A LA BASE DE DATOS

//Obtener datos del proyecto

function obtenerProyectos(){
    include 'conexion.php';
    try {
        return $conn->query("SELECT id, nombre_proyecto FROM proyectos");
    } catch (Throwable $th) {
        echo "error: " . $th->getMessage();
        return false;
    }
}

//obtener nombre del proyecto
function obtenerNombreProyecto($id = null){
    include 'conexion.php';
    try {
        return $conn->query("SELECT nombre_proyecto FROM proyectos WHERE id = {$id}");
    } catch (Exception $e) {
        echo "error: " . $e->getMessage();
        
    }
}

//obtener las clases de proyecto
function obtenerTareaProyecto($id = null){
    include 'conexion.php';
    try {
        return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
    } catch (Exception $e) {
        echo "error: " . $e->getMessage();
        return false;
    }
}



?>
