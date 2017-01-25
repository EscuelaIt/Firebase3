// Accedo al servicio de autenticación & BBDD
var auth = firebase.auth();

function generarObjPerfil() {
  var user = auth.currentUser;
  //console.log(user);
  //console.log('voy a crear el objeto a partir de ', user)
  if(user.providerData[0]){
    return {
      nombre: user.displayName || user.providerData[0].displayName || 'Nombre desconocido',
      email: user.email || user.providerData[0].email || 'no-email@example.com',
      photoURL: user.photoURL || user.providerData[0].photoURL || 'http://www.midominio.com/imagen-avatar-default.png'
    };
  } else {
    return {
      nombre: 'Anonomo',
      email: 'no-email@example.com',
      photoURL: 'http://www.midominio.com/imagen-avatar-default.png'
    };
  }
}

// Por aquí pasaré cada vez que cambia el estado de autenticación
auth.onAuthStateChanged(function(user) {
  if (user) {
    getId('logouticon').style.display = 'block';
    var objUser = generarObjPerfil();
    mostrarUsuarioActual(objUser); 
  } else {
    getId('logouticon').style.display = 'none';
    ocultarUsuarioActual(objUser); 
    console.log('no tengo usuario');
  }
});

getId('logouticon').addEventListener('click', function() {
  auth.signOut()
    .then(function() {
      mensajeFeedback('Sesión cerrada');
    });
});