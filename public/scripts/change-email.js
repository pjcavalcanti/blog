const newEmail = document.querySelector(".change-email");
const password = document.querySelector(".change-password");
const submitButton = document.querySelector('#form-change button');

submitButton.addEventListener('click', async function(event){
  event.preventDefault();

  const response = await fetch('/change-email', {
    method: "POST",
    body: JSON.stringify({
      newEmail: newEmail.value,
      password: password.value
    }),
    headers: { "Content-type": "application/json" },
    redirect: 'follow'
  });
  window.location.href = response.url;

});

for (field of [newEmail, password]) {
  field.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
      submitButton.click();
    }
  });
}
