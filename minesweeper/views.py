from django.shortcuts import render
from django.http import HttpResponse
import math
import random

global games
global id

games = {}
id=0

def numBombNear(i, j, board):
#     if board[i][j].value == -1):
#         return -1;
    sum = 0;
#     for (i = row-1; i <= row+1; i++):
#         for (j = col-1; j < col+1; j++):
#             sum += valueAt.call(this, i, j)
    return sum;

def getBoard(rows, cols, bombs):
    board = []
    for i in range(rows):
        board[i] = []
        for j in range(cols):
            board[i][j] = [False,0,False]
    for i in range(bombs):
        bombIndex = random.randint((rows * cols) - 1)
        x = math.floor(bombIndex / cols)
        y = bombIndex % cols
        board[x][y] = [False, -1, False]
    for i in range(rows):
        for j in range(cols):
            board[i][j].value = numBombNear(i, j, board)
    return board

def index(request):
    #Remove this, this will go into getGameId() where the game will be initialized by the two methods above
    global id
    games['1234'] = [] 
    return render(request, "minesweeper.html")

def getGameId(request):
    #parse it and get #rows & columns & bombs
    gameInfo = {} #in here
    gameInfo['rowcolbombs'] = ['10','10','10']
    gameInfo['board'] = getBoard(10, 10, 10)
    
    global id
    games[str(id)] = gameInfo #can put info about games in here. but using database is better
    id += 1
    
    return HttpResponse(str(id-1))

def gameIdExists(request):
    if( request.method == 'GET' ):
        for key, value in games.items():
            #if(key == request.GET.get('gameid', False)):
            if(key == request.body['gameid']):
                print('YES')
                return HttpResponse('true')
            else:
                print('no' + str(request.GET.get('gameid', False)))
        return HttpResponse('false')
    else:
        return HttpResponse('INVALID REQUEST')

def getValue(request):
    
    return HttpResponse('false')