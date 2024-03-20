document.addEventListener("DOMContentLoaded", () => {

    createSquares();
    newWord();

    
    //declare variables
    let guessedWords = [[]];
    let availableSpace = 1;
    let word;
    let currentLetters = [];
    let guessedWordCount = 0;
    let wordGuessed = false;

    

    const keys = document.querySelectorAll(".keyboard-row button")
    
    //using api to get word
    async function newWord() {
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
            {
                method: "GET",
                headers: {
                    'X-RapidAPI-Key': '32278636b5mshc6c931a7be9fdd5p1783e9jsnb29f2e7a1e9f',
		            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
                },
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                word = res.word;
                console.log(word);
            })
            .catch((err) => {
                console.error(err);
            })
    }


    document.getElementById("newGame").addEventListener("click", newStart);

    //game start function
    function newStart (){
        resetBoard();
        resetKeyboard();
        newWord();
        handleDeleteLetter();
        availableSpace = 1;
        enableKeys();
        guessedWordCount = 0;
        
    }

    //enabling the keyboard keys so user can use it 
    function enableKeys() {
        keys.forEach(key => {
            key.disabled = false;
        });
    }

    //reset the whole board when new game button is selected
    function resetBoard() {
        const gameBoard = document.getElementById("board");
        gameBoard.innerHTML = ""; 
        createSquares(); 
    }

    //reset the keyboard of the game that has colors when new game
    function resetKeyboard() {
        keys.forEach(key => {
            key.style.backgroundColor = ""; 
            key.disabled = false; 
        });

    }
    
    document.getElementById("debugMode").addEventListener("click", displayText);

    function displayText() {
        window.alert(word);
      }

    //get the current word
    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length
        return guessedWords[numberOfGuessedWords - 1]

    }

    //update the word guess
    function updateGuessWord(letter) {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr && currentWordArr.length <5){
            currentWordArr.push(letter)

            const letterIndex = currentWordArr.length - 1;
            const letterId = (guessedWordCount * 5) + letterIndex + 1; // Calculate the ID based on word count and letter index

            const availableSpaceEl = document.getElementById(String(letterId));
            availableSpaceEl.textContent = letter;

            currentLetters.push(letter); 
            const keyElement = document.querySelector(`button[data-key="${letter}"]`);
            keyElement.style.backgroundColor = "red";

            /* const availableSpaceEl = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1

            availableSpaceEl.textContent = letter;

            currentLetters.push(letter); */
/* 
            const keyElement = document.querySelector(`button[data-key="${letter}"]`);
            keyElement.style.backgroundColor = "red";
            keyElement.disabled = true;  */
        }
    }

    //title color changing
    function getTileColor(letter, index){
        const isCorrectLetter = word.includes(letter)

        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index)
        const isCorrectPosition = letter === letterInThatPosition

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }
    
    //submitted word logic for alerts
    function handleSubmitWord(){
        if (wordGuessed) {
            return;
        }
        const currentWordArr = getCurrentWordArr()
        if (currentWordArr.length !==5) {
            window.alert("Word must be at least 5 characters")
            return;
        }

        const currentWord = currentWordArr.join("");
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/${currentWord}`,
            {
                method: "GET",
                headers: {
                    'X-RapidAPI-Key': '32278636b5mshc6c931a7be9fdd5p1783e9jsnb29f2e7a1e9f',
		            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
                },
            }
        ).then ((res) => {
            if (!res.ok) {
                throw Error()
            }

            const firstLetterId = guessedWordCount * 5 + 1;
            const interval = 200;
    
            currentWordArr.forEach((letter, index) => {
                setTimeout(() => {
                const titleColor = getTileColor(letter, index);
    
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color: ${titleColor};border-color:${titleColor}`;
                
    
                }, interval * index);
            });
    
            guessedWordCount +=1;
    
            if (currentWord === word) {
                window.alert("Congrats you got it");
                wordGuessed = true;
                markWordRed(currentLetters);
                disableKeys();
            }
    
            if (guessedWordCount === 6 && !wordGuessed){
                window.alert('You lost! Word is ' + word)
            }
            guessedWords.push([]);
            wordGuessed = false;


        }).catch(() => {
            window.alert("Word is not recongnised")
        })
        

    }
    
    //creating all the squares in the start of the game
    function createSquares(){
        const gameBoard = document.getElementById("board")

        for (let i = 0; i < 30; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate_animated");
            square.setAttribute("id", i+1);
            gameBoard.appendChild(square);

        }
    }

    //delete button implementation
    function handleDeleteLetter() {
        if (wordGuessed) {
            return;
        }
    
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length === 0) {
            return; // If there are no letters entered, exit the function
        }
    
        const removeLetter = currentWordArr.pop();
    
        guessedWords[guessedWords.length - 1] = currentWordArr;
    
        const letterIndex = currentWordArr.length;
        const letterId = (guessedWordCount * 5) + letterIndex + 1; // Calculate the ID based on word count and letter index
    
        const lastLetterEl = document.getElementById(letterId);
        lastLetterEl.textContent = '';
        availableSpace = letterId;
    
        const keyElement = document.querySelector(`button[data-key="${removeLetter}"]`);
        keyElement.style.backgroundColor = "";
        keyElement.disabled = false;
    }

    
    /* function handleDeleteLetter(){
        if (wordGuessed) {
            return; 
        }
        const currentWordArr = getCurrentWordArr();
        const removeLetter = currentWordArr.pop();

        guessedWords[guessedWords.length-1] = currentWordArr

        const lastLetterEl = document.getElementById(String(availableSpace-1))

        lastLetterEl.textContent = '';
        availableSpace = currentWordArr.length + 1;

        const keyElement = document.querySelector(`button[data-key="${removeLetter}"]`);
        keyElement.style.backgroundColor = ""; 
        keyElement.disabled = false;

    }
 */
    function markWordRed(letters) {
        letters.forEach(letter => {
            const keyElement = document.querySelector(`button[data-key="${letter}"]`);
            keyElement.style.backgroundColor = "red";
        });
    }

    function disableKeys() {
        keys.forEach(key => {
            key.disabled = true;
        });
    }


    for (let j = 0; j < keys.length; j++) {
        keys[j].onclick = ({target}) => {
            const letter = target.getAttribute("data-key");

            if (letter === 'enter'){
                handleSubmitWord()
                return;
            }

            if (letter === 'del'){
                handleDeleteLetter()
                return;
            }


            updateGuessWord(letter);
        }
    }




});