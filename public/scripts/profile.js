const changeUsername = document.querySelector('.profile-data-username .change');
const changeEmail = document.querySelector('.profile-data-email .change');
const changePassword = document.querySelector('.password');
const myPosts = document.querySelector('.my-posts');

changeUsername.addEventListener('click', function(event) {
  window.location.href = "/change-username";
});

changeEmail.addEventListener('click', function(event) {
  window.location.href = "change-email";
});

changePassword.addEventListener('click', function(event) {
  window.location.href = "change-password";
});

myPosts.addEventListener('click', function(event) {
  window.location.href = "my-posts";
});
