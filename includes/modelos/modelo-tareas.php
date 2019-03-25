<?php 

/* $accion = $_POST['accion'];
$tarea = $_POST['tarea'];
$id_proyecto = (int) $_POST['id_proyecto']; */

//con estos multiples if validamos que existan los datos dentro de las variables requeridas, de lo contrario les asigna un contenido por default
if (isset($_POST["accion"])) {
    $accion = $_POST["accion"];
} else {
    $accion = "default";
}
if (isset($_POST["id_proyecto"])) {
    $id_proyecto = (int)$_POST["id_proyecto"];
} else {
    $id_proyecto = "default";
}
if (isset($_POST["tarea"])) {
    $tarea = $_POST["tarea"];
} else {
    $tarea = "default";
}
if (isset($_POST["estado"])) {
    $estado = $_POST["estado"];
} else {
    $estado = "default";
}
if(isset($_POST['id'])){
    $id_tarea = (int) $_POST['id'];
}else{
    $id_tarea = "default";
}
if (isset($_POST['accion'])) {
    if ($accion === 'crear') {
        //codigo para crear tarea de proyecto

        include '../funciones/conexion.php';

        try {
            $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?)");
            $stmt->bind_param("si", $tarea, $id_proyecto);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'tarea' => $tarea,
                    'id_insertado' => $stmt->insert_id,
                    'accion' => $accion,
                    'id_proyecto' => $id_proyecto
                );
            }else{
                //hubo un error
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }


            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }
}

if ($accion === 'actualizar') {
    include '../funciones/conexion.php';

    try {
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ? ");
        $stmt->bind_param("ii", $estado, $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                //'tarea' => $_POST['tarea']
                
            );
        }else{
            //hubo un error
            $respuesta = array(
                'respuesta' => 'error'
            );
        }


        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}
if ($accion === 'eliminar') {
    include '../funciones/conexion.php';

    try {
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ? ");
        $stmt->bind_param("i", $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto'
                
                
            );
        }else{
            //hubo un error
            $respuesta = array(
                'respuesta' => 'error'
            );
        }


        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}
