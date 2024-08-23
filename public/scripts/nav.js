const blogLink = document.querySelector("#header-logo");
const readLink = document.querySelector("#read-link");
const registerLink = document.querySelector("#register-link");
const loginLink = document.querySelector("#login-link");

const domParser = new DOMParser();

async function fetchAndSwapMain(route) {
  const response = await fetch(route);
  const responseText = await (await fetch(route)).text();
  const responseDocument = domParser.parseFromString(responseText, 'text/html');
  document.querySelector("main").innerHTML = responseDocument.querySelector("main").innerHTML;
}

blogLink.addEventListener('click', async function(event) {
  fetchAndSwapMain('/');
  console.log("goto blog!");
});
readLink.addEventListener('click', async function(event) {
  fetchAndSwapMain('/');
  console.log("goto read!");
});
registerLink.addEventListener('click', async function(event) {
  await fetchAndSwapMain('/register');
});
loginLink.addEventListener('click', async function(event) {
  await fetchAndSwapMain('/login');
  console.log("goto login!");
});
