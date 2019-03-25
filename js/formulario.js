
eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,//contenido del campo usuario
        contraseña = document.querySelector('#password').value,//contenido del campo contraseña}
        tipoSubmit = document.querySelector('#tipo').value;
        if (usuario === '' || contraseña === '') {

            const notiError = Swal.mixin({
                toast: true,
                position: 'top-end',
              });
              
              notiError.fire({
                type: 'error',
                title: 'Ambos campos son obligatorios'
              })
        }else{

          //ambos campos son correctos - ejecutar ajax

          var datos = new FormData();

          datos.append('usuario', usuario);//la llave es usuario y el contenido lo que venga en la variable usuario
          datos.append('password', contraseña);
          datos.append('accion', tipoSubmit);
          
          //console.log(...datos);//... para crear una copia y poder visualizarlo con .get('usuario'); accede al campo especificado
          //crear el llamado AJAX

          var xhr = new XMLHttpRequest();

          //abrir la conexion

          xhr.open('POST','includes/modelos/modelo-admin.php', true);//el segundo parametro se refiere a donde vamos a enviar los datos 

          //retorno de datos

          xhr.onload= function () {
            if(this.status === 200){
              var respuesta = JSON.parse(xhr.responseText);//responseText viene del codigo escrito en modelo-admin.php [JSON.parse] convierte el argumento en un objeto
              console.log(respuesta);
              //si la respuesta es correcto
              if (respuesta.respuesta === 'correcto') {
                //si es un nuevo usuario 
                if(respuesta.tipo === 'crear'){
                  const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                  });
                  
                  Toast.fire({
                    type: 'success',
                    title: 'El usuario ha sido creado correctamente'
                  })
                } else if(respuesta.tipo === 'login'){
                  Swal.fire({
                    title: 'Login correcto',
                    text: 'Presiona OK para abrir el dashboard',
                    type: 'success'
                  })
                  //promisses en javaScript
                  .then((resultado) => {
                    if (resultado.value) {
                      window.location.href = 'index.php';
                    }
                  });
                }
              }else{
                //hubo un error
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                });
                
                Toast.fire({
                  type: 'error',
                  title: 'Hubo un error'
                })
              }

            }
          }
          xhr.send(datos);//se envia todo lo que está en el FormData

        }
}