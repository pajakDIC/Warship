let audioMusicRadar = true; //флажок, щоб музика запускалася лише раз
let model = {
        boardSize: 7,
        numShips: 3,
        shipLength: 3,
        shipsSunk: 0,
        ships: [
            {locations: [0, 0, 0], hits: ['', '', '']},
            {locations: [0, 0, 0], hits: ['', '', '']},
            {locations: [0, 0, 0], hits: ['', '', '']},
        ],
        fire: function (guess) {
                Fire();
                if (audioMusicRadar) {
                    Music ();
                    Radar ();
                    audioMusicRadar = false;
                };
            for (let i = 0; i < this.numShips; i++) {
                let ship = this.ships[i];
                let index = ship.locations.indexOf(guess);
                if (index >= 0) {
                    ship.hits[index] = 'hit';
                    view.displayHit(guess);
                    view.displayMessage('Попав!');
                    if (this.isSunk(ship)) {
                        view.displayMessage('Ти потомив кацапський корабель');
                        KillSiren();
                        Kill();
                        this.shipsSunk++;
                    }
                    return true;
                }
            }
            view.displayMiss(guess);
            view.displayMessage('Промазав!');
            return false;

        },
        isSunk: function (ship) {
            for (let i = 0; i < this.shipLength; i++) {
                if (ship.hits[i] !== 'hit') {
                    return false;
                }
            }
            return true;
        },
    generateShipLocations: function () {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generatorShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generatorShip: function () {
            let direction = Math.floor(Math.random() * 2);
            let row;
            let col;
            if (direction === 1) {
                row = Math.floor(Math.random() * this.boardSize);
                col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
            } else {
                row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
                col = Math.floor(Math.random() * this.boardSize);
            }
            let newShioLocations = [];
            for (let i = 0; i < this.shipLength; i++) {
                if (direction === 1) {
                    newShioLocations.push(row + '' + (col + i));
                } else {
                    newShioLocations.push((row + i) + '' + col);
                }
            }
            return newShioLocations;
        },
    collision: function (locations) {
            for (let i = 0; i < this.numShips; i++) {
                let ship = model.ships[i];
                for (let j = 0; j < locations.length; j++){
                    if (ship.locations.indexOf(locations[j]) >= 0){
                        return true;
                    }
                }
            }
            return false;
    }
    };
    let view = {
        displayMessage: function (msg) {
            let massageArea = document.getElementById('messangeArea');
            massageArea.innerHTML = msg;

        },
        displayHit: function (location) {
            let cell = document.getElementById(location);
            cell.setAttribute('class', 'hit');
            Damag();
        },
        displayMiss: function (location) {
            let cell = document.getElementById(location);
            cell.setAttribute('class', 'miss');
            noDamag();
        }
    };
    let controller = {
        guesses: 0,
        processGuess: function (guess) {
            let location = parseGuess(guess);
            if (location) {
                this.guesses++;
                let hit = model.fire(location);
                if (hit && model.shipsSunk === model.numShips) {
                    view.displayMessage('Ти потопив весь москальський флот ' +
                        'у кількості ' + model.shipLength + ' кораблів, за ' +
                        this.guesses + ' постріли!!!');
                }
            }
        }
    };

    function parseGuess(guess) {
        let alphabet = ["A", "B", "C", "D", "E", "F", "G",];
        if (guess === null || guess.length !== 2) {
            error();
            alert('Некоректні координати вогню, спробуй ще раз!');
        } else {
            let firstChar = guess.charAt(0);
            let row = alphabet.indexOf(firstChar);
            let column = guess.charAt(1);
            if (isNaN(row) || isNaN(column)) {
                error();
                alert('Координати пострілу за межами поля, скорегуй постріл!');
            } else if (row < 0 || row >= model.boardSize ||
                column < 0 || column >= model.boardSize) {
                error();
                alert('Постріл був за межі поля, спробуй ще раз!');
            } else {

                return row + column;
            }
        }
        return null;
    }

    function init() {
        let fireButton = document.getElementById('fireButon');
        fireButton.onclick = handleFireButton;
        let guessInput = document.getElementById('guessInput');
        guessInput.onkeydown = handleKeyPress;
        model.generateShipLocations();
    };

    function handleFireButton() {
        let guessInput = document.getElementById('guessInput');
        let guess = guessInput.value.toUpperCase();
        controller.processGuess(guess);
        guessInput.value = '';
    };
    function handleKeyPress (e) {
        let fireButton = document.getElementById('fireButon');
        if (e.keyCode === 13) {
            fireButton.click();
            return false;
        }
    };
    window.onload = init;

    function Music() {
        let audio = new Audio();
        audio.src = 'model/audio/B-BoxerD.I.C.mp3';
        audio.volume = 0.5;
        audio.autoplay = true;
        audio.loop = 100;
    }

    function Radar() {
        let audio = new Audio();
        audio.src = 'model/audio/Radar.mp3';
        audio.volume = 0.6;
        audio.autoplay = true;
        audio.loop = 100;
    };

    function Fire() {
        let audio = new Audio();
        audio.src = 'model/audio/Fire.mp3';
        audio.volume = 0.6;
        audio.autoplay = true;
    }

    function noDamag() {
        let audio = new Audio();
        audio.src = 'model/audio/neprobil.mp3';
        audio.volume = 0.6;
        audio.autoplay = true;
    }

    function Damag() {
        let audio = new Audio();
        audio.src = 'model/audio/Probil.mp3';
        audio.volume = 0.6;
        audio.autoplay = true;
    }

    function error() {
        let audio = new Audio();
        audio.src = 'model/audio/error.mp3';
        audio.volume = 0.3;
        audio.autoplay = true;
    }
function KillSiren() {
    let audio = new Audio();
    audio.src = 'model/audio/Sirena.mp3';
    audio.volume = 0.1;
    audio.autoplay = true;
};
function Kill() {
    let audio = new Audio();
    audio.src = 'model/audio/Kill.mp3';
    audio.volume = 0.5;
    audio.autoplay = true;
};



