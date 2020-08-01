# MineSweeper Game
This application represents a minesweeper game implemented using the Django framework in Python for the server side and Javascrit/JQuery for the client side.

To Run it:
- git clone repo
- install python3 and pip3
- pip3 install django
- cd <path_to_repo>
- python3 manage.py runserver 8114 (or change 8114 to whatever port you wish)
- go to http://127.0.0.1:8814/minesweeper in your browser

When any one of the boxes are clicked, the client side sends an AJAX request to the server to figure out the current status of the field, and updates the map accordingly. 
As game states are stored on the server, it is possible to get back to the game by going to the URL.

![Alt text](minesweeper.png?raw=true "Hello!! :)")