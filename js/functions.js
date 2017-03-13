Map.prototype.isEmpty = function() {
  return !this.size;
};


let dictionary = getDictionary();

function getDictionary() {
    let dict;
    if(localStorage.dictionary) {
        dict = new Map(JSON.parse(localStorage.dictionary));
    }
    else dict = new Map();

    return dict;
}

function updateLocalStorage() {
    localStorage.dictionary = JSON.stringify([...dictionary]);
}

function addWord() {

    const word = wordField.value;
    const translation = translationField.value;

    dictionary.set(word, translation);
    updateLocalStorage();
    showWordlist();

    wordField.value = '';
    translationField.value = '';

    wordField.focus();

    if(dictionary.size == 1) {
        showNextWord();
    }
}

function showWordlist() {
    
    let manageSection = document.querySelector('.manage-dictionary');


    let wordlist = new WordList(dictionary);
    manageSection.appendChild(wordlist.getElem());
    wordlist.refresh();

    wordlist.getElem().classList.remove('invisible');

    showButton.classList.add('hidden');
    hideButton.classList.remove('hidden');
}

function hideWordlist() {
    let wordlist = document.querySelector('.wordlist');
    wordlist.classList.add('invisible');

    hideButton.classList.add('hidden');
    showButton.classList.remove('hidden');
}

function clearStorage() {
    let confirmed = confirm("Are you sure?");
    if(confirmed) {
        dictionary.clear();
        updateLocalStorage();
    }

    showWordlist();
    showNextWord();
}

function showNextWord() {
    const wordField = document.querySelector('.word-to-learn');
    let word;
    if(dictionary.isEmpty()) {
        wordField.innerHTML = 'you have no words to remember!';
    }
    else {
        word = getRandomWord(dictionary);
        wordField.innerHTML = word;
    }

}

function showTranslation() {
    let word = document.querySelector('.word-to-learn').innerHTML;
    let translation = dictionary.get(word);

    alert(translation);
}

let prevRandNum;
function getRandomWord(dictionary) {
    let randWord;
    let randNum = prevRandNum;



    while (randNum === prevRandNum) {
        randNum = Math.round(Math.random() * (dictionary.size - 1));
        if(dictionary.size == 1) break; // exclude the case while we can't generate random number different from previous
    }
    console.log('prev:' + prevRandNum + ', cur:' + randNum);
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
