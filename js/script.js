let dic = new DictionaryModel();
let wList = new WordListView(dic);
let wAdder = new WordAdderView();
let wTrainer = new WordTrainerView(dic);
let controller = new DictionaryController(dic, wList, wAdder, wTrainer);















































// //function animate() {
//     document.getElementsByTagName( "html" )[0].classList.remove( "loading" );
// }
//
// setTimeout(animate, 500);

// const saveWordButton = document.querySelector('.add-word-button');
// const showButton = document.querySelector('.show-button');
// const hideButton = document.querySelector('.hide-button');
// const nextButton = document.querySelector('.next-word-button');
// const translationButton = document.querySelector('.show-translation-button');
// const clearButton = document.querySelector('.clear-button');
// const wordField = document.querySelector('input[name="word"]');
// const translationField = document.querySelector('input[name="translation"]');
//
// saveWordButton.addEventListener('click', addWord);
//
// window.addEventListener('keydown', function (e) {
//     if(e.keyCode !== 13) return;
//     addWord();
// });
//
// showButton.addEventListener('click', showWordlist);
// hideButton.addEventListener('click', hideWordlist);
// clearButton.addEventListener('click', clearStorage);
// nextButton.addEventListener('click', showNextWord);
// translationButton.addEventListener('click', showTranslation);
// translationButton.addEventListener('click', showTranslation);
//
// showWordlist();
// showNextWord();

