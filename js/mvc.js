Map.prototype.isEmpty = function() {
    return !this.size;
};

let prevRandNum;
Map.prototype.getRandomEntry = function() {
    let randEntry;
    let randNum = prevRandNum;

    while (randNum === prevRandNum) {
        randNum = Math.round(Math.random() * (this.size - 1));
        if(this.size == 1) break; // exclude the case while we can't generate random number different from previous
    }
    prevRandNum = randNum;

    for(let entry of this.entries()) {
        if(randNum <= 0){
            randEntry = entry;
            break;
        }
        randNum--;
    }

    return randEntry || 'no words in your vocabulary yet';
};

Map.prototype.getKey = function(passedValue) {
    let keyToFind;

    this.forEach((value, key) => {
        if(value == passedValue) {
            keyToFind = key;
        }
    });

    return keyToFind;
};

class Event {
    constructor() {
        this._listeners = [];
    }

    notify(...params) {
        this._listeners.forEach((listener) => {
            listener(...params);
        });
    }

    attach(listener) {
        this._listeners.push(listener);
    }
}

class DictionaryModel {

    constructor() {
        this._dictionary = this.getDictionary();

        this.newWordAddedEvent = new Event();
        this.wordRemovedEvent = new Event();
        this.dictionaryClearedEvent = new Event();
    }

    getDictionary() {
        let dict;
        if(localStorage.dictionary) {
            dict = new Map(JSON.parse(localStorage.dictionary));
        }
        else dict = new Map();

        return dict;
    }

    add(word, translation) {
        this._dictionary.set(word, translation);
        this.updateLocalStorage();
        this.newWordAddedEvent.notify();
    }

    remove(word) {
        this._dictionary.delete(word);
        this.updateLocalStorage();
        this.wordRemovedEvent.notify(word);
    }

    clear() {
        let confirmed = confirm("Are you sure?");
        if(confirmed) {
            this._dictionary.clear();
            this.updateLocalStorage();
            this.dictionaryClearedEvent.notify();
        }
    }

    updateLocalStorage() {
        localStorage.dictionary = JSON.stringify([...this._dictionary]);
    }
}

class WordListView {

    constructor(model) {
        this._model = model;
        this._dictionary = model.getDictionary();
        this._DOMElem = document.querySelector('.wordlist');

        this.removeIconPressedEvent = new Event();

        if(!this._DOMElem) {
            this.render();
        }

        this.hideButton = document.querySelector('.hide-button');
        this.showButton = document.querySelector('.show-button');

        this.showButton.addEventListener('click', () => { this.show() });
        this.hideButton.addEventListener('click', () => { this.hide() });

        let manageSection = document.querySelector('.manage-dictionary');
        manageSection.appendChild(this._DOMElem);
    }

    updateDictionary() {
        this._dictionary = this._model.getDictionary();
    }

    render() {
        this._DOMElem = document.createElement('div');
        this._DOMElem.className = 'wordlist';
        this.renderList();
    }

    renderList() {
        let _this = this;
        this._dictionary.forEach(function(translation, word) {
            let list = _this._DOMElem;
            let field = document.createElement('div');
            field.className = 'field';
            let closeIcon = document.createElement('div');
            closeIcon.className = 'close-icon';
            closeIcon.addEventListener('click', (event) => {
                let word;
                let target = event.target;
                word = target.parentNode.innerHTML.split(' - ')[0];
                _this.removeIconPressedEvent.notify(word);
            });
            field.innerHTML = word + ' - ' + translation;
            field.appendChild(closeIcon);
            list.appendChild(field);
        });
    }

    refresh() {
        this._DOMElem.innerHTML = '';
        this.updateDictionary();
        this.renderList();
    }

    show() {

        this._DOMElem.classList.remove('invisible');

        this.showButton.classList.add('hidden');
        this.hideButton.classList.remove('hidden');
    }

    hide() {
        this._DOMElem.classList.add('invisible');

        this.hideButton.classList.add('hidden');
        this.showButton.classList.remove('hidden');
    }
}

class WordAdderView {
    constructor() {
        this.wordField = document.querySelector('input[name="word"]');
        this.translationField = document.querySelector('input[name="translation"]');

        this.addWordRequestEvent = new Event();
        this.clearButtonPressedEvent = new Event();

        const addButton = document.querySelector('.add-word-button');
        const clearButton = document.querySelector('.clear-button');

        addButton.addEventListener('click', () => { this.addWordRequestEvent.notify() });
        clearButton.addEventListener('click', () => { this.clearButtonPressedEvent.notify() });
        document.addEventListener('keydown', event => {
            if(event.keyCode == 13) {
                this.addWordRequestEvent.notify();
            }
        });
    }
}

class WordTrainerView {

    constructor(model) {
        this._model = model;
        this._dictionary = this._model.getDictionary();

        this._wordField = document.querySelector('.word-to-learn');
        this._translationButton = document.querySelector('.show-translation-button');
        this._nextButton = document.querySelector('.next-word-button');

        this._nextButton.addEventListener('click', () => { this.nextWord() });
        this._translationButton.addEventListener('click', () => { this.showTranslation() });

        this.nextWord();
    }

    updateDictionary() {
        this._dictionary = this._model.getDictionary();
    }

    showTranslation() {
        this.updateDictionary();
        let word = document.querySelector('.word-to-learn').innerHTML;

        let translation = this._dictionary.get(word) || this._dictionary.getKey(word);

        alert(translation);
    }

    nextWord() {
        this.updateDictionary();

        if(this._dictionary.isEmpty()) {
            this._wordField.innerHTML = 'you have no words to remember!';
            this._wordField.innerHTML += '<br><span class="helper">(Add new words to your dictionary using form on the left)</span>';
        }
        else {
            let entry = this._dictionary.getRandomEntry();
            let wordLanguageIndex = Math.round(Math.random());
            let word = entry[wordLanguageIndex];

            this._wordField.innerHTML = word;
        }
    }
}

class DictionaryController {

    constructor(model, ...views) {
        this._model = model;
        for (let view of views) {
            if (view instanceof WordListView) {
                this._wordlistView = view;

                this._model.newWordAddedEvent.attach( () => { this._wordlistView.refresh() });
                this._model.wordRemovedEvent.attach( () => {this._wordlistView.refresh() });
                this._model.dictionaryClearedEvent.attach( () => { this._wordlistView.refresh() });

                this._wordlistView.removeIconPressedEvent.attach((word) => {
                    this._model.remove(word);
                });
            }

            if (view instanceof WordAdderView) {
                this._wordAdderView = view;

                this._wordAdderView.addWordRequestEvent.attach(() => {

                    const wordField = this._wordAdderView.wordField;
                    const translationField = this._wordAdderView.translationField;

                    const word = wordField.value;
                    const translation = translationField.value;

                    this._model.add(word, translation);

                    wordField.value = '';
                    translationField.value = '';

                    wordField.focus();
                });

                this._wordAdderView.clearButtonPressedEvent.attach(() => { this._model.clear() });
            }

            if (view instanceof WordTrainerView) {
                this._wordTrainerView = view;

                this._model.wordRemovedEvent.attach((removedWord) => {
                    let wordInField = this._wordTrainerView._wordField.innerHTML;
                    let wordInFieldTranslation = this._wordTrainerView._dictionary.getKey(wordInField);
                    if (removedWord === wordInField || removedWord === wordInFieldTranslation) {
                        this._wordTrainerView.nextWord();
                    }
                });

                this._model.newWordAddedEvent.attach(() => {
                    this._wordTrainerView.updateDictionary();
                    if (this._wordTrainerView._dictionary.size === 1) {
                        this._wordTrainerView.nextWord();
                    }
                });

                this._model.dictionaryClearedEvent.attach(() => { this._wordTrainerView.nextWord() } );
            }
        }
    }
}