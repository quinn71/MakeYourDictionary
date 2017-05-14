class WordTrainerView {

  constructor(model) {
    this._model = model;
    this._dictionaries = this._model.getAllDictionaries();

    this._element = document.querySelector('.word-trainer');
    this.selector = this._element.querySelector('#trainer-select');

    const openButton = document.querySelector('.open-trainer-button');
    const closeButton = this._element.querySelector('.close-icon');

    openButton.onclick = this.open.bind(this);
    closeButton.onclick = this.close.bind(this);

    this._wordField = document.querySelector('.word-trainer .word');
    this._translationButton = document.querySelector('.show-translation-button');
    this._nextButton = document.querySelector('.next-word-button');

    this._nextButton.addEventListener('click', () => {
      this.nextWord()
    });
    this._translationButton.addEventListener('click', () => {
      this.showTranslation()
    });


  }

  showTranslation() {
    // this.updateDictionary();
    let word = this._wordField.innerHTML;
    const selector = this.selector;
    const selectedField = selector.options[selector.selectedIndex];;
    const dictionaryName = selectedField.value;
    const dictionary = this._dictionaries[dictionaryName];

    let translation = dictionary.get(word) || dictionary.getKey(word);

    alert(translation);
  }

  nextWord() {
    this._model.updateModelData();

    const selector = this.selector;
    const selectedField = selector.options[selector.selectedIndex];
    const dictionaryName = selectedField.value;
    const dictionary = this._dictionaries[dictionaryName] || {};

    if (dictionary.isEmpty()) {
      this._wordField.innerHTML = 'you have no words to remember!';
      this._wordField.innerHTML += '<br><span class="helper">(Add new words to your dictionary using word manager)</span>';
    } else {
      let entry = dictionary.getRandomEntry();
      let wordLanguageIndex = Math.round(Math.random());
      let word = entry[wordLanguageIndex];

      this._wordField.innerHTML = word;
    }
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

    this.nextWord();
  }

  close() {
    this._element.classList.add('hidden');
    this._element.classList.add('invisible');
  }
}