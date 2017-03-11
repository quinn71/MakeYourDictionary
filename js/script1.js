const saveWordButton = document.querySelector('.add-word-button');
const showButton = document.querySelector('.show-button');
const hideButton = document.querySelector('.hide-button');
const nextButton = document.querySelector('.next-word-button');
const translationButton = document.querySelector('.show-translation-button');
const clearButton = document.querySelector('.clear-button');
const wordField = document.querySelector('input[name="word"]');
const translationField = document.querySelector('input[name="translation"]');

saveWordButton.addEventListener('click', addNewWord);
window.addEventListener('keydown', function (e) {
    if(e.keyCode !== 13) return;
    addNewWord();
});
showButton.addEventListener('click', showWordlist);
hideButton.addEventListener('click', hideWordlist);
clearButton.addEventListener('click', clearStorage);
nextButton.addEventListener('click', showWordToRemember);
translationButton.addEventListener('click', showTranslation);
translationButton.addEventListener('click', showTranslation);

showWordlist();

showWordToRemember();

