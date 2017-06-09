class WordTrainerView {

  constructor(model) {
    const element = document.querySelector('.word-trainer');
    const selector = element.querySelector('#trainer-select');
    const openButton = document.querySelector('.open-trainer-button');
    const closeButton = element.querySelector('.close-icon');
    const wordField = document.querySelector('.word-trainer .word');
    const translationButton = document.querySelector('.show-translation-button');
    const nextButton = document.querySelector('.next-word-button');
    const openLink = document.querySelector('.train-link');

    if(openButton) openButton.onclick = this.open.bind(this);
    openLink.onclick = this.open.bind(this);
    closeButton.onclick = this.close.bind(this);
    nextButton.onclick = this.nextWord.bind(this);
    translationButton.onclick = this.showTranslation.bind(this);
    selector.onchange = this.nextWord.bind(this);
    document.addEventListener('keydown', event => {
      if(this.isTrainerOpen) {
        switch(event.keyCode) {
          case 27: this.close();break;
          case 13: this.nextWord();break;
        }
      }
    });

    this.model = model;
    this.dictionaries = model.getAllDictionaries();

    this.element = element;
    this.selector = selector;
    this.wordField = wordField;
    this.nextButton = nextButton;
    this.translationButton = translationButton;

    this.buttonsBlocked = false; // state
    this.isTrainerOpen = false;
  }

  showTranslation() {
    const word = this.wordField.innerHTML;
    const selector = this.selector;
    const selectedField = selector.options[selector.selectedIndex];;
    const dictionaryName = selectedField.value;
    const dictionary = this.dictionaries[dictionaryName];

    let translation = dictionary.get(word) || dictionary.getKey(word);

    alert(translation);
  }

  nextWord() {
    this.model.updateModelData();
    this.dictionaries = this.model.getAllDictionaries();

    const selector = this.selector;
    const selectedField = selector.options[selector.selectedIndex];
    const dictionaryName = selectedField.value;
    const dictionary = this.dictionaries[dictionaryName] || {};
    const wordField = this.wordField;

    if (dictionary.isEmpty()) {
      wordField.innerHTML = 'you have no words to remember!';
      wordField.innerHTML += '<br><span class="helper">(Add new words to your dictionary using word manager)</span>';
      if(!this.buttonsBlocked){
        this.blockButtons();
      }
    } else {
      let entry = dictionary.getRandomEntry();
      let wordLanguageIndex = Math.round(Math.random());
      let word = entry[wordLanguageIndex];

      wordField.innerHTML = word;

      if(this.buttonsBlocked) {
        this.unblockButtons();
      }
    }
  }

  open() {
    const dictionaries = this.model.getAllDictionaries();
    this.selector.innerHTML = '';

    for(let name in dictionaries) {
      if (dictionaries.hasOwnProperty(name)) {
        let option = document.createElement('option');
        option.innerHTML = name;
        this.selector.appendChild(option);
      }
    }

    this.element.classList.remove('hidden');
    this.element.classList.remove('invisible');

    stopPageExecution();

    this.nextWord();
    this.isTrainerOpen = true;
  }

  close() {
    this.element.classList.add('hidden');
    this.element.classList.add('invisible');

    resumePageExecution();
    this.isTrainerOpen = false;
  }

  blockButtons() {
    const nextButton = this.nextButton;
    const translationButton = this.translationButton;

    nextButton.classList.add('blocked');
    nextButton.onclick = null;

    translationButton.classList.add('blocked');
    translationButton.onclick = null;

    this.buttonsBlocked = true;
  }

  unblockButtons() {
    const nextButton = this.nextButton;
    const translationButton = this.translationButton;

    nextButton.classList.remove('blocked');
    nextButton.onclick = this.nextWord.bind(this);

    translationButton.classList.remove('blocked');
    translationButton.onclick = this.showTranslation.bind(this);

    this.buttonsBlocked = false;
  }
}