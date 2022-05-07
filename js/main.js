'use strict';
let div = document.getElementsByTagName('div');

let config = {
	imagesDiamond:['svg/diamond/blue_1.svg',
	'svg/diamond/green_2.svg',
	'svg/diamond/orange_3.svg',
	'svg/diamond/purple_4.svg',
	'svg/diamond/red_5.svg',
	'svg/diamond/yellow_6.svg'],
	score: 0,
	countRows: 6,
	countCols: 6,
  cellHeight: 50,
  cellWidth: 50,
  tiles:[],
	canvas: null,
  ctx: null,
	width: 0,
  height: 0,
	dimensions: {
    max: {
      width: 640,
      height: 360
    },
    min: {
      width: 300,
      height: 300
    }
  },
	init() {
    this.canvas = document.getElementById('mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.initDimensions();
    
  },
	initDimensions(data) {
    data = {
      maxWidth: this.dimensions.max.width,
      maxHeight: this.dimensions.max.height,
      minWidth: this.dimensions.min.width,
      minHeight: this.dimensions.min.height,
      realWidth: window.innerWidth,
      realHeight: window.innerHeight
    };

}
};

function initilize() {
  for (let i=0; i<config.countCols; i++) {
    config.tiles[i] = [];
    for (let j=0; j<config.countRows; j++) {
      config.tiles[i][j] = { type: 0, shift:0 };
    }
  }
}
initilize();
