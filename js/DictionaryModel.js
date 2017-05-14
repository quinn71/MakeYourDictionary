function  post(word, translation) {
  const xhr = new XMLHttpRequest();
  const url = './back/httpHandle.cgi';
  xhr.open('POST', url, true);
  let params = 'word=' + word + '&translation' + translation;

  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      alert(xhr.responseText);
    }
  }

  xhr.send(params);
}

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
  }

  addWord(dictionaryName, word, translation) {
    let dictionary = this.getDictionary(dictionaryName);

    dictionary.set(word, translation);
    this._dictionaries[dictionaryName] = dictionary;
    this.updateStorage();
    this.newWordAddedEvent.notify(dictionaryName);
  }

  clear(dictionaryName) {
    let confirmed = confirm("Are you sure?");
    if (confirmed) {
      let dictionary = this.getDictionary(dictionaryName);
      dictionary.clear();
      this._dictionaries[dictionaryName] = dictionary;
      this.updateStorage();
      this.dictionaryClearedEvent.notify(dictionaryName);
    }
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

  getFromServer() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'Dictionaries_test.json', false);
    xhr.send();

    if (xhr.status != 200) {
      alert( xhr.status + ': ' + xhr.statusText );
    } else {
      alert( xhr.responseText );
    }
  }


}
