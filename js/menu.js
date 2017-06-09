const menuBar = document.querySelector('.menu-bar');
const menuIcon = document.querySelector('.menu-icon');
const menuLeft = document.querySelector('.menu-left');
const menuRight = document.querySelector('.menu-right');

menuIcon.onclick = function () {
  if(menuBar.classList.contains('open')) {
    menuLeft.classList.add('hidden-xs');
    menuRight.classList.add('hidden-xs');
    menuBar.classList.remove('open');
  }
  else {
    menuLeft.classList.remove('hidden-xs');
    menuRight.classList.remove('hidden-xs');
    menuBar.classList.add('open')
  }
};