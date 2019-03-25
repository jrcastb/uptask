<?php

//con json_enconde $_POST observo todo lo que captura del formulario
//die(json_encode($_POST));//die es como un echo para verificar la conexión de ajax

$accion = $_POST['accion'];
$usuario = $_POST['usuario'];
$password = $_POST['password'];

if (isset($_POST['accion'])) {
    if ($accion === 'crear') {
        # codigo para crear cuentas de usuarios o administradores


        //hashear passwords
        $opciones = array(
            'cost' => 12
        );
        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
        //importar la conexion
        include '../funciones/conexion.php';
        try {
            //consulta a la base de datos
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, contraseña) VALUES (?, ?) ");
            $stmt->bind_param("ss", $usuario, $hash_password);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion
                );
            }else{
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
       /* $respuesta = array(
            'hash_password' => $hash_password
        );

        echo json_encode($respuesta); password hasheada*/
    }

    if ($accion === 'login') {
        # codigo para logear usuarios o administradores
        include '../funciones/conexion.php'; 
        try {
            //seleccionar el usuario de la db
            $stmt = $conn->prepare("SELECT usuario, id, contraseña FROM usuarios WHERE usuario = ?");
            $stmt->bind_param("s", $usuario);
            $stmt->execute();
            //logear el usuario
            $stmt->bind_result($nombre_usuario, $id_usuario, $password_usuario);//trae el resultado del select y le asigna las 3 variables respectivamente
            $stmt->fetch();
            if ($nombre_usuario) {
                //el usuario existe, verificar password. La funcion necesita dos argumentos, la contraseña escrita en el input y la almacenada previamente hasheada
                if (password_verify($password, $password_usuario)) {
                    
                    //iniciar la sesion - sin esto no redirecciona a index
                    session_start();
                    $_SESSION['nombre'] = $usuario;
                    $_SESSION['id'] = $id_usuario;
                    $_SESSION['login'] = true;
                    //login correcto
                    
                    $respuesta = array(
                        'respuesta' => 'correcto',
                        'nombre' => $nombre_usuario,
                        'tipo' => $accion
                        //'columnas' => $stmt->affected_rows
                    );
                    
                }else{
                    //login incorrecto - enviar notificacion de error
                    $respuesta = array(
                        'respuesta' => 'Password incorrecto'
                    );
                }
                /**/
            }else{
                $respuesta = array(
                    'error' => 'Usuario no valido'
                );
            }

            $stmt->close();
            $conn->close();
        }catch (Exception $e) {
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }
}

?>