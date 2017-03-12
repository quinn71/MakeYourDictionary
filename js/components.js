class WordList {

    constructor (dictionary) {
        this.DOMElem = document.querySelector('.wordlist');
        this.dictionary = dictionary;

        if(!this.DOMElem) {
            this.render();
        }
    }

    getElem() {
        if(!this.DOMElem) {
            this.render();
        }

        return this.DOMElem;
    }

    render() {
        this.DOMElem = document.createElement('div');
        this.DOMElem.className = 'wordlist';
        this.renderList();

        let self = this;

        this.DOMElem.onclick = function DeleteItem(e) {
            let target = e.target;
            let fieldToRemove;
            let wordToRemove;


            if(target.classList.contains('close-icon')) {
                fieldToRemove = target.parentNode;
                wordToRemove = fieldToRemove.innerHTML.split(' - ')[0];
                dictionary.delete(wordToRemove);
                fieldToRemove.parentNode.removeChild(fieldToRemove);
                updateLocalStorage();
                self.refresh();

                let wordInLearnField = document.querySelector('.word-to-learn').innerHTML;
                if(wordToRemove == wordInLearnField) {
                    showNextWord();
                }
            }
        }
    }

    renderList() {
        this.dictionary.forEach((translation, word) => {
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
        this.dictionary = dictionary;
        this.DOMElem.innerHTML = '';
        this.renderList();
    }

}