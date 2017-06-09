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
const wordManagerView = new WordManagerView(dictionaryModel);
const wordTrainerView = new WordTrainerView(dictionaryModel);
const controller = new DictionaryController(dictionaryModel, wordManagerView);
