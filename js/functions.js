///test

function getDictionary() {
    let dictionary;
    if(localStorage.dictionary) {
        dictionary = new Map(JSON.parse(localStorage.dictionary));
    }
    else dictionary = new Map();

    return dictionary;
}

function addToDictionary(word, translation) {
    let dictionary = getDictionary();

    dictionary.set(word, translation);

    localStorage.dictionary = JSON.stringify([...dictionary]);
}

function addNewWord() {

    const word = wordField.value;
    const translation = translationField.value;

    addToDictionary(word, translation);
    showWordlist();

    wordField.value = '';
    translationField.value = '';

    wordField.focus();
}

class WordList {

    constructor (dictionary, DOMElem) {
        this.DOMElem = DOMElem;
        this.dictionary = dictionary;

        if(!this.DOMElem) {
            this.render();
        }
    }

    render() {
        this.DOMElem = document.createElement('div');
        this.DOMElem.className = 'wordlist';
        this.renderList();

        this.DOMElem.onclick = function DeleteItem(e) {
            console.log(e.target == '<img>');
            // if(e.target !== HTMLImageElement) return;
        }
    }

    renderList() {
        const dictionary = this.dictionary;

        dictionary.forEach((translation, word) => {
            let list = this.DOMElem;
            let field = document.createElement('div');
            field.className = 'field';
            let closeIcon = document.createElement('div');
            closeIcon.className = 'close-icon';
            field.innerHTML = word + ' - ' + translation;
            field.appendChild(closeIcon);
            list.appendChild(field);
        });
    }

    refresh() {
        this.DOMElem.innerHTML = '';
        this.renderList();
    }

}


function showWordlist() {
    let dictionary = getDictionary();
    let manageSection = document.querySelector('.manage-dictionary');
    let elem = document.querySelector('.wordlist');

    let wordlist = new WordList(dictionary, elem);

    if(!elem) {
        manageSection.appendChild(wordlist.DOMElem);
    }

    wordlist.refresh();

    //wordlist.classList.remove('invisible');

    //showButton.classList.add('hidden');
    //hideButton.classList.remove('hidden');
}

function hideWordlist() {
    let dictionaryField = document.querySelector('.wordlist');
    dictionaryField.classList.add('invisible');

    hideButton.classList.add('hidden');
    showButton.classList.remove('hidden');
}

function clearStorage() {
    let confirmed = confirm("Are you sure?");
    if(confirmed) delete localStorage.dictionary;

    showWordlist();
}

function showWordToRemember() {
    let dictionary = getDictionary();
    const wordField = document.querySelector('.word-to-learn');
    let word;
    if(!dictionary) {
        wordField.innerHTML = 'you have no words to remember!';
    }
    else {
        word = getRandomWord(dictionary);
    }

    wordField.innerHTML = word;
}

function showTranslation() {
    let dictionary = getDictionary();
    let word = document.querySelector('.word-to-learn').innerHTML;
    let translation = dictionary.get(word);

}

let prevRandNum;

function getRandomWord(dictionary) {
    let randWord;
    let randNum = prevRandNum;

    while(randNum === prevRandNum) {
        randNum = Math.round(Math.random() * dictionary.size-1);
    }


    prevRandNum = randNum;

    for(let word of dictionary.keys()) {
        if(randNum <= 0){
            randWord = word;
            break;
        }
        randNum--;
    }

    return randWord || 'no words in your vocabulary yet';
}
