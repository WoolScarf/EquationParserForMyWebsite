// ValidTokens is not defined.... 
// ValidFunctions is not defined....
// Fucking shit fuck of a language needs to load both at the same time for two different files loading in different orders, so here it is

const ValidTokens = Object.freeze({
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


	INVALID: 'INVALID'
})


const ValidFunctions = Object.freeze({
	ADD: ValidTokens.PLUS,
	SUB: ValidTokens.MINUS,
	MULT: ValidTokens.STAR,
	DIV: ValidTokens.SLASH,
	POW: ValidTokens.CARET,

	SIN: "sin",
	COS: "cos",
	TAN: "tan",
	SEC: "sec",
	ATAN: "atan",
	ARCSIN: "arcsin",
	ARCCOS: "arccos",
});



