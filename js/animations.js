const wordlistContainers = document.querySelectorAll('.wordlist');
wordlistContainers.forEach(wordlist => {
  const button = wordlist.querySelector('.toggle-list-button');
  const fieldSet = wordlist.querySelector('all-fields-outer');
  button.addEventListener('click', () => {
    if(button.classList.contains('opened')) {
      console.log('closing');
    }
    else {
      console.log('opening');
    }
  });
});

function animateShow() {

}

function animateHide() {

}