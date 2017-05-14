window.addEventListener('load', function() {
  let alertBox = new Alert(true);
});

function stopPageExecution(color) {
  const body = document.body;
  const cover = document.createElement('div');
  cover.className = 'execution-stopper';
  cover.style.position = 'fixed';
  cover.style.width = '100vw';
  cover.style.height = '100vh';
  cover.style.top = '0';
  cover.style.left = '0';
  cover.style.backgroundColor = color || '#aaaaaa';
  cover.style.opacity = '0.5';
  cover.style.cursor = 'not-allowed';
  cover.style.zIndex = '9998';

  body.scroll = 'no';

  body.appendChild(cover);
}

function resumePageExecution() {
  const body = document.body;
  const cover = document.querySelector('.execution-stopper');

  body.removeChild(cover);
}

class Alert {
  constructor(useAutoDimensions) {
    let textField, okButton;
    let element;

    element = document.createElement('div');
    element.className = 'element';
    textField = document.createElement('span');
    textField.className = 'text-field';
    textField.style.display = 'block';
    textField.style.textAlign = 'center';

    okButton = document.createElement('button');
    okButton.innerHTML = 'OK';
    okButton.addEventListener('click', () => { this.close() });
    document.addEventListener('keydown', () => {
      if (event.keyCode == 13) {
      this.close()
    }});


    element.appendChild(textField);
    element.appendChild(okButton);

    if (useAutoDimensions) {
      element.style.boxSizing = 'border-box';
      element.style.background = '#fff';
      element.style.border = '1px solid black';
      element.style.paddingTop = '2%';
      element.style.width = '400px';
      element.style.height = '130px';

      okButton.style.position = 'absolute';
      okButton.style.bottom = '5%';
      okButton.style.right = '5%';
      okButton.style.width = '20%';
    }

    element.style.position = 'fixed';
    element.style.top = '5%';
    element.style.left = '50%';
    element.style.transform = 'translateX(-50%)';
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.zIndex = '9999';


    this.textField = textField;
    textField.innerHTML = 'test';
    this.okButton = okButton;
    this.element = element;

    document.body.appendChild(element);

    //window.alert = this.alert.bind(this);
  }

  alert(str) {
    let element = this.element, textField = this.textField;
    textField.innerHTML = str;
    stopPageExecution();
    element.style.display = 'block';
    setTimeout(() => {
      element.style.visibility = 'visible';
    }, 2000);
  }

  close() {
    let element = this.element;
    element.style.visibility = 'visible';
    element.style.display = 'none';
    resumePageExecution();
  }


}
