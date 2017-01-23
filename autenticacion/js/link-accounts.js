getId('enlazargoogle').addEventListener('click', function(){
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');

  auth.currentUser.linkWithPopup(provider)
    .then(function(result){
      console.log('enlazadas cuentas. El usuario:', result.user);
    })
    .catch(function(err) {
      console.log('error al enlazar las cuentas', err);
      var googleCredentials = err.credential;
      console.log('la credencial de Google a enlazar', googleCredentials);
    })
});