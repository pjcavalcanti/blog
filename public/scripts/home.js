const pages = document.querySelectorAll('.page-selector li');
const posts = document.querySelectorAll('.post-item');

console.log(pages);
for (page of pages) {
  if (page.classList.contains('page-selected') || isNaN(page.innerHTML)) {
    page.style.pointerEvents = 'none';
    continue;
  }

  const params = new URLSearchParams({
    page: page.innerHTML,
  });
  const url = `/?${params.toString()}`

  page.addEventListener('click', function(event) {
    window.location.href = url;
  });
}

for (post of posts) {
  const params = new URLSearchParams({
    postId: post.getAttribute('data-id')
  });

  const url = `/read?${params.toString()}`;
  const button = post.querySelector('.post-item-button');

  button.addEventListener('click', function(event) {
    window.location.href = url;
  });
}
