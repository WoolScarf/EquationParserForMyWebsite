
class expression{
	constructor(id, type, value) {
		this.id = id;
		this.type = type;
		this.value = value;
	}
}


// Planned:
// 1-> figure out when an expression starts and ends.
// 2-> find a way to make this recursive, for nested expressions.
// I can already see issues with multiple different groups of the same depth. maybe assign UIDs to each?
function groupExpressions(parsedEquation, tokenArray) {
	groupingMarkerPairing(tokenArray)
}

// Used for figuring out the "inverse" or a marker 
function matchComplement (groupingMarker) {
	switch (groupingMarker) {
		case ValidTokens.LPAREN:
			return ValidTokens.RPAREN;
		case ValidTokens.RPAREN:
			return ValidTokens.LPAREN;
		case ValidTokens.LBRACKET:
			return ValidTokens.RBRACKET;
		case ValidTokens.RBRACKET:
			return ValidTokens.LBRACKET;
		case ValidTokens.LBRACE:
			return ValidTokens.RBRACE;
		case ValidTokens.RBRACE:
			return ValidTokens.LBRACE;
	}
}

function groupingMarkerPairing(tokenArray) {
	let groupingMarkersCollection = [];
	let depth = 0;

	// Loop through tokenArray, remember indexes and nesting depths of groupingMarkers in groupingMarkersCollection
	for (let i = 0; i < tokenArray.length; i++) {	
		switch (tokenArray[i].value) {
			case ValidTokens.LPAREN:
				groupingMarkersCollection.push({index: i, character: ValidTokens.LPAREN,   depth: depth++});
				break;
			case ValidTokens.RPAREN:
				groupingMarkersCollection.push({index: i, character: ValidTokens.RPAREN ,  depth: --depth});
				break;
			case ValidTokens.LBRACKET:
				groupingMarkersCollection.push({index: i, character: ValidTokens.LBRACKET, depth: depth++});
				break;
			case ValidTokens.RBRACKET:
				groupingMarkersCollection.push({index: i, character: ValidTokens.RBRACKET, depth: --depth});
				break;
			case ValidTokens.LBRACE:
				groupingMarkersCollection.push({index: i, character: ValidTokens.LBRACE,   depth: depth++});
				break;
			case ValidTokens.RBRACE:
				groupingMarkersCollection.push({index: i, character: ValidTokens.RBRACE,   depth: --depth});
				break;
			default:
				break;
		}
	}


	// MISTAKE:  		Using Throw new Error("")
	// LESSON LEARNED:  This stops code execution.
	// Using Warn() still prints a distinct message, without doing that.
	console.log("groupingMarkersCollection ",groupingMarkersCollection);
	if (depth != 0) {
		console.warn("Grouping marker count is not even");
	}

	// MISTAKE: 		 let tempMarkerCollection = groupingMarkersCollection; 
	// LESSON LEARNED:	 This creates a reference to the original object, so mutations to temp also apply to grouping.
	// To circumvent this I needed to create a "shallow copy", using Array.from(), or [...groupingMarkersCollection]
	// From https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy
	// I needed this to make the computation for length comparison.
	// I use splice(i, n) to "pop" array elements. It returns, and removes n array elements starting at index i, .

	let tempMarkerCollection = [...groupingMarkersCollection];
	let groupingMarkerPairs = [];
	for (let i = 0; i < tempMarkerCollection.length; i++) {
		for (let j = i + 1; j < tempMarkerCollection.length; j++) {
			if (tempMarkerCollection[i].depth == tempMarkerCollection[j].depth &&
				tempMarkerCollection[i].character == matchComplement(tempMarkerCollection[j].character)) {

				groupingMarkerPairs.push({open: tempMarkerCollection[i], close: tempMarkerCollection[j]});
				tempMarkerCollection.splice(j, 1);
				tempMarkerCollection.splice(i, 1);
				i--;
				break;
			}
		}
	}

	console.log("groupingMarkerPairs ",groupingMarkerPairs);
	debugger;
	if (groupingMarkerPairs.length != groupingMarkersCollection.length/2) {
		console.warn("Grouping marker pairing mismatch");
	}

	

}

function syntaxValidate(tokenArray) {
}

function parseTokens(tokenArray) {
	let parsedEquation = [];
	groupExpressions(parsedEquation, tokenArray);

}