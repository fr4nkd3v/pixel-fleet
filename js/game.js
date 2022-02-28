//#region VARIABLES

const planeGrid = document.querySelector('.grid'); // Plano de la distribucion de la flota
const divWeapons = document.querySelectorAll('.weapon'); // Botones de las armas

const consoleText = document.querySelector('.input > p'); // El texto de la Consola
const inputCoordinates = document.querySelector('#coordinates'); // Input que recibe las coordenadas

// Game Variables

const shipTypes = {
  A: {
    squares: 2
  },
  B: {
    squares: 2
  },
  C: {
    squares: 3
  },
  D: {
    squares: 4
  }
}

let shipSelect = 'A';

const attackCoordinate = {
  letter: null,
  number: null
};


const myShips = []

const enemyShips = [
  {
    type: 'A',
    coordinates: [['B', 3], ['D', 3]]    
  }
]


const letters = [];
//#endregion

//#region FUNCTIONS

// retorna un objeto de coordenadas si es valido y false si no lo es
function validateCoordinate(coordinate) {

  const coordinateObj = {
    letter: null,
    number: null
  }
  
  coordinate = coordinate.trim();

  if (coordinate.length > 3 || coordinate.length < 2) return false;


  if (letters.includes(coordinate[0])) { // Si hay una letra valida al inicio
    coordinateObj.letter = coordinate[0];
    coordinate = coordinate.slice(1);
  } else if (letters.includes(coordinate[coordinate.length - 1])) { // Si hay una letra valida al final
    coordinateObj.letter = coordinate[coordinate.length - 1];
    coordinate = coordinate.slice(0, coordinate.length - 1);
  } else {
    return false;
  }

  coordinate = Number(coordinate);

  if (Number.isInteger(coordinate) && coordinate > 0 && coordinate <= 10) {
    coordinateObj.number = coordinate;
  } else {
    return false;
  }

  return coordinateObj;
}

// Crea la cuadricula del plano donde se ubican las unidades del
// jugador, recibe el ancho y alto.
function initGrid(nro) {
  planeGrid.style.gridTemplateColumns = `repeat(${nro + 1}, 3rem)`;
  planeGrid.style.gridTemplateRows = `repeat(${nro + 1}, 3rem)`;

  for (let i = 0; i < (nro + 1); i++) {

    for (let j = 0; j < (nro + 1); j++) {
      
      const square = document.createElement('div');
      square.className = 'square';
      
      if (i === 0 && j !== 0)
        square.textContent = j;

      if (j === 0 && i !== 0) {
        square.textContent = String.fromCharCode(i + 64);
        letters.push(String.fromCharCode(i + 64));
      }

      planeGrid.appendChild(square);
    }
  }
}

// Inicia todo
function startApp() {
  initGrid(10);
}

//#endregion
eventListeners();
function eventListeners() {

  document.addEventListener('DOMContentLoaded', startApp);

  
  divWeapons.forEach(element => {
    element.addEventListener('click', (e) => {
      shipSelect = e.target.dataset.letter;
    } );
  });
  
  inputCoordinates.addEventListener('keyup', (e) => {

    if (e.keyCode === 13) {
      const coordinate = inputCoordinates.value;
      if (validateCoordinate(coordinate)) {
        consoleText.textContent = 'La Coordenada es correcta';
      } else {
        consoleText.textContent = 'La Coordenada es incorrecta, inténtalo otra vez';

      }

    }

  });
}