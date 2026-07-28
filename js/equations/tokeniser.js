

function warner(...string){
	console.warn(string);
}

function logger(...string) {
	console.log(string[0], '\n', string[1]);
}

class Token {
	constructor(key, value) {
		this.key = key;
		this.value = value;
	}

}
// Generates a Token class member based on tests.

function TokenAssigner(input) {
  	const tokenKey =  Object.keys(ValidTokens).find(key => ValidTokens[key] === input);
	// tokenKey is either undefined, or the key of the token in ValidTokens.

	// If we're here more than once, check if we're in a string or number.
	if (input.length > 1) {
		if (isLetter(input.at(-1))) {
			return new Token(ValidTokens.STRING, input);
		}
		if (isDigit(input.at(-1))) {
			return new Token(ValidTokens.NUMBER, input);
		}
	}
	// At this point: candidate is not continuing a number or string.
	// From here, tests if candidate is a [valid syntax character, letter, digit]

	if (tokenKey in ValidTokens) {
		return new Token(tokenKey, input);
	}
	// NOT valid syntax character

	if (input.charCodeAt(0) >= 48 && input.charCodeAt(0) <= 57) {
		return new Token(ValidTokens.DIGIT, input);
	}
	// NOT a digit
	if (input.charCodeAt(0) >= 65 && input.charCodeAt(0) <= 90  || 
		input.charCodeAt(0) >= 97 && input.charCodeAt(0) <= 122) {

		return new Token(ValidTokens.LETTER, input);
	}
	// NOT a letter

	// And thus, undefined -> invalid.
	if (tokenKey == undefined) 	{
		return new Token(ValidTokens.INVALID, input)
	};


}

function isDigit (char) {
	if (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) {
		return true;
	} else {
		return false;
	}
}

function isLetter (char) {
	if (char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90  || 
		char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122) {
		return true;
	} else {
		return false;
	}
}

// The start of the operation. Sequentially assigns tokens to each character, while batching letters/digits to strings/numbers.
function TokeniseInput(inputEquation) {

	let tokenArray = [];
	let lastType = "";
	let currentStringOrNumber = "";
	for (let i = 0; i < inputEquation.length; i++) {
		
		// enter loop, get tokenized character
		let currentToken = TokenAssigner(inputEquation[i]);

		// self explanatory
		if (currentToken.key == ValidTokens.INVALID) {
			warner("Invalid character found: " + currentToken.value);
		}
		
		switch (currentToken.key) {

			case ValidTokens.DIGIT:
				if (currentToken.key != lastType) {
					if (currentStringOrNumber != "") {
						tokenArray.push(TokenAssigner(currentStringOrNumber));
					}
					lastType = ValidTokens.DIGIT;
					currentStringOrNumber = currentToken.value;
				} else {
					currentStringOrNumber += currentToken.value;
				}
			break;

			case ValidTokens.LETTER:
				if (currentToken.key != lastType) {
					if (currentStringOrNumber != "") {
						tokenArray.push(TokenAssigner(currentStringOrNumber));
					}
					lastType = ValidTokens.LETTER;
					currentStringOrNumber = currentToken.value;
				} else {
					currentStringOrNumber += currentToken.value;
				}
			break;

			default:
				if (currentStringOrNumber != "") {
					tokenArray.push(TokenAssigner(currentStringOrNumber));
				}
				lastType = "";
				currentStringOrNumber = "";
				tokenArray.push(TokenAssigner(inputEquation[i]));
				
		}
		
	}

	if (currentStringOrNumber != "") {
		tokenArray.push(TokenAssigner(currentStringOrNumber));
	}

	logger("Tokenised Input: ", tokenArray);
	return tokenArray;
}


function TokeniseEquation(inputEquation) {
	let tokenisedInput = TokeniseInput(inputEquation);
	let parsedInput = parseTokens(tokenisedInput);
	logger(tokenisedInput);
}

