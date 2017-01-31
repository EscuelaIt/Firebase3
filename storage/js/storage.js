
var storage = firebase.storage();

getId('uploadavatar').addEventListener('click', function() {
  var file = getId('campoarchivo').files[0];
  //console.log(file);
  var user = auth.currentUser;
  if(!user) {
    mensajeFeedback('Debes estar autenticado');
    return false;
  }
  if(user.isAnonymous) {
    mensajeFeedback('No acepto usuarios anónimos');
    return false;
  }
  if(! file) {
    mensajeFeedback('Debes seleccionar un archivo');
    return false;
  }
  if (!tipoValido(file.type)) {
    mensajeFeedback('El tipo de archivo no está permitido');
    return false;
  }
  subirArchivo(file);
});

var uploadTask;
function subirArchivo(file) {
  console.log(file);
  getId('estadosubida').style.display = 'flex';
  getId('porcentaje').textContent = '';
  getId('mensajeupload').textContent = '';  
  getId('controlesupload').style.display = 'block';
  var user = auth.currentUser;

  var refStorage = storage.ref('images/avatar/').child(user.uid).child(file.name);
  uploadTask = refStorage.put(file);

  uploadTask.on('state_changed', duranteCarga, controlError, subidaFinalizada);

  function controlError(err) {
    console.log('Error al subir el archivo', err);
  }

  function subidaFinalizada() {
    console.log('Subida completada', uploadTask.snapshot.downloadURL, uploadTask.snapshot.totalBytes);
    getId('mensajeupload').textContent = 'Completada!';
    getId('controlesupload').style.display = 'none';
    almacenarAvatar(uploadTask.snapshot.downloadURL, user.uid);
    actualizaReferenciaAvatar(uploadTask.snapshot.ref.fullPath, user.uid);
    user.updateProfile({
      photoURL: uploadTask.snapshot.downloadURL
    }).then( function(){
      var objUser = generarObjPerfil();
      mostrarUsuarioActual(objUser); 
    });
  }

  function duranteCarga(utss) {
    console.log(utss);
    var porcentaje = Math.round((utss.bytesTransferred / utss.totalBytes) * 100);
    getId('porcentaje').textContent = porcentaje + '%';
  }
  
}




function tipoValido(tipo) {
  var types = ["image/png", "image/jpeg"];
  if(types.indexOf(tipo) == -1) {
    return false
  }
  return true;
}