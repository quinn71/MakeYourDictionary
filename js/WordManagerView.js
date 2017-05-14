class WordManagerView {
  constructor(model) {
    this._model = model;
    this._element = document.querySelector('.word-manager');
    this.wordField = document.querySelector('input[name="word"]');
    this.translationField = document.querySelector('input[name="translation"]');
    this.selector = this._element.querySelector('#manager-select');

    this.addWordRequestEvent = new Event();
    this.createButtonPressedEvent = new Event();

    const addButton = this._element.querySelector('.add-word-button');
    const openButton = document.querySelector('.open-button');
    const closeButton = this._element.querySelector('.close-icon');
    const createButton = this._element.querySelector('.create-button');

    openButton.onclick = this.open.bind(this);
    closeButton.onclick = this.close.bind(this);
    createButton.onclick = this.create.bind(this);

    addButton.addEventListener('click', () => {
      this.addWord();
    });

    document.addEventListener('keydown', event => {
      if (event.keyCode == 13) {
        this.addWord();
      }
    });
  }

  open() {
    const dictionaries = this._model.getAllDictionaries();
    this.selector.innerHTML = '';

    for(let name in dictionaries) {
      if (dictionaries.hasOwnProperty(name)) {
        let option = document.createElement('option');
        option.innerHTML = name;
        this.selector.appendChild(option);
      }
    }

    this._element.classList.remove('hidden');
    this._element.classList.remove('invisible');
  }

  close() {
    this._element.classList.add('hidden');
    this._element.classList.add('invisible');
  }

  create() {
    let name = prompt('Enter name: ');
    this.createButtonPressedEvent.notify(name);
  }

  addWord() {
    const wordField = this.wordField;
    const translationField = this.translationField;
    const selector = this.selector;
    const selectedField = selector.options[selector.selectedIndex];

    const word = wordField.value;
    const translation = translationField.value;
    const dictionaryName = selectedField.value;

    this.addWordRequestEvent.notify(dictionaryName, word, translation);

    wordField.value = '';
    translationField.value = '';

    wordField.focus();
  }

  refresh() {
    const dictionaries = this._model.getAllDictionaries();
    this.selector.innerHTML = '';

    for(let name in dictionaries) {
      if (dictionaries.hasOwnProperty(name)) {
        let option = document.createElement('option');
        option.innerHTML = name;
        this.selector.appendChild(option);
      }
    }

    this._element.classList.remove('hidden');
    this._element.classList.remove('invisible');
  }
}
