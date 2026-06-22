//let inputEquation = "3x^2 + 2x - 5 = 0";

class Token {
	constructor(type, value) {
		this.type = type;
		this.value = value;
	}

	/*
	constructor(type, typeLiteral, value) {
		this.type = type;
		this.typeLiteral = typeLiteral;
		this.value = value;
	}
	*/
}

const TokenType = Object.freeze({
	// Math Syntax
	PLUS: '+',
	MINUS: '-',
	STAR: '*',
	SLASH: '/',
	CARET: '^',
	EQUALS: '=',
	LPAREN: '(',
	RPAREN: ')',
	LBRACKET: '[',
	RBRACKET: ']',
	LBRACE: '{',
	RBRACE: '}',
	COMMA: ',',
	SPACE: " ",

	// Literals
	DIGIT: 'DIGIT',
	LETTER: 'LETTER',


	NUMBER: 'NUMBER',
	STRING: 'STRING',


	NONE: 'NONE'
})


function TokenAssigner(input) {
	// State: Looking for token against TokenType
  	const tokenKey =  Object.keys(TokenType).find(key => TokenType[key] === input);

	if (input.length > 1) {
		if (isLetter(input.at(-1))) {
			return new Token("STRING", input);
		}
		if (isDigit(input.at(-1))) {
			return new Token("NUMBER", input);
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
		return new Token("DIGIT", input);
	}

	if (
		input.charCodeAt(0) >= 65 && input.charCodeAt(0) <= 90  || 
		input.charCodeAt(0) >= 97 && input.charCodeAt(0) <= 122) {
	// At this point: the character is a letter
	// State: found token - letter
		return new Token("LETTER", input);
	}

	return new Token("NONE", input);
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


function TokenizeInput(inputEquation) {
	let tokenArray = [];
	let lastType = "";
	let currentStringOrNumber = "";

	for (let i = 0; i < inputEquation.length; i++) {
		// enter loop, get tokenized character
		let currentToken = TokenAssigner(inputEquation[i]);

		switch (currentToken.type) {

			case TokenType.DIGIT:
				if (currentToken.type != lastType) {
					if (currentStringOrNumber != "") {
						tokenArray.push(TokenAssigner(currentStringOrNumber));
					}
					lastType = TokenType.DIGIT;
					currentStringOrNumber = currentToken.value;
				} else {
					currentStringOrNumber += currentToken.value;
				}
			break;

			case TokenType.LETTER:
				if (currentToken.type != lastType) {
					if (currentStringOrNumber != "") {
						tokenArray.push(TokenAssigner(currentStringOrNumber));
					}
					lastType = TokenType.LETTER;
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