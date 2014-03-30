/* Simulating tree growth rates from pg 104 of Complex Adaptive Systems */
/* Dan Shipper */
/* 12/24/13 */

function makeTwoDimensional(array, height) {
	for ( var i = 0; i < array.length; i++ ) {
		array[i] = new Array(height);
	}
	return array;
}

//to round to n decimal places
function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

var NORMAL = "t";
var BURNED = "T";
var EMPTY = "-";

function Space(board, positionX, positionY) {
	this.state = EMPTY;
	this.board = board;
	this.position = {x: positionX, y: positionY};	
}

Space.prototype = {
	type : function() {
		return "SPACE";
	},

	state : function() {
		return this.state;
	},

	toString : function() {
		return this.state;
	}
}

function Tree(board, positionX, positionY) {
	this.state = NORMAL;
	this.board = board;
	this.position = {x: positionX, y: positionY};
}

Tree.prototype = {
	burn : function() {
		if ( this.state === NORMAL ) {
			this.state = BURNED;
			this.burnAllAround();
		}
	},

	burnAllAround : function(diagonal){
		var treesAround = [];
		if ( this.position.x - 1 >= 0 )
			var left = this.board[this.position.x - 1][this.position.y];
		if ( this.position.x + 1 < this.board.length )
			var right = this.board[this.position.x + 1][this.position.y];
		if ( this.position.y + 1 < this.board[this.position.x].length )
			var up = this.board[this.position.x][this.position.y + 1];
		if ( this.position.y - 1 >= 0 )
			var down = this.board[this.position.x][this.position.y - 1];

		if ( right && right.type() === "TREE" ) {
			treesAround.push(right);	
		}

		if ( left && left.type() === "TREE" ) {
			treesAround.push(left);	
		}

		if ( up && up.type() === "TREE" ) {
			treesAround.push(up);	
		}

		if ( down && down.type() === "TREE" ) {
			treesAround.push(down);	
		}

		// if ( diagonal ) { //incomplete
		// 	if ( this.position.x - 1 >= 0 && this.position.y - 1 )
		// 		var nw = this.board[this.position.x - 1][this.position.y - 1];
		// 	if ( this.position.x + 1 < this.board.length && this.position.y + 1 < this.board.height )
		// 		var ne = this.board[this.position.x + 1][this.position.y + 1];
		// 	if ( this.position.y + 1 < this.board[this.position.x].length )
		// 		var sw = this.board[this.position.x][this.position.y + 1];
		// 	if ( this.position.y - 1 >= 0 )
		// 		var se = this.board[this.position.x][this.position.y - 1];
		// }

		for ( tree in treesAround ) {
			if ( treesAround[tree].state === NORMAL ) {
				treesAround[tree].burn();
			}
		}
		
	}, 

	type : function() {
		return "TREE";
	},

	state : function() {
		return this.state;
	},

	toString : function() {
		return this.state;
	}
}

function Board( width, height, firePercentage, growthPercentage ) {
	this.width = width;
	this.height = height;
	this.ridge = makeTwoDimensional(new Array(width), height);
	this.growthPercentage = growthPercentage;
	this.firePercentage = firePercentage;
}

Board.prototype = {

	setGrowthPercentage : function(growthPercentage) {
		this.growthPercentage = growthPercentage;
	},

	yield : function() {
		var normal = 0.0;
		for ( var i = 0; i < this.width; i++ ) {
			for ( var j = 0; j < this.height; j++ ) {
				var currentOccupent = this.ridge[i][j];
				if ( currentOccupent && currentOccupent.type() === "TREE" && currentOccupent.state === NORMAL) {
					normal += 1.0;
				}
			}
		}

		// var yield = normal / (this.width + this.height);
		return normal;
	},

	percentBurned : function() {
		var normal = 0.0;
		var burned = 0.0

		for ( var i = 0; i < this.width; i++ ) {
			for ( var j = 0; j < this.height; j++ ) {
				var currentOccupent = this.ridge[i][j];
				if ( currentOccupent && currentOccupent.type() === "TREE" && currentOccupent.state === BURNED) {
					burned += 1.0;
				} else if ( currentOccupent && currentOccupent.type() === "TREE" && currentOccupent.state === NORMAL) {
					normal += 1.0;
				}
			}
		}

		var percentBurned = burned / (normal + burned);
		percentBurned = percentBurned * 100;
		// console.log("Percent burned: " + percentBurned );
		return percentBurned;
	},

	grow : function(){
		for ( var i = 0; i < this.width; i++ ) {
			for ( var j = 0; j < this.height; j++ ) {
				var modValue = 1 / this.growthPercentage;
				var randomNumber = Math.floor((Math.random()*100)+1);

				var currentOccupent = this.ridge[i][j];
				if ( !currentOccupent || currentOccupent.type() != "TREE" ) {
					if ( Math.floor(randomNumber % modValue) === 0 ) {
						this.ridge[i][j] = new Tree(this.ridge, i, j);
					} else {
						this.ridge[i][j] = new Space(this.ridge, i, j);
					}
				}
			}
		}
	},

	fire : function(){
		for ( var i = 0; i < this.width; i++ ) {
			for ( var j = 0; j < this.height; j++ ) {
				var modValue = 1 / this.firePercentage;
				var randomNumber = Math.floor((Math.random()*100)+1);
				if ( this.ridge[i][j].type() === "TREE" && Math.floor(randomNumber % modValue) === 0 ) {
					this.ridge[i][j].burn();
				}
			}
		}
	},

	print : function(){
		for ( var i = 0; i < this.width; i++ ) {
			var row = "";
			for ( var j = 0; j < this.height; j++ ) {
				row += ( this.ridge[i][j] );
			}
			console.log(row);
		}
	}

}