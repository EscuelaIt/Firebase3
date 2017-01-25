getId('enlazargoogle').addEventListener('click', function(){
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  var userActual = auth.currentUser;
  userActual.linkWithPopup(provider)
    .then(function(result){
      console.log('enlazadas cuentas. El usuario:', result.user);
    })
    .catch(function(err) {
      console.log('error al enlazar las cuentas, hay que fusionar', err.code);
      if(err.code == 'auth/credential-already-in-use') {
        if(confirm('Esa credencial pertenece a un usuario.\n¿Deseas fusionar las cuentas?')) {
          fusionarCuentas(userActual, err.credential);
        }
      }
    })
});

function fusionarCuentas(userActual, credential) {
  //autentico con la credencial recibida
  auth.signInWithCredential(credential)
    .then(function(userNuevo) {
      //debería guardar/fusionar todos los datos de este usuario en el userActual
      //esa operativa dependería de la lógica del negocio de cada aplicación
      //...
      //borro el user nuevo
      userNuevo.delete();
      //al userActual le enlazo el userNuevo con su credencial
      userActual.link(credential)
        .then(function() {
          console.log('Usuarios unidos', userActual);
          auth.signInWithCredential(credential)
        })
        .catch(function(err) {
          console.log('Usuarios no unidos', err);
        })
    });
}
