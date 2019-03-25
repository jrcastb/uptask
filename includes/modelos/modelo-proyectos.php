<?php 

if (isset($_POST['accion'])) {
    $accion = $_POST['accion'];
} else {
    $accion = "default";
}
if (isset($_POST['proyecto'])) {
    $proyecto = $_POST['proyecto'];
} else {
    $proyecto = "default";
}
if (isset($_POST['clase'])) {
    $id_proyecto = $_POST['clase'];
} else {
    $id_proyecto = "default";
}


if ($accion === 'crear') {
    //codigo para crear proyecto

    include '../funciones/conexion.php';

    try {
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre_proyecto) VALUES (?)");
        $stmt->bind_param("s", $proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'proyecto' => $proyecto,
                'id_insertado' => $stmt->insert_id,
                'accion' => $accion
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
        $stmt = $conn->prepare("DELETE FROM proyectos WHERE id = ? ");
        $stmt->bind_param("i", $id_proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto'
                
            );
        }else{
            //hubo un error
            $respuesta = array(
                'respuesta' => $stmt->error
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
