function startNewGame(row, col, numBombs) {
	board = new Board(row, col, numBombs);
    board.makeNewBoard();
    $('.square').mousedown(function (event) {
		switch(event.which) {
			case 1: // left click
				board.leftclick(event.target);
				break;
			case 3: // right click
				board.rightclick(event.target);
				break;
		}
    });
	$('#gameFinished').hide(); // hide new game button
    return board;
}

function loadExistingGame(gameId) { //still needs further implementation
	board = new Board(12, 12, 20);
    board.makeNewBoard();
    $('.square').mousedown(function (event) {
		switch(event.which) {
			case 1: // left click
				board.leftclick(event.target);
				break;
			case 3: // right click
				board.rightclick(event.target);
				break;
		}
    });
	$('#gameFinished').hide(); // hide new game button
    return board;
}

function validGameId(gameId) { //send AJAX request to endpoint with this gameid to check if it exists
	var mydata = {'gameid':gameId};
	$.ajax({
		url: "http://127.0.0.1:8888/minesweeper/checkgameid",
		data: JSON.stringify(mydata),
		contentType: 'text/plain; charset=utf-8',
		dataType: 'text',
		success: function(data) {
			if(data == 'true'){
				return true;
			}
		},
		error: function(data) {
			return false;
		},
		type: 'GET',
		timeout: 2000
	});
	return true;
}

function Board(row, col, numBombs){
    this.row = row;
    this.col = col;
	this.numBombs = numBombs;
	this.spacesCleared = 0;
    this.gameFinished = false;
	
	this.makeNewBoard = function() {
		$('#minesweeper').empty(); // remove any previous boards on the div
        var boardCode = "";
        for (i = 1; i <= row; i++) {
            for (j = 1; j <= col; j++) {
                boardCode = boardCode.concat('<div class="square" rowid="'+ i +'" colid="'+ j +'">&nbsp;</div>'); //&nbsp is a non breaking space
            }
			boardCode += '<br/>'; //new line when we finish 
        }
        $('#minesweeper').append(boardCode);
    }
	
    this.leftclick = function (target_elem) {
		if (this.gameFinished === true) {
            return;
        }
		//else retrieve which square got clicked
        var row = $(target_elem).attr("rowid");
        var col = $(target_elem).attr("colid");
        if (this.spaces[row - 1][col - 1].explored == true || this.spaces[row - 1][col - 1].flagged == true) {
            return;
        } else if (this.spaces[row - 1][col - 1].value == -1) {
            this.explode();
        } else if (this.spaces[row - 1][col - 1].value == 0) {
            this.clear(row-1, col-1);
			clearNear.call(this, row-1, col-1);
        } else {
            this.clear(row-1, col-1);
        }
		checkForWin(this); //is the game done?
    }
	
	this.rightclick = function(target_elem) { // Add/remove a flag
		if (this.gameFinished === true) {
            return;
        }
		//else retrieve which square got clicked
        var row = $(target_elem).attr("rowid");
        var col = $(target_elem).attr("colid");
		if (this.spaces[row - 1][col - 1].explored == true) {
            return;
        } else if (this.spaces[row - 1][col - 1].flagged == false) {
            this.spaces[row - 1][col - 1].flagged = true;
			$('#numBombs').html(this.numBombs - numFlags.call(this)); // update # of bombs remaining
			//add flag pic (i.e. add id flag)
			var flagdiv = 'div[rowid="' + row + '"][colid="' + col + '"]';
			$(flagdiv).attr("id", "flag");
        } else if (this.spaces[row - 1][col - 1].flagged == true) {
            this.spaces[row - 1][col - 1].flagged = false;
			$('#numBombs').html(this.numBombs - numFlags.call(this)); // update # of bombs remaining
			//remove flag pic (i.e. remove id flag)
			var flagdiv = 'div[rowid="' + row + '"][colid="' + col + '"]';
			$(flagdiv).attr("id", "");
        }
	}

    this.explode = function() { //Prints all the bombs in the board
        for (i = 0; i < this.row; i++) {
            for (j = 0; j < this.col; j++) {
                if (this.spaces[i][j].value == -1) {
                    var targetDiv = 'div[rowid="' + (i + 1) + '"][colid="' + (j + 1) + '"]';
                    $(targetDiv).addClass('bomb');
					$(targetDiv).html('<img class="bomb" src="/static/imgs/bomb.png"/>'); //append the picture to the square
                }
            }
        }
        this.gameFinished = true;
        $('#gameFinished').show(); //ask the user if he/she wants to play again
    }

    var numBombNear = function(row, col) {
		if (this.spaces[row][col].value == -1) {
            return -1;
        }
		//else check neighbours
        return (valueAt.call(this, row - 1, col - 1) + valueAt.call(this, row - 1, col) + valueAt.call(this, row - 1, col + 1) + valueAt.call(this, row, col - 1) + valueAt.call(this, row, col + 1) + valueAt.call(this, row + 1, col - 1) + valueAt.call(this, row + 1, col) + valueAt.call(this, row + 1, col + 1) );
    }
	
	var numFlags = function() {
		sum = 0;
		for ( i = 0; i < this.row; i++) {
			for ( j = 0; j < this.col; j++) {
				if (this.spaces[i][j].flagged == true && this.spaces[i][j].explored == false) {
					sum += 1;
				}
			}
		}
        return sum;
    }

    function valueAt(row, col) { //send AJAX request to server
        if (row < 0 || row >= this.row || col < 0 || col >= this.col) {
            return 0;
        } else if(this.spaces[row][col].value == -1){
		//} else if($.get("127.0.0.1:8888/minesweeper/gameid="+gameId, function(data) {
			//alert( "Data Loaded: " + data );
			//if(data.spaces[row][col].value == -1){ //return 1 if it's a bomb (This is only used to determine the numbers on the board)
			return 1;
			//}
        }
		//};
        return 0;
    }

	function checkForWin(){
        if(this.row * this.col - this.spacesCleared == this.numBombs) { //If so then print smiley faces : )
            for (i = 0; i < this.row; i++) {
                for (j = 0; j < this.col; j++) {
                    if (this.spaces[i][j].value == -1) {
                        var bombdiv = 'div[rowid="' + (i + 1) + '"][colid="' + (j + 1) + '"]';
						$(bombdiv).html('<img class="smiley" src="/static/imgs/smiley.png"/>');
                        this.gameFinished = true;
                        $('#gameFinished').show();
                    }
                }
            }
        }
    }

    this.clear = function (row, col) {
		if( this.spaces[row][col].flagged == false ){
			var squareDiv = 'div[rowid="' + (row + 1) + '"][colid="' + (col + 1) + '"]';
			$(squareDiv).addClass('clear');
			if (this.spaces[row][col].value > 0) { //figure out what the square contains
				$(squareDiv).text(this.spaces[row][col].value);
			} else {
				$(squareDiv).html('&nbsp'); //space
			}
			this.spacesCleared++;
			this.spaces[row][col].explored = true;
			checkForWin.call(this);
		}
    }

    function clearNear(row, col) {
		for (i = row-1; i <= this.row+1; i++) {
            for (j = col-1; j <= this.col+1; j++) {
                checkSpace.call(this, i, j);
            }
        }
        checkForWin.call(this);
    }

    function checkSpace(row, col) {
        if (row < 0 || row >= this.row || col < 0 || col >= this.col || this.spaces[row][col].explored == true) {
            return;
        } else if (this.spaces[row][col].value >= 0) {
            this.clear(row, col);
            if (this.spaces[row][col].value == 0) {
                clearNear.call(this, row, col);
                return;
            }
        }
    }

	this.spaces = new Array(this.row);
	for (i = 0; i < this.row; i++) {
		this.spaces[i] = new Array(this.col);
		for (j = 0; j < this.col; j++) {
			this.spaces[i][j] = new Square(false, 0, false);
		}
	}
	$('#numBombs').html(this.numBombs);
	for (i = 0; i < this.numBombs; i++) {
		var bombIndex = Math.round(Math.random() * ((this.row * this.col) - 1));
		var x = Math.floor(bombIndex / this.col);
		var y = bombIndex % this.col;
		this.spaces[x][y] = new Square(false, -1, false);
	}
	for (i = 0; i < this.row; i++) {
		for (j = 0; j < this.col; j++) {
			this.spaces[i][j].value = numBombNear.call(this, i, j);
		}
	}
}

function Square(explored, value, flagged){
    this.value = value; //-1 means bomb
	this.flagged = flagged;
	this.explored = explored;
}