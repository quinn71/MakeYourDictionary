class WordListView {

  constructor(name, model) {
    this.model = model;
    this.dictionary = model.getDictionary(name);
    this.name = name;

    if(!this.DOMElem) {
      this.render();
    }

    this.removeIconPressedEvent = new Event();
    this.dictionaryClearButtonPressedEvent = new Event();
    this.dictionaryRemoveButtonPressedEvent = new Event();
    this.restoreFieldHeights = [];
    this.timeouts1 = [];// timeouts2 = [];
  }

  getElem() {
    return this.DOMElem;
  }

  getName() {
    return this.name;
  }

  render() {
    this.DOMElem = document.createElement('div');
    this.DOMElem.className = 'wordlist';

    this.renderList();
  }

  renderList() {
    let nameField = document.createElement('span');
    let nameFieldOuter = document.createElement('div');
    let wordFieldsOuter = document.createElement('div');


    wordFieldsOuter.className = 'all-fields-outer';
    nameField.innerHTML = this.name;
    nameField.className = 'dictionary-name';
    nameFieldOuter.className = 'dictionary-name-outer';

    let clearIcon = document.createElement('div');
    let deleteDictionaryIcon = document.createElement('div');
    nameFieldOuter.appendChild(nameField);
    nameFieldOuter.appendChild(clearIcon);
    nameFieldOuter.appendChild(deleteDictionaryIcon);
    this.DOMElem.appendChild(nameFieldOuter);

    let _this = this;

    this.dictionary.forEach(function(translation, word) {
      let list = _this.DOMElem;
      let field = document.createElement('div');
      let fieldOuter = document.createElement('div');
      field.className = 'field';
      fieldOuter.className = 'field-outer';
      let closeIcon = document.createElement('div');
      closeIcon.className = 'close-icon';

      closeIcon.addEventListener('click', (event) => {
        let word;
        let target = event.target;
        word = target.parentNode.innerHTML.split(' - ')[0];
        _this.removeIconPressedEvent.notify(_this.name, word);
      });

      field.innerHTML = word + ' - ' + translation;
      field.appendChild(closeIcon);
      fieldOuter.appendChild(field);
      wordFieldsOuter.appendChild(fieldOuter);
    });

    let toggleButton = document.createElement('button');
    toggleButton.classList.add('toggle-list-button');
    toggleButton.classList.add('opened');
    toggleButton.addEventListener('click', () => {
      this.toggleList();
    });



    clearIcon.className = 'clear-icon';
    clearIcon.addEventListener('click', () => {
      const name = this.name;
      this.dictionaryClearButtonPressedEvent.notify(name);
    });

    deleteDictionaryIcon.className = 'delete-icon';
    deleteDictionaryIcon.addEventListener('click', () => {
      const name = this.name;
      this.dictionaryRemoveButtonPressedEvent.notify(name);
    });

    this.DOMElem.appendChild(wordFieldsOuter);
    this.DOMElem.appendChild(toggleButton);

  }

  refresh() {
    this.DOMElem.innerHTML = '';
    this.model.updateModelData();
    this.dictionary = this.model.getDictionary(this.name);
    this.renderList();
  }

  updateDictionary() {
    this.dictionary = this.model.getDictionary();
  }

  toggleList() {
    let wordlist = this.getElem();
    let toggleButton = wordlist.querySelector('.toggle-list-button');

    if(toggleButton.classList.contains('opened')) {
      toggleButton.classList.add('closed');
      toggleButton.classList.remove('opened');

      this.hideList();
    }
    else {
      toggleButton.classList.add('opened');
      toggleButton.classList.remove('closed');

      this.showList();
    }
  }

  hideList() {
    let element = this.getElem();
    let fields = element.querySelectorAll('.field');

    fields.forEach(field => {
      this.animateHide(field);
    });
  }

  showList() {
    let element = this.getElem();
    let fields = element.querySelectorAll('.field');
    fields.forEach(field => {
      this.animateShow(field);
      //field.style.height = '';
    });
  }

  animateHide(field) {
    this.restoreFieldHeights.push(field.offsetHeight);
    field.classList.add('closed');
    let _this = this;
    (function compressHeight() {
      let oldHeight = parseInt(field.offsetHeight);
      field.style.height = ((oldHeight > 4) ? (oldHeight-4) : (0)) + 'px';

      if(oldHeight > 0) {
        requestAnimationFrame(compressHeight);


        //setTimeout(compressHeight, 1);
      }
    })();
  }

  animateShow(field) {
    let restoreHeight = this.restoreFieldHeights.shift();
    let _this = this;
    field.classList.remove('closed');

    (function expandHeight() {
      let oldHeight = parseInt(field.style.height);
      field.style.height = ((oldHeight < restoreHeight - 4) ? (oldHeight+4) : (restoreHeight)) + 'px';
      console.log(field.style.height);
      if(oldHeight < restoreHeight) {

        requestAnimationFrame(expandHeight);
      }
    })();
  }
}