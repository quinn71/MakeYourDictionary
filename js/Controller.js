class DictionaryController {

  constructor(model, ...views) {
    this._model = model;
    this._wordlistViews = {};

    for (let view of views) {
      if (view instanceof WordListView) {
        const name = view.getName();
        this._wordlistViews[name] = view;


      }



      if (view instanceof WordManagerView) {
        this._wordManagerView = view;

        this._wordManagerView.addWordRequestEvent.attach((dictionaryName, word, translation) => {
          this._model.addWord(dictionaryName, word, translation);
        });

        this._wordManagerView.createButtonPressedEvent.attach((name) => {
          this._model.createDictionary(name);
          this._wordManagerView.refresh();
        });
      }

      // if (view instanceof WordTrainerView) {
      //   this._wordTrainerView = view;
      //
      //   this._model.wordRemovedEvent.attach((removedWord) => {
      //     let wordInField = this._wordTrainerView._wordField.innerHTML;
      //     let wordInFieldTranslation = this._wordTrainerView._dictionary.getKey(wordInField);
      //     if (removedWord === wordInField || removedWord === wordInFieldTranslation) {
      //       this._wordTrainerView.nextWord();
      //     }
      //   });
      //
      //   this._model.newWordAddedEvent.attach(() => {
      //     this._wordTrainerView.updateDictionary();
      //     if (this._wordTrainerView._dictionary.size === 1) {
      //       this._wordTrainerView.nextWord();
      //     }
      //   });
      //
      //   this._model.dictionaryClearedEvent.attach(() => {
      //     this._wordTrainerView.nextWord()
      //   });
      // }
    }

    window.onstorage = () => {
      for(let name in this._wordlistViews) {
        this._wordlistViews[name].refresh();
      }
    };

    if(!this._wordlistViews.isEmpty()) {
      this._model.newWordAddedEvent.attach((dictionaryName) => {
        this._wordlistViews[dictionaryName].refresh();
      });

      this._model.wordRemovedEvent.attach((dictionaryName) => {
        this._wordlistViews[dictionaryName].refresh();
      });

      this._model.dictionaryClearedEvent.attach((dictionaryName) => {
        this._wordlistViews[dictionaryName].refresh();
      });

      Object.keys(this._wordlistViews).forEach(view => {
        this._wordlistViews[view].removeIconPressedEvent.attach((dictionaryName, word) => {
          this._model.removeWord(dictionaryName, word);
        });
      });
    }
  }
}
