//Login de usuarios
var botonGoogle = getId('logingoogle');
if(botonGoogle) {
  botonGoogle.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    loginOAuth(provider);
  });
}

var botonFacebook = getId('loginfacebook');
if(botonFacebook) {
  botonFacebook.addEventListener('click', function() {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    provider.addScope('user_friends');
    loginOAuth(provider);
  });
}


function loginOAuth(provider) {
  auth.signInWithPopup(provider)
    .then(function(result) {
      var user = result.user;
      var credential = result.credential;
      console.log('login con oauth', user, credential);
      // voy a guardar el perfil del usuario
      guardarPerfil(user.uid, generarObjPerfil());
    }).catch(function(err) {
      var errorMessage = err.message;
      //var errorMessage = err.code;
      mensajeFeedback('Error de autenticación: ' + errorMessage);
    });
}