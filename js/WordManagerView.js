class WordManagerView {
  constructor(model) {
    const element = document.querySelector('.word-manager');
    const wordField = element.querySelector('input[name="word"]');
    const translationField = element.querySelector('input[name="translation"]');
    const selector = element.querySelector('#manager-select');

    this.model = model;

    this.element = element;
    this.wordField = wordField;
    this.translationField = translationField;
    this.selector = selector;

    this.addWordRequestEvent = new Event();
    this.createButtonPressedEvent = new Event();


    const addButton = element.querySelector('.add-word-button');
    const openButton = document.querySelector('.open-manager-button');
    const openLink = document.querySelector('.add-new-word-link');
    const closeButton = element.querySelector('.close-icon');
    const createButton = element.querySelector('.create-button');

    if(openButton) openButton.onclick = this.open.bind(this);
    openLink.onclick = this.open.bind(this);
    closeButton.onclick = this.close.bind(this);
    createButton.onclick = this.create.bind(this);
    addButton.onclick = this.addWord.bind(this);
    document.addEventListener('keydown', event => {
      if(this.isManagerOpen) {
        switch(event.keyCode) {
          case 13: this.addWord();break;
          case 27: this.close();break;
        }
      }
    });
  }

  getElem() {
    return this.element;
  }

  open() {
    const dictionaries = this.model.getAllDictionaries();
    const selector = this.selector;
    const element = this.element;

    selector.innerHTML = '';

    for(let name in dictionaries) {
      if (dictionaries.hasOwnProperty(name)) {
        let option = document.createElement('option');
        option.innerHTML = name;
        selector.appendChild(option);
      }
    }

    element.classList.remove('hidden');
    element.classList.remove('invisible');

    stopPageExecution();
    this.isManagerOpen = true;
  }

  close() {
    const element = this.element;

    element.classList.add('hidden');
    element.classList.add('invisible');

    resumePageExecution();
    this.isManagerOpen = false;
  }

  create() {
    let name = prompt('Enter name: ');
    if(name) this.createButtonPressedEvent.notify(name);
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
    const dictionaries = this.model.getAllDictionaries();
    const selector = this.selector;
    const element = this.element;

    selector.innerHTML = '';

    for(let name in dictionaries) {
      if (dictionaries.hasOwnProperty(name)) {
        let option = document.createElement('option');
        option.innerHTML = name;
        selector.appendChild(option);
      }
    }

    element.classList.remove('hidden');
    element.classList.remove('invisible');
  }
}
