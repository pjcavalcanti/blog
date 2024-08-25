const pages = document.querySelectorAll('.page-selector li');

console.log(pages);
for (page of pages) {
  if (page.classList.contains('page-selected') || isNaN(page.innerHTML)) {
    page.style.pointerEvents = 'none';
    continue;
  }

  page.addEventListener('click', function(event) {
    const params = new URLSearchParams({
      page: event.target.innerHTML,
    });

    const url = `/?${params.toString()}`
    window.location.href = url;
  });
  console.log(page.innerHTML, !isNaN(page.innerHTML));
}
