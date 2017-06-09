(function CustomAlert() {
  const alertOuter = document.querySelector('.alert-box-outer');
  const alert = document.querySelector('.alert-box');
  const closeIcon = alert.querySelector(".close-icon");
  const okButton = alert.querySelector(".ok-button");
  const textField = alert.querySelector('.text-field');

  function open(str) {
    textField.innerHTML = str;
    alertOuter.style.display = "block";
  }

  function close() {
    alertOuter.style.display = "none";
  }

  closeIcon.onclick = close;
  okButton.onclick = close;

  window.alert = open;
})();