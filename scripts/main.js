const body = document.querySelector('body');
const darkMode = false;
const clockPanel = document.querySelector('#clockPanel');
const displayDigits = 6;
const digitHeight = 6;
const digitWidth = 3;
const lineWidth = 2;
const clockSize = 50; // odd number works best if lineWidth = 1 to prevent sub pixel blending problems
const clocks = new Array(displayDigits * digitWidth).fill(null).map(() => new Array(digitHeight).fill(null));
const pi = Math.PI;
const digitStore = new DigitStore();
let lineColor = 'rgb(0, 0, 0)'

if (darkMode) {
  body.style.background = 'rgb(0, 0, 0)';
  lineColor = 'rgb(127, 127, 127)';
}

let momentNow = new moment();
let momentNext = new moment(momentNow).add(1, 'seconds');
let timeNow = momentNow.format('hhmmss')
let timeNext = momentNext.format('hhmmss')

let position;

initializeClocks();
updateClocks();

function initializeClocks() {
  // create and initialize canvases and clocks
  for (let y = 0; y < digitHeight; y++) {
    for (let x = 0; x < displayDigits * digitWidth; x++) {
      let newCanvas = document.createElement('canvas');
      newCanvas.className = 'unitClock';
      newCanvas.width = clockSize;
      newCanvas.height = clockSize;
      clockPanel.appendChild(newCanvas);

      let newContext = newCanvas.getContext('2d');
      newContext.strokeStyle = lineColor;
      newContext.lineWidth = lineWidth;
      newContext.globalCompositeOperation = 'darken';
      newContext.translate(newCanvas.width/2, newCanvas.height/2);
      clocks[x][y] = newContext;
    }
  }
}

function updateClocks() {

  updateTime();
  
  for (let d = 0; d < displayDigits; d++) {
    for (let x = 0; x < digitWidth; x++) {
      for (let y = 0; y < digitHeight; y++) {
        if (timeNow[d] === timeNext[d]) {
          position = digitStore.getPositions(timeNow[d], x, y);
        } else {
          position = digitStore.getPartialPosition(timeNow[d], timeNext[d], x, y);
        }

        // if (d == 5 && x == 1 && y == 4) {
        //   console.log(position);
        // }

        let hand0x = Math.cos(h2r(position[0])) * (clockSize / 2);
        let hand0y = Math.sin(h2r(position[0])) * (clockSize / 2);
        let hand1x = Math.cos(h2r(position[1])) * (clockSize / 2);
        let hand1y = Math.sin(h2r(position[1])) * (clockSize / 2);
        
        clocks[(d*3) + x][y].clearRect(-(clockSize / 2), -(clockSize / 2), clockSize, clockSize)
        // clocks[(d*3) + x][y].beginPath();
        // clocks[(d*3) + x][y].strokeRect(-(clockSize / 2), -(clockSize / 2), clockSize, clockSize);
        clocks[(d*3) + x][y].beginPath();
        clocks[(d*3) + x][y].moveTo(0, 0);
        clocks[(d*3) + x][y].lineTo(hand0x, hand0y);
        clocks[(d*3) + x][y].stroke();
        clocks[(d*3) + x][y].beginPath();
        clocks[(d*3) + x][y].moveTo(0, 0);
        clocks[(d*3) + x][y].lineTo(hand1x, hand1y);
        clocks[(d*3) + x][y].stroke();
      }
    }
  }

  requestAnimationFrame(updateClocks);
}

function updateTime() {
  momentNow = new moment();
  momentNext = new moment(momentNow).add(1, 'seconds');
  timeNow = momentNow.format('hhmmss')
  timeNext = momentNext.format('hhmmss')
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
};

function h2r(hour) {
  let angle = hour / (6 / pi)
  return -(((pi / 2) - angle) % (2 * pi))
}

