class WordListView {

  constructor(name, model) {
    this._model = model;
    this._dictionary = model.getDictionary(name);
    this._name = name;
    //this._DOMElem = document.querySelector('.wordlist');
    if(!this._DOMElem) {
      this.render();
    }

    this.removeIconPressedEvent = new Event();
  }

  getElem() {
    return this._DOMElem;
  }

  getName() {
    return this._name;
  }

  render() {
    this._DOMElem = document.createElement('div');
    this._DOMElem.className = 'wordlist';


    this.renderList();
  }

  renderList() {
    let nameField = document.createElement('span');
    nameField.innerHTML = this._name;
    this._DOMElem.appendChild(nameField);

    let _this = this;

    this._dictionary.forEach(function(translation, word) {
      let list = _this._DOMElem;
      let field = document.createElement('div');
      field.className = 'field';
      let closeIcon = document.createElement('div');
      closeIcon.className = 'close-icon';
      closeIcon.addEventListener('click', (event) => { ///!!!!!!
        let word;
        let target = event.target;
        word = target.parentNode.innerHTML.split(' - ')[0];
        _this.removeIconPressedEvent.notify(_this._name, word);
      });

      field.innerHTML = word + ' - ' + translation;
      field.appendChild(closeIcon);
      list.appendChild(field);
    });
  }

  refresh() {
    this._DOMElem.innerHTML = '';
    this._model.updateModelData();
    this._dictionary = this._model.getDictionary(this._name);
    this.renderList();
  }

  updateDictionary() {
    this._dictionary = this._model.getDictionary();
  }
}