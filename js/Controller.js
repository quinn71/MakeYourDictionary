class DictionaryController {

  constructor(model, ...views) {
    this.wordlistViews = {};
    this.model = model;

    this.addListenersToManagerEvents = this.addListenersToManagerEvents.bind(this);
    this.addListenersToWordlistEvents = this.addListenersToWordlistEvents.bind(this);
    this.setModelListeners = this.setModelListeners.bind(this);

    for (let view of views) {
      if (view instanceof WordListView) {
        const name = view.getName();
        this.addListenersToWordlistEvents(view);
        this.wordlistViews[name] = view;

      }

      if (view instanceof WordManagerView) {
        this.addListenersToManagerEvents(view);
        this.wordManagerView = view;
      }

      // if (view instanceof WordTrainerView) {
      //   this.wordTrainerView = view;
      //
      //   this.model.wordRemovedEvent.attach((removedWord) => {
      //     let wordInField = this.wordTrainerView.wordField.innerHTML;
      //     let wordInFieldTranslation = this.wordTrainerView.dictionary.getKey(wordInField);
      //     if (removedWord === wordInField || removedWord === wordInFieldTranslation) {
      //       this.wordTrainerView.nextWord();
      //     }
      //   });
      //
      //   this.model.newWordAddedEvent.attach(() => {
      //     this.wordTrainerView.updateDictionary();
      //     if (this.wordTrainerView.dictionary.size === 1) {
      //       this.wordTrainerView.nextWord();
      //     }
      //   });
      //
      //   this.model.dictionaryClearedEvent.attach(() => {
      //     this.wordTrainerView.nextWord()
      //   });
      // }
    }

    this.setModelListeners();

    window.onstorage = () => {
      for(let name in this.wordlistViews) {
        this.wordlistViews[name].refresh();
      }
    };
  }

  addListenersToWordlistEvents(wordlist) {
    const model = this.model;

    wordlist.removeIconPressedEvent.attach((dictionaryName, word) => {
      model.removeWord(dictionaryName, word);
    });

    wordlist.dictionaryClearButtonPressedEvent.attach((dictionaryName) => {
      let confirmed = window.confirm('Sure?');
      if(confirmed) {
        model.clear(dictionaryName);
      }
    });

    wordlist.dictionaryRemoveButtonPressedEvent.attach(dictionaryName => {
      let confirmed = window.confirm('Sure?');
      if(confirmed) {
        model.removeDictionary(dictionaryName);
      }
    });
  }

  addListenersToManagerEvents(manager) {
    const model = this.model;

    manager.addWordRequestEvent.attach((dictionaryName, word, translation) => {
      model.addWord(dictionaryName, word, translation);
    });

    manager.createButtonPressedEvent.attach((name) => {
      model.createDictionary(name);
      manager.refresh();

      const elem = manager.getElem();
      const select = elem.querySelector('#manager-select');
      select.value = name;
    });
  }

  setModelListeners() {
    const model = this.model;

    if(!this.wordlistViews.isEmpty()) {
      model.newWordAddedEvent.attach(dictionaryName => {
        const wordlist = this.wordlistViews[dictionaryName];
        wordlist.refresh();
      });

      model.wordRemovedEvent.attach(dictionaryName => {
        const wordlist = this.wordlistViews[dictionaryName];
        wordlist.refresh();
      });

      model.dictionaryClearedEvent.attach(dictionaryName => {
        const wordlist = this.wordlistViews[dictionaryName];

        wordlist.refresh();
      });

      model.dictionaryRemovedEvent.attach(dictionaryName => {
        const viewToRemove = this.wordlistViews[dictionaryName];
        const elementToRemoveFromDOM = viewToRemove.getElem();
        elementToRemoveFromDOM.parentNode.removeChild(elementToRemoveFromDOM);
        delete this.wordlistViews[dictionaryName];
      });
    }

    model.newDictionaryCreatedEvent.attach((name) => {


      const vocabulary = document.querySelector('.main-outer');

      if(vocabulary) {
        const wordlist = new WordListView(name, model);

        this.addListenersToWordlistEvents(wordlist);
        this.wordlistViews[name] = wordlist;
        const outer = document.createElement('div');
        outer.className = 'wordlist-outer';
        outer.appendChild(wordlist.getElem());
        vocabulary.appendChild(outer);

        model.newWordAddedEvent.attach(() => {
          wordlist.refresh();
        });

        model.wordRemovedEvent.attach(() => {
          wordlist.refresh();
        });

        model.dictionaryClearedEvent.attach(() => {
          wordlist.refresh();
        });
      }
    });


  }
}
