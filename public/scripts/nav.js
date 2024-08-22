const blogLink = document.querySelector("#header-logo");
const readLink = document.querySelector("#read-link");
const registerLink = document.querySelector("#register-link");
const loginLink = document.querySelector("#login-link");

blogLink.addEventListener('click', function(event) {
  console.log("goto blog!");
});
readLink.addEventListener('click', function(event) {
  console.log("goto read!");
});
registerLink.addEventListener('click', async function(event) {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(result.text(), 'text/html');
  //     document.querySelector("html") = result.text();
//   try {
//     const result = await fetch('/register');
//     if (!result.ok) {
//       throw new Error("Fetch error");
//     }
//     const json = await result.json();
//     console.log(json);
  fetch('/register').then(response => console.log(response)).catch(error => console.log(error));
//   } catch (error) {
//     console.log(error.message);
//   }
});
loginLink.addEventListener('click', function(event) {
  console.log("goto login!");
});
