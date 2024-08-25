const title = document.querySelector("#form-write .write-title");
const summary = document.querySelector("#form-write .write-summary");
const body = document.querySelector("#form-write .write-body");
const postButton = document.querySelector("#form-write button");

postButton.addEventListener('click', async function(event){
  event.preventDefault();

  const response = await fetch('/write', {
    method: "POST",
    body: JSON.stringify({
      title: title.value,
      summary: summary.value,
      body: body.value
    }),
    headers: { "Content-type": "application/json" },
    redirect: 'follow'
  });
  window.location.href = response.url;

});

