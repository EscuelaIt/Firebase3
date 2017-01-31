var botonLoginAnonimo = getId('loginanonimo');
if(loginanonimo) {
  loginanonimo.addEventListener('click', crearUsuarioAnonimo);
}
function crearUsuarioAnonimo(e) {
  e.preventDefault();
  auth.signInAnonymously()
    .then(function(user) {
      console.log('logueado anonimo', user.uid);
      //////////////////////////////////////////
      // no tiene sentido generar un perfil de usuario en la base de datos 
      // para los usuarios anónimos
      // var perfil = generarObjPerfil();
      // guardarPerfil(user.uid, perfil);
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Errr' , errorCode);  
      // ...
    });
}