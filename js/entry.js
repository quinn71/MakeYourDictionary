window.addEventListener('load', function() {
  let tryButton = document.querySelector('.try-button');

  let cover = document.querySelector('.cover');
  let entryText = document.querySelector('.entry-text');

  cover.classList.add('loaded');

  tryButton.onclick = () => {
    cover.style.opacity = 0;
  };

  window.addEventListener('transitionend',(e) => {
    if(e.target == cover)
      cover.style.display = 'none';
  });
});