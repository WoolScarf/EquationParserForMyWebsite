class Token {
	constructor(type, value) {
		this.type = type;
		this.value = value;
	}

}

function TokenAssigner(input) {
	// State: Looking for token against TokenType
  	const tokenKey =  Object.keys(ValidTokens).find(key => ValidTokens[key] === input);
	const tokenValue = ValidTokens[tokenKey];

	if (input.length > 1) {
		if (isLetter(input.at(-1))) {
			return new Token(ValidTokens.STRING, input);
		}
		if (isDigit(input.at(-1))) {
			return new Token(ValidTokens.NUMBER, input);
		}
	}
	
	if(tokenKey !== undefined) {
	// At this point: the character is a syntax character
	// State: found token - syntax
		return new Token(tokenKey, input);
	}

	if (input.charCodeAt(0) >= 48 && input.charCodeAt(0) <= 57) {
	// At this point: the character is a digit
	// State: found token - digit
		return new Token(ValidTokens.DIGIT, input);
	}

	if (
		input.charCodeAt(0) >= 65 && input.charCodeAt(0) <= 90  || 
		input.charCodeAt(0) >= 97 && input.charCodeAt(0) <= 122) {
	// At this point: the character is a letter
	// State: found token - letter
		return new Token(ValidTokens.LETTER, input);
	}

	return new Token(ValidTokens.NONE, input);
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

function lastCharOfString(string) {
		return string.at(-1);
}


function TokeniseInput(inputEquation) {
	let tokenArray = [];
	let lastType = "";
	let currentStringOrNumber = "";
	for (let i = 0; i < inputEquation.length; i++) {
		// enter loop, get tokenized character

		let currentToken = TokenAssigner(inputEquation[i]);

		switch (currentToken.type) {

			case ValidTokens.DIGIT:
				if (currentToken.type != lastType) {
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
				if (currentToken.type != lastType) {
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

	return tokenArray;
}


function TokeniseEquation(inputEquation) {
	let tokenisedInput = TokeniseInput(inputEquation);
	let parsedInput = parseTokens(tokenisedInput);
	console.log (tokenisedInput);
}

