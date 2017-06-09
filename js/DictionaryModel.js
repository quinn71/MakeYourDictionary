class DictionaryModel {

  constructor() {
    if (localStorage.dictionaries) {
      this.updateModelData();
    }

    else this._dictionaries = {};

    this.newWordAddedEvent = new Event();
    this.wordRemovedEvent = new Event();
    this.dictionaryClearedEvent = new Event();
    this.newDictionaryCreatedEvent = new Event();
    this.dictionaryUpdatedEvent = new Event();
    this.dictionaryRemovedEvent = new Event();

    this.addWord = this.addWord.bind(this);
    this.createDictionary = this.createDictionary.bind(this);
  }

  addWord(dictionaryName, word, translation) {
    let dictionary = this.getDictionary(dictionaryName);

    dictionary.set(word, translation);
    this._dictionaries[dictionaryName] = dictionary;
    this.updateStorage();
    this.newWordAddedEvent.notify(dictionaryName);
  }

  clear(dictionaryName) {
    let dictionary = this.getDictionary(dictionaryName);
    dictionary.clear();
    this._dictionaries[dictionaryName] = dictionary;
    this.updateStorage();
    this.dictionaryClearedEvent.notify(dictionaryName);
  }

  createDictionary(dictionaryName) {
    this._dictionaries[dictionaryName] = new Map();
    this.updateStorage();
    this.newDictionaryCreatedEvent.notify(dictionaryName);
  }

  getAllDictionaries() {
    this.updateModelData();
    let dictionaries = {};
    for (let name in this._dictionaries) {
      if (this._dictionaries.hasOwnProperty(name)) {
        let dictionary = this.getDictionary(name);
        dictionaries[name] = dictionary;
      }
    }
    return dictionaries;
  }

  getDictionary(name) {
    if (!this._dictionaries[name]) throw new Error('No such dictionary in storage');
    if (this._dictionaries[name].isEmpty())
      return new Map();
    let dictionary = [...this._dictionaries[name]];
    return new Map(dictionary);
  }

  loadDefaultDictionaries() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './storage/defaultDictionaries.json');

    const _this = this;
    xhr.addEventListener("readystatechange",  function() {
      if(xhr.readyState == 4) {
        const dictionaries = JSON.parse(xhr.responseText);
        for(let dictionaryName in dictionaries) {
          if(dictionaries.hasOwnProperty(dictionaryName))
          {
            _this.createDictionary(dictionaryName);
            let dictionary = dictionaries[dictionaryName];
            dictionary.forEach(entry => {
              let word = entry[0];
              let translation = entry[1];

              _this.addWord(dictionaryName, word, translation);
            })
          }
        }

      }
    });
    xhr.send();

  }

  removeWord(dictionaryName, word) {
    let dictionary = this.getDictionary(dictionaryName);

    dictionary.delete(word);
    this._dictionaries[dictionaryName] = dictionary;
    this.updateStorage();
    this.wordRemovedEvent.notify(dictionaryName, word);
  }

  removeDictionary(dictionaryName) {
    delete this._dictionaries[dictionaryName];
    this.updateStorage();
    this.dictionaryRemovedEvent.notify(dictionaryName);
  }

  updateDictionary(dictionaryName, dictionary) {
    this._dictionaries[dictionaryName] = dictionary;
    this.updateStorage();
    this.dictionaryUpdatedEvent.notify(dictionaryName);
  }

  updateModelData() {
    let dictionaries;
    if (localStorage.dictionaries) {
      dictionaries = JSON.parse(localStorage.dictionaries);
    }
    else dictionaries = {};

    this._dictionaries = dictionaries;
  }

  updateStorage() {
    let dictionaries = this._dictionaries;

    for (let dictionaryName in dictionaries) {
      if (dictionaries.hasOwnProperty(dictionaryName)) {
        let dictionary = dictionaries[dictionaryName];
        dictionary = Array.from(dictionary);
        dictionaries[dictionaryName] = dictionary;
      }
    }

    localStorage.dictionaries = JSON.stringify(dictionaries);
  }
}

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
