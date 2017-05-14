function LS() {
  let dictionaries = {};

  let dictA = new Map([['wordA1', 'trA2'], ['wordA2', 'trA2'], ['wordA3', 'trA3']]);

  let dictB = new Map([['wordB1', 'trAB'], ['wordB2', 'trB2'], ['wordB3', 'trB3']]);
  let dictC = new Map([['wordC1', 'trC2'], ['wordA2', 'trC2'], ['wordA3', 'trC3']]);
  let dictD = new Map([['wordD1', 'trD2'], ['wordA2', 'trD2'], ['wordA3', 'trD3']]);

  dictionaries.A = [...dictA];
  dictionaries.B = [...dictB];
  dictionaries.C = [...dictC];
  dictionaries.D = [...dictD];


  localStorage.dictionaries = JSON.stringify(dictionaries);
}


const dictionaryModel = new DictionaryModel();
const allExistingDictionaries = dictionaryModel.getAllDictionaries();
const wordlistViews = [];

for (let dictionaryName in allExistingDictionaries) {
  if (allExistingDictionaries.hasOwnProperty(dictionaryName)) {
    const wordlist = new WordListView(dictionaryName, dictionaryModel);
    wordlistViews.push(wordlist);
    const vocabulary = document.querySelector('.full-vocabulary');
    const outer = document.createElement('div');
    outer.className = 'wordlist-outer';
    outer.appendChild(wordlist.getElem());
    vocabulary.appendChild(outer);
  }
}

const controller = new DictionaryController(dictionaryModel, ...wordlistViews);
