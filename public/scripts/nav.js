const blogLink = document.querySelector("#nav-logo");
const readLink = document.querySelector("#nav-read");
const registerLink = document.querySelector("#nav-register");
const loginLink = document.querySelector("#nav-login");

const logoutLink = document.querySelector("#nav-logout");
const profileLink = document.querySelector("#nav-profile");
const writeLink = document.querySelector('#nav-write');


const domParser = new DOMParser();
async function fetchAndSwapMain(route) {
  const response = await fetch(route);
  const responseText = await (await fetch(route)).text();
  const responseDocument = domParser.parseFromString(responseText, 'text/html');
  document.querySelector("main").innerHTML = responseDocument.querySelector("main").innerHTML;
}

blogLink.addEventListener('click', async function(event) {
  window.location.href = '/';
  console.log("goto blog!");
});

readLink.addEventListener('click', async function(event) {
  window.location.href = '/';
  console.log("goto read!");
});

if (writeLink) {
  writeLink.addEventListener('click', async function(event) {
    window.location.href = '/write';
    console.log('goto write!');
  });
}

if (registerLink) {
  registerLink.addEventListener('click', async function(event) {
    window.location.href = '/register';
    console.log('goto register!');
  });
}

if (loginLink) {
  loginLink.addEventListener('click', async function(event) {
    window.location.href = '/login';
    console.log("goto login!");
  });
}

if (logoutLink) {
  logoutLink.addEventListener('click', async function(event) {
    window.location.href = '/logout';
    console.log("goto logout!");
  });
}

