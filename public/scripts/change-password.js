const newPassword = document.querySelector(".change-new-password");
const password = document.querySelector(".change-password");
const submitButton = document.querySelector('#form-change button');

console.log(newPassword, password, submitButton);

submitButton.addEventListener('click', async function(event){
  event.preventDefault();

  const response = await fetch('/change-password', {
    method: "POST",
    body: JSON.stringify({
      newPassword: newPassword.value,
      password: password.value
    }),
    headers: { "Content-type": "application/json" },
    redirect: 'follow'
  });
  window.location.href = response.url;

});

for (field of [newPassword, password]) {
  field.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
      submitButton.click();
    }
  });
}
