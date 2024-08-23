const email = document.querySelector("#form-login .log-email");
const password = document.querySelector("#form-login .log-password");
const loginButton = document.querySelector("#form-login button");

loginButton.addEventListener('click', async function(event){
  event.preventDefault();

  const response = await fetch('/login', {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value
    }),
    headers: { "Content-type": "application/json" },
    redirect: 'follow'
  });
  window.location.href = response.url;

});
