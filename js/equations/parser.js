class Expression{
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

// Done: Parentheses, brackets, braces validation
// Needs: Parsing - expressions, validating functions, operands etc.
function groupExpressions(parsedEquation, tokenArray) {
	return groupingMarkerPairing(tokenArray)
}

// Used for figuring out the "inverse" or a marker 
function matchComplement (groupingMarker) {
	switch (groupingMarker) {
		case ValidTokens.RPAREN:
			return ValidTokens.LPAREN;
		case ValidTokens.RBRACKET:
			return ValidTokens.LBRACKET;
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
		
		if (depth < 0) {
			warner("Grouping markers in reverse order");
		}
	}


	// MISTAKE:  		Using Throw new Error("")
	// LESSON LEARNED:  This stops code execution.
	// Using Warn() still prints a distinct message, without doing that.
	logger("groupingMarkersCollection ",groupingMarkersCollection);
	if (depth != 0) {
		warner("Grouping marker count is not even");
	}

	// MISTAKE: 		 let tempMarkerCollection = groupingMarkersCollection; 
	// LESSON LEARNED:	 This creates a reference to the original object, so mutations to temp also apply to grouping.
	// To circumvent this I needed to create a "shallow copy", using Array.from(), or [...groupingMarkersCollection]
	// From https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy
	// I needed this to make the computation for length comparison.
	// I use splice(i, n) to "pop" array elements. It returns, and removes n array elements starting at index i, .

	let tempMarkerCollection = [...groupingMarkersCollection];
	let groupingMarkerPairs = [];
	debugger;
	for (let i = 0; i < tempMarkerCollection.length; i++) {
		for (let j = i + 1; j < tempMarkerCollection.length; j++) {
			if (tempMarkerCollection[i].depth == tempMarkerCollection[j].depth &&
				tempMarkerCollection[i].character == matchComplement(tempMarkerCollection[j].character)) {
				// makes a pair of matching markers, same depth. Since it finds the first match..... I can't think of edge cases XD
				groupingMarkerPairs.push({open: tempMarkerCollection[i], close: tempMarkerCollection[j]});
				tempMarkerCollection.splice(j, 1);
				tempMarkerCollection.splice(i, 1);
				// Deleted the object at position i so gotta go back one step.
				i--;
				break;
			}
		}
	}

	logger("groupingMarkerPairs ",groupingMarkerPairs);
	if (groupingMarkerPairs.length != groupingMarkersCollection.length/2) {
		warner("Grouping marker pairing mismatch");
	};
	
}

function parseTokens(tokenArray) {
	let parsedEquation = [];
	return groupExpressions(parsedEquation, tokenArray);
}