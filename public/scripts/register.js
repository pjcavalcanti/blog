const name = document.querySelector("#form-register .reg-name");
const email = document.querySelector("#form-register .reg-email");
const password = document.querySelector("#form-register .reg-password");
const submitButton = document.querySelector("#form-register button");

submitButton.addEventListener('click', async function(event){
  event.preventDefault();

  const response = await fetch('/register', {
    method: "POST",
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value
    }),
    headers: { "Content-type": "application/json" },
    redirect: 'follow'
  });
  window.location.href = response.url;

});
