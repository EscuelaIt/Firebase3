// Accedo al servicio de la base de datos
var database = firebase.database();

function guardarPerfil(uid, userData) {
  //compruebo si ya tengo el perfil creado
  var refPerfil = database.ref('users').child(uid);
  refPerfil.once('value', function(ss) {
    var objUser = ss.val();
    if(!objUser) {
      //no tengo el perfil, lo guardo
      refPerfil.set(userData)
        .then(function() {
          mensajeFeedback('Perfil creado')
        })
        .catch(function(err) {
          mensajeFeedback('Perfil no se ha creado', err);
        });
    }
  });
}

function borrarPerfil(uid) {
  var refPerfil = database.ref('users').child(uid);
  refPerfil.remove();
}