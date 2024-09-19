import { TOrientationType } from "~/pages/GamePage/GamePage.types";

export const parseCoordinateX = (coor: number): string => {
  return String.fromCharCode(coor + 96);
}

export const isValidCoordinate = (x: string, y: number) => {
  return ('abcdefghij'.includes(x) && y > 0 && y < 11);
}

export const getNextTiles = (
  x: string, y: number, length: number, orientation: TOrientationType
) => {
  const tiles = [];
  for (let index = 0; index < length; index++) {
    let tile;
    if (orientation === 'horizontal') {
      const newCoordinateX = String.fromCharCode(x.charCodeAt(0) + index)
      tile = document.getElementById(`${y}${newCoordinateX}`);
    } else if (orientation === 'vertical') {
      const newCoordinateY = y + index;
      tile = document.getElementById(`${newCoordinateY}${x}`);
    }
    if (tile) tiles.push(tile);
  }
  return tiles;
}

export const getNextCoordinates = (
  x: string, y: number, length: number, orientation: TOrientationType
) => {
  const coordinates = [];
  for (let index = 0; index < length; index++) {
    let coordinate;
    if (orientation === 'horizontal') {
      const newCoordinateX = String.fromCharCode(x.charCodeAt(0) + index)
      coordinate = {x: newCoordinateX, y};
    } else if (orientation === 'vertical') {
      const newCoordinateY = y + index;
      coordinate = {x, y: newCoordinateY};
    }
    if (coordinate) coordinates.push(coordinate);
  }
  return coordinates;
}

// export const showCursorShadowShip = (
//   initialLocation: {x: number, y: number} | null = null, length: number, orientation: TOrientationType = 'horizontal'
// ) => {
//   let cursorShadowShip = document.querySelector('.cursorShadowShip') as HTMLDivElement;

//   if (cursorShadowShip) {
//     cursorShadowShip.classList.remove('is-hide');
//     regenerateCursorShadowShip({ element: cursorShadowShip, length });
//   } else {
//     cursorShadowShip = regenerateCursorShadowShip({ length });
//     document.body.appendChild(cursorShadowShip);
//   }
//   cursorShadowShip.classList.remove('vertical', 'horizontal');
//   cursorShadowShip.classList.add(orientation);

//   if (initialLocation) {
//     const { x, y } = initialLocation;
//     cursorShadowShip.style.left = `${x + 8}px`;
//     cursorShadowShip.style.top = `${y + 8}px`;
//   }

//   document.onmousemove = ({ clientX, clientY }) => {
//     cursorShadowShip.style.left = `${clientX + 8}px`;
//     cursorShadowShip.style.top = `${clientY + 8}px`;
//   }
// }

// export const hideCursorShadowShip = () => {
//   const cursorShadowShip = document.querySelector('.cursorShadowShip') as HTMLDivElement;
//   if (cursorShadowShip) {
//     cursorShadowShip.classList.add('is-hide');
//   }
// }

// const regenerateCursorShadowShip = (
//   { element, length }: {element?: HTMLDivElement, length: number}
// ): HTMLDivElement => {
//   let cursorShadowShip;
//   if (element) {
//     cursorShadowShip = element;
//   } else {
//     cursorShadowShip = document.createElement('div');
//   }
//   cursorShadowShip.classList.add('cursorShadowShip');
//   cursorShadowShip.innerHTML = '<div></div>'.repeat(length);
//   return cursorShadowShip;
// }

