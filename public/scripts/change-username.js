const newUsername = document.querySelector(".change-username");
const password = document.querySelector(".change-password");
const submitButton = document.querySelector('#form-change button');

submitButton.addEventListener('click', async function(event){
  event.preventDefault();

  const response = await fetch('/change-username', {
    method: "POST",
    body: JSON.stringify({
      newUsername: newUsername.value,
      password: password.value
    }),
    headers: { "Content-type": "application/json" },
    redirect: 'follow'
  });
  window.location.href = response.url;

});

for (field of [newUsername, password]) {
  field.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
      submitButton.click();
    }
  });
}
