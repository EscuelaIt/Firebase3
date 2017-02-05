var key = 'AAAAc3wbSuk:APA91bH3YsB9WjCcSztYW2Cnp26v6tFvFALWXor5wsDuoMQWDifCuEnOmz9hFryhW7FfunyRGMCIsDQmlA6f8AUj_uFQ-BihL_DJ2maMGqM6Vi_i1_w_c-Skys50w0fs7IeATrBHzBjB'
var messaging = firebase.messaging();

getId('solicitarpermiso').addEventListener('click', function() {
  messaging.requestPermission()
    .then(function() {
      console.log('Se han aceptado las notificaciones');
      return messaging.getToken();
    })
    .then(function(token){
      if(token) {
        console.log(token);
        guardarToken(token);
        mostrarToken(token);
      } else {

      }
    })
    .catch(function(err) {
      mensajeFeedback(err);
      console.log('No se ha recibido permiso / token: ', err);
    });
});


function guardarToken(token) {
  console.log('guardando el token de este usuario');
  var user = firebase.auth().currentUser;
  var ref = firebase.database().ref('pushToken').child(user.uid);
  ref.set({
    token: token
  })
    .then(function(){
      console.log('guaddado!!')
    })
    .catch(function(err) {
      console.log('error al guardar', err)
    })
}

function mostrarToken(token) {
  getId('token').textContent = token;
  getId('solicitarpermiso').style.display = 'none';
  getId('comando').style.display = 'block';
  getId('totoken').textContent = token;
  getId('key').textContent = key;
  getId('totoken2').textContent = token;
  getId('key2').textContent = key;
}

messaging.onTokenRefresh(function() {
  console.log('en token refresh');
  messaging.getToken()
    .then(function(token) {
      mostrarToken(token);
      guardarToken(token);
    })
    .catch(function(err) {
      mensajeFeedback(err);
      console.log('No se ha recibido el token: ', err);
    })
});

messaging.onMessage(function(payload) {
  console.log("Mensaje recibido con el sitio activo", payload);
  if(payload.notification) {
    mensajeFeedback(payload.notification.title + ': ' + payload.notification.body);
  }
});
