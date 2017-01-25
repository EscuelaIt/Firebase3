// var botonRegistro = getId('registro');
// if(botonRegistro) {
//   botonRegistro.addEventListener('click', function() {
//     var user = auth.currentUser;
//     if(user) {
//       mensajeFeedback('Ya estás logueado como usuario, no necesitas registrarte');
//       return false;
//     }
//     var nombre = getValue('inputnombre');
//     var email = getValue('inputemail');
//     var password = getValue('inputpassword');
//     if(!nombre || !email || !password) {
//       mensajeFeedback('Debes completar los datos del formulario');
//       return false;
//     }
//     auth.createUserWithEmailAndPassword(email, password)
//     .then(function(user){
//       user.sendEmailVerification(); 
//       console.log(user);
//       // guardo los datos del usuario en la BBDD
//       guardarPerfil(user.uid, {
//         nombre: nombre,
//         email: email
//       });
//       user.updateProfile({
//         displayName: nombre,
//         datoPirata: 'soy un pirata'
//       }).then( function(){
//         var objUser = generarObjPerfil();
//         mostrarUsuarioActual(objUser); 
//       });
//     })
//     .catch(function(err) {
//       // Handle Errors here.
//       var errorCode = err.code;
//       var errorMessage = err.message;
//       mensajeFeedback('Error: ' + errorCode + ' ' + errorMessage);
//     });
//   })
// }


var botonRegistro = getId('registro');
if(botonRegistro) {
  botonRegistro.addEventListener('click', function() {
    var user = auth.currentUser;
    //compruebo si hay usuario y no es anónimo
    if(user && !user.isAnonymous) {
      mensajeFeedback('Ya estás logueado como usuario, no necesitas registrarte');
      return false;
    }
    var nombre = getValue('inputnombre');
    var email = getValue('inputemail');
    var password = getValue('inputpassword');
    if(!nombre || !email || !password) {
      mensajeFeedback('Debes completar los datos del formulario');
      return false;
    }
    if(user) {
      convertirUsuarioAnonimo(user, email, password, nombre);
    } else {
      crearUsuarioNuevo(email, password, nombre);
    }
  })
}

function convertirUsuarioAnonimo(userActual, email, password, nombre) {
  var credential = firebase.auth.EmailAuthProvider.credential(
    email, 
    password
  );
  userActual.link(credential)
    .then(function() {
      console.log('todo bien');
      guardarPerfilUsuarioNuevo(userActual, nombre, email);
    })
    .catch(function(err) {
      console.log('problema con la credential')
    });
}

function crearUsuarioNuevo(email, password, nombre) {
  auth.createUserWithEmailAndPassword(email, password)
    .then(function(user){
      user.sendEmailVerification(); 
      console.log(user);
      // guardo los datos del usuario en la BBDD
      guardarPerfilUsuarioNuevo(user, nombre, email);
    })
    .catch(function(err) {
      // Handle Errors here.
      var errorCode = err.code;
      var errorMessage = err.message;
      mensajeFeedback('Error: ' + errorCode + ' ' + errorMessage);
    });
}

function guardarPerfilUsuarioNuevo(user, nombre, email) {
  guardarPerfil(user.uid, {
    nombre: nombre,
    email: email
  });
  user.updateProfile({
    displayName: nombre,
    datoPirata: 'soy un pirata'
  }).then( function(){
    var objUser = generarObjPerfil();
    mostrarUsuarioActual(objUser); 
  });
}

var botonLogin = getId('login');
if(botonLogin) {
  botonLogin.addEventListener('click', function() {
    var email = getValue('emailinput');
    var password = getValue('passwordinput');
    auth.signInWithEmailAndPassword(email, password)
      .then(function(user){
        console.log('user', user);
      })
      .catch(function(err) {
        console.log('Error en login', err)
    });
  })
}

var botonRecuperar = getId('botonrecordar');
if(botonRecuperar) {
  botonRecuperar.addEventListener('click', function() {
    auth.sendPasswordResetEmail(getValue('emailinput'))
      .then(function() {
        mensajeFeedback('Correo enviado');
      })
      .catch(function(err) {
        if(err.code == 'auth/user-not-found') {
          msg = 'Usuario inexistente';
        } else {
          msg = 'Email mal formado';
        }
        mensajeFeedback('Error: ' + msg);
      });       
  })
}

var botonBaja = getId('bajauser');
if(botonBaja) {
  botonBaja.addEventListener('click', function() {
    var user = auth.currentUser;
    if(!user) {
      mensajeFeedback('No estás logueado');
      return false;
    }
    var uid = user.uid;
    var email = user.email;
    var password = getValue('passwordinput');
    
    var credential = firebase.auth.EmailAuthProvider.credential(
      email, 
      password
    );
    user.reauthenticate(credential).then(function() {
      user.delete()
        .then(function() {
          mensajeFeedback('eliminado el user');
          borrarPerfil(uid);
        })
        .catch(function() {
          mensajeFeedback('Error al eliminar el user');
        })
    }, function(error) {
      mensajeFeedback('password no válido')
    });
  })
}

