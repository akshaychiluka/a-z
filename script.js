let quote_text = document.getElementById('quote-text');
let input_area = document.getElementById('input-area');
let timer_text = document.getElementById('timer-value');
let error_text = document.getElementById('error-value');
let accuracy_text = document.getElementById('accuracy-value');
let wpm_text = document.getElementById('word_value');
let reset_button = document.getElementById('reset-button');

let quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    "In the end, we will remember not the words of our enemies, but the silence of our friends.",
    "Life is what happens when you're busy making other plans."
];

let current_quote = '';
let characterTyped = 0;
let total_errors = 0;
let timer;
let isTyping = false;
let timeLeft = 60;

function updateQuote() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    current_quote = quotes[randomIndex];
    quote_text.innerHTML = '';
    current_quote.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        quote_text.appendChild(span);
    });
}

function processCurrentText() {
    let curr_input = input_area.value;
    let curr_input_array = curr_input.split('');
    let quoteSpanArray = quote_text.querySelectorAll('span');
    characterTyped++;

    let errors = 0;
    quoteSpanArray.forEach((char, index) => {
        let typedChar = curr_input_array[index];
        if (typedChar == null) {
            // Reset styling for characters beyond current input
            char.classList.remove('correct_char');
            char.classList.remove('incorrect_char');
        } else if (typedChar === char.innerText) {
            // Correctly typed character
            char.classList.add('correct_char');
            char.classList.remove('incorrect_char');
        } else {
            // Incorrectly typed character
            char.classList.add('incorrect_char');
            char.classList.remove('correct_char');
            errors++;
        }
    });

    // Update stats
    error_text.textContent = total_errors + errors;
    let correctCharacters = characterTyped - (total_errors + errors);
    let accuracyVal = ((correctCharacters / characterTyped) * 100);
    accuracy_text.textContent = Math.round(accuracyVal);

    // Load new quote if completed
    if (curr_input.length === current_quote.length) {
        total_errors += errors;
        input_area.value = ""; // Clear input area
        updateQuote(); // Load a new quote
    }
}

function startTypingTest() {
    updateQuote();
    input_area.value = '';
    input_area.focus();
    characterTyped = 0;
    total_errors = 0;
    clearInterval(timer);
    timer_text.textContent = '60';
    isTyping = true;
    timeLeft = 60;

    timer = setInterval(() => {
        timeLeft--;
        timer_text.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            isTyping = false;
            input_area.disabled = true; // Disable input area
            displayResults();
        }
    }, 1000);
}

function displayResults() {
    let wordsTyped = characterTyped / 5; // Assuming average word length is 5 characters
    let wpm = Math.round((wordsTyped / (60 - timeLeft)) * 60); // Calculate WPM
    wpm_text.textContent = wpm; // Update WPM display
}

function resetTypingTest() {
    clearInterval(timer);
    isTyping = false;
    input_area.value = '';
    input_area.disabled = false;
    timer_text.textContent = '60';
    error_text.textContent = '0';
    accuracy_text.textContent = '0';
    wpm_text.textContent = '0';
    total_errors = 0;
    characterTyped = 0;
    timeLeft = 60;
    updateQuote();
}

input_area.addEventListener('input', () => {
    if (!isTyping) {
        startTypingTest();
    }
    processCurrentText();
});

reset_button.addEventListener('click', resetTypingTest);
