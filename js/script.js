//con arrow functions debe mantenerse el orden
//con o sin let funciona
var listaProyectos = document.querySelector('ul#proyectos');



nuevoProyecto = (e) => {
    e.preventDefault();
    
    //crear <input> para nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type ="text" id = "nuevo-proyecto">';

    listaProyectos.appendChild(nuevoProyecto);

    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
    inputNuevoProyecto.addEventListener('keypress', function(e){
        var tecla = e.key;
        if (tecla === "Enter") {
            console.log("presionaste la tecla enter");
            var proyectoCreado = inputNuevoProyecto.value;
            guardarProyectoDB(proyectoCreado);
            listaProyectos.removeChild(nuevoProyecto);
            //agregar proyecto al listado
            
            /*nuevoProyecto.innerHTML = `<a href="#"> ${proyectoCreado}</a>` 
            listaProyectos.appendChild(nuevoProyecto);*/
        }
    });

}
//agregar tarea a proyecto actual
nuevaTarea = (e) =>{
    e.preventDefault();
    var Tarea = document.querySelector('.nombre-tarea').value;
    if (Tarea === "") {
        Swal.fire({
            title: "Error",
            type: "error",
            text: "La tarea no puede ir vacia"
        })
    }else{
        //crear llamado a AJAX
        var xhr = new XMLHttpRequest();
        //formDATA
        var datos = new FormData();
        datos.append('tarea', Tarea);
        datos.append('accion','crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);
        //abrir la conexion
        xhr.open('POST','includes/modelos/modelo-tareas.php', true);
        //ejecutarlo y respuesta
        xhr.onload = function () {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText),
                    confirmacion = respuesta.respuesta;
                    tareaInsertada = respuesta.tarea;
                    id_insertado = respuesta.id_insertado;
                    accion = respuesta.accion;
                
                if (confirmacion === 'correcto') {
                    if (accion === 'crear') {
                        Swal.fire({
                            title: "Tarea creada",
                            type: "success",
                            text: "La tarea: " + tareaInsertada + " se creo correctamente"
                        })
                        //para comprobar que UN SOLO elemento existe o no en el html usamos querySelectorALL 
                        var tituloVacio = document.querySelectorAll('.lista-vacia');//retorna el length
                        if (tituloVacio.length > 0 ) {
                            document.querySelector('.lista-vacia').remove();
                        }

                        var nuevaTarea = document.createElement('li');
                        //agregar id
                        nuevaTarea.id = "tarea:"+id_insertado;
                        //agregar clase tarea 
                        nuevaTarea.classList.add("tarea");
                        //Crear el html
                        nuevaTarea.innerHTML = `<p>${tareaInsertada}</p>
                        <div class = "acciones">
                            <i class ="far fa-check-circle "></i>
                            <i class ="fas fa-trash" ></i>
                        </div>
                        `;
                        //agregarlo al html
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        //limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        acutalizarProgreso();

                        /* var tareaHTML = document.querySelector('.listado-pendientes p');
                        tareaHTML.innerHTML = `<p>${tareaInsertada}</p>`; */
                    }
                } else {
                    Swal.fire({
                        title: "Error",
                        type: "error",
                        text: "Hubo un error"
                    })
                }
            }
        }

        //enviar datos
        xhr.send(datos);
    }
}

let eventListeners = () => {
    //document ready
    document.addEventListener('DOMContentLoaded', function () {
        acutalizarProgreso();
    });

    //agregar nuevo proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
    //eliminar proyecto
    document.querySelector('.lista-proyectos').addEventListener('click', eliminarProyecto);
    //agregar tarea
    if(document.querySelector('.nueva-tarea')){
    document.querySelector('.nueva-tarea').addEventListener('click', nuevaTarea);
    }
    //Botones para las acciones de las tareas - delegation
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

}
eventListeners();//con functions va arriba

function guardarProyectoDB(nombreProyecto) {
    //inyectar html
    /*var nuevoProyecto = document.createElement('li'); 
    nuevoProyecto.innerHTML = `<a href="#"> ${nombreProyecto}</a>`; 
    listaProyectos.appendChild(nuevoProyecto);*/ 
    
    //llamado de AJAX
    var xhr = new XMLHttpRequest();
    //enviar datos por formData
    var datos = new FormData();
    datos.append("proyecto", nombreProyecto);
    datos.append('accion','crear');
    //abrir la conexión
    xhr.open('POST','includes/modelos/modelo-proyectos.php',true);
    //en la Carga
    xhr.onload = function() {
        if(this.status == 200){
            //console.log(JSON.parse(xhr.responseText));
            //obtener datos de la respuesta producida por modelo-proyectos.php
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.proyecto,
                id_proyecto = respuesta.id_insertado,
                accion = respuesta.accion,
                resultado = respuesta.respuesta;
            if (resultado === 'correcto') {
                
                if (accion === 'crear') {
                    //si la acción fue crear
                    //inyectar html
                    var nuevoProyecto = document.createElement('li'); 
                    nuevoProyecto.innerHTML = `<a href="index.php?id_proyecto=${id_proyecto}" id = "proyecto:${id_proyecto}"> ${proyecto}</a>`; 
                    listaProyectos.appendChild(nuevoProyecto);
                    //enviar notificacion de exito
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                      });
                      
                      Toast.fire({
                        type: 'success',
                        title: 'Proyecto '+ proyecto + ' creado correctamente',
                      })
                    //redireccionar a la nueva url creada
                    .then((resultado) => {
                        if (resultado.value) {
                            window.location.href = "index.php?id_proyecto=" + id_proyecto;
                        }
                      });
                      
                                   
                }else{
                    //se actualizó o se eliminó
                }
                    
            }else{
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                  });
                  
                  Toast.fire({
                    type: 'error',
                    title: 'Error al crear proyecto',
                    timer: 2500,
                    showConfirmButton: false
                  })
            }
        }
    }
    //enviar el request
    xhr.send(datos);
}
function eliminarProyecto(e){
    e.preventDefault();
    //delegation
    var eliminar = e.target.classList.contains('fa-trash');
    var enlace = e.target;
    if (eliminar) {
        var nombreProyecto = e.target.parentElement.textContent;
        
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrarlo!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {

                var eliminarProyecto = e.target.parentElement;
                //borrar proyecto de la base de datos
                eliminarProyectoDB(eliminarProyecto);
                //console.log(eliminarProyecto.classList);
                //borrar del html
                eliminarProyecto.remove();
              Swal.fire(
                'Eliminado!',
                'El proyecto: ' + nombreProyecto + 'ha sido eliminada' ,
                'success'
              )
            }
          })
    }else if(enlace.href) {
        window.location.href = enlace.href;
    }
}
//cambia el estado de las tareas o las elimina
function accionesTareas(e){
    e.preventDefault();
    //en delegation creas un contenedor grande y comparas a que elemento el usuario está dando click con e.target
    var circulo = e.target.classList.contains('fa-check-circle'),
        eliminar = e.target.classList.contains('fa-trash');
    if (circulo) {
        
        if(e.target.classList.contains('completo')){
            e.target.classList.remove('completo');
            
            cambiarEstadoTarea(e.target, 0);
        }else{
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }else if(eliminar){
        var nombreTarea = e.target.parentElement.parentElement.textContent;
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrarlo!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {

                var eliminarTarea = e.target.parentElement.parentElement;
                //borrar de la base de datos
                eliminarTareaDB(eliminarTarea);

                //borrar del html
                eliminarTarea.remove();
              Swal.fire(
                'Eliminado!',
                'la tarea: ' + nombreTarea + 'ha sido eliminada' ,
                'success'
              )
            }
          })
    }
}
//cambia el estado de la tarea a completado o no completado
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':')[1];
    //var nombreTarea = tarea.parentElement.parentElement.textContent;

    //llamado AJAX
    var xhr = new XMLHttpRequest();
    //informacion
    var datos = new FormData();
    datos.append('id', idTarea);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);
    //datos.append('tarea',nombreTarea);
    
    //abrir la conexion
    xhr.open('POST','includes/modelos/modelo-tareas.php', true);
    //console.log(...datos);//ver los datos enviados
    //on load
    xhr.onload = function(){
        if (this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta);
            acutalizarProgreso();
        }
    }
    //enviar la peticion
    xhr.send(datos);
}
//eliminar proyecto de la base de datos
function  eliminarProyectoDB(proyecto) {
    var classProyecto = proyecto.classList;//[1] porque es la primera posición
    //var nombreProyectotarea = tarea.parentElement.parentElement.textContent;
    console.log(classProyecto);
    //llamado AJAX
    var xhr = new XMLHttpRequest();
    //informacion
    var datos = new FormData();
    datos.append('clase', classProyecto);
    datos.append('accion', 'eliminar');
    //datos.append('tarea',nombreTarea);
    
    //abrir la conexion
    xhr.open('POST','includes/modelos/modelo-proyectos.php', true);
    //console.log(...datos);//ver los datos enviados
    //on load
    xhr.onload = function(){
        if (this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta);
            

            /* var listaTareasRestantes = document.querySelectorAll('li.restantes');
            if (listaTareasRestantes.length == 0) {
                document.querySelector('.lista-proyectos ul').innerHTML = "<h2 class ='lista-vacia'> No hay proyectos </h2>";
            } */
            
            
        }
    }
    //enviar la peticion
    xhr.send(datos);
}
//elimina las tareas de la basde de datos
function  eliminarTareaDB(tarea) {
    var idTarea = tarea.id.split(':')[1];//[1] porque es la primera posición
    //var nombreTarea = tarea.parentElement.parentElement.textContent;

    //llamado AJAX
    var xhr = new XMLHttpRequest();
    //informacion
    var datos = new FormData();
    datos.append('id', idTarea);
    datos.append('accion', 'eliminar');
    //datos.append('tarea',nombreTarea);
    
    //abrir la conexion
    xhr.open('POST','includes/modelos/modelo-tareas.php', true);
    //console.log(...datos);//ver los datos enviados
    //on load
    xhr.onload = function(){
        if (this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta);
            

            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length == 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = "<h2 class ='lista-vacia'> No hay tareas asociadas a este proyecto</h2>";
            }
            //actualizar el progreso
            acutalizarProgreso();
        }
    }
    //enviar la peticion
    xhr.send(datos);
}
//actualiza el avance del proyecto
function acutalizarProgreso(){
    const tareas = document.querySelectorAll('li.tarea');
    //obtener tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    //obtener avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    //asignar el avance de la barra

    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';
    //mostrar alerta al completar el 100%
    if (avance == 100) {
        Swal.fire({
            title: "Proyecto Completado",
            type: "success",
            text: "Has completado todas las tareas de estre proyecto"
        })
    }
}
