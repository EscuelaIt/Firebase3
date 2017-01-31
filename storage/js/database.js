// Accedo al servicio de la base de datos
var database = firebase.database();

function guardarPerfil(uid, userData) {
  //compruebo si ya tengo el perfil creado
  console.log('compruebo si ya tengo el perfil creado')
  var refPerfil = database.ref('users').child(uid);
  refPerfil.once('value', function(ss) {
    var objUser = ss.val();
    if(!objUser) {
      //no tengo el perfil, lo guardo
      guardarImagenAvatar(userData.photoURL);
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

function almacenarAvatar(url, uid) {
  var refPerfil = database.ref('users').child(uid).child('photoURL');
  refPerfil.set(url);
}

function borrarPerfil(uid) {
  var refPerfil = database.ref('users').child(uid);
  refPerfil.remove();
}

function guardarImagenAvatar(url) {
  console.log('guardarImagenAvatar', url);
  var user = auth.currentUser;
  //http://stackoverflow.com/questions/11876175/how-to-get-a-file-or-blob-from-an-object-url
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    if (this.status == 200) {
      var myBlob = this.response;
      //console.log(myBlob)
      var storage = firebase.storage();
      var refStorage = storage.ref('images/avatar').child(user.uid).child('img.jpg');
      var uploadTask = refStorage.put(myBlob);
      uploadTask.on('state_changed', null, null, function() {
        almacenarAvatar(uploadTask.snapshot.downloadURL, user.uid);
        actualizaReferenciaAvatar(uploadTask.snapshot.ref.fullPath, user.uid);
        user.updateProfile({
          photoURL: uploadTask.snapshot.downloadURL
        }).then( function(){
          var objUser = generarObjPerfil();
          mostrarUsuarioActual(objUser); 
        });
      }); 
    }
  };
  xhr.send();
}

function actualizaReferenciaAvatar(nuevaRef, uid) {
  var refAvatar = database.ref('users').child(uid).child('avatarRef');
  refAvatar.once('value', function(ss) {
    var refAvatarString = ss.val();
    if(refAvatarString) {
      //Borro el archivo anterior
      
      var storageref = storage.ref(refAvatarString);
      storageref.delete()
        .then(function() {
          console.log('borrado el archivo anterior');
        })
        .catch(function(err) {
          console.log('Error al borrar el fichero', err);          
        })
    }
    refAvatar.set(nuevaRef);
  });
}