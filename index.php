<?php include 'includes/funciones/sesiones.php'; //siempre de primero
 include 'includes/funciones/funciones.php'; //siempre antes de todo html 
 include 'includes/templates/header.php'; 
 include 'includes/templates/barra.php';
 //debe ser agregado id_proyecto vacio antes por si no hay un id_proyecto la funcion obtenerNombreProyecto no marque un error
 $id_proyecto = "";
 if (isset($_GET['id_proyecto'])) {
     $id_proyecto = $_GET['id_proyecto'];
 }
 ?>

    

    <div class="contenedor">
        <?php include 'includes/templates/sidebar.php'; ?>

        <main class="contenido-principal">
            <?php 
                //mostrar nombre de manera dinamica realizando una consulta
                
                $proyecto = obtenerNombreProyecto($id_proyecto); 
                if($proyecto){ ?>
                    <h1>
                        Proyecto Actual:
                        
                        <?php foreach ($proyecto as $nombre_proyecto) { ?>
                        
                            <span><?php echo $nombre_proyecto['nombre_proyecto']; ?></span>
                        
                        <?php } ?>
                        
                    </h1>

                    <form action="#" class="agregar-tarea">
                        <div class="campo">
                            <label for="tarea">Tarea:</label>
                            <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
                        </div>
                        <div class="campo enviar">
                            <input type="hidden" id="id_proyecto" value="<?php echo $id_proyecto; ?>">
                            <input type="submit" class="boton nueva-tarea" value="Agregar">
                        </div>
                    </form>
                <?php } else{ 
                    echo "<h2> Selecciona un proyecto a la izquierda </h2>";
                    }
                
                ?>
    

            <h2>Listado de tareas:</h2>

            <div class="listado-pendientes">
                <ul>
                    <?php 
                    //obtener tareas proyecto
                    $tareas = obtenerTareaProyecto($id_proyecto);
                    if (isset($tareas->num_rows)) {
                        if ($tareas->num_rows > 0) {
                            foreach ($tareas as $tarea):?>
                               
                                <li id = "tarea:<?php echo $tarea['id']; ?>" class="tarea">
                                <p><?php echo $tarea['nombre']; ?></p>
                                    <div class="acciones">
                                        <i class="far fa-check-circle <?php echo $tarea['estado'] === ('1') ? 'completo' : '' ;?>"></i>
                                        <i class="fas fa-trash"></i>
                                    </div>
                                </li>     

                    <?php  endforeach;
                        } else {
                            echo "<h2 class ='lista-vacia'> No hay tareas asociadas a este proyecto</h2>";
                        }
                    }
                    

                    ?>
                    
                </ul>
            </div>
            <div class="avance">
                    <h2>Avance del proyecto: </h2>
                    <div id="barra-avance" class="barra-avance">
                        <div id="porcentaje" class = "porcentaje"></div>
                    </div>
            </div>
        </main>
    </div><!--.contenedor-->


<?php include 'includes/templates/footer.php'; ?>