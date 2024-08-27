const changeUsername = document.querySelector('.profile-data-username .change');
const changeEmail = document.querySelector('.profile-data-email .change');

changeUsername.addEventListener('click', function(event) {
  window.location.href = "/change-username";
});

changeEmail.addEventListener('click', function(event) {
  window.location.href = "change-email";
});
