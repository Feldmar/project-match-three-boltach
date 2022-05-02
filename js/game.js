'use strict';
let game = {
  imagesDiamond:['svg/diamond/blue_1.svg',
	'svg/diamond/green_2.svg',
	'svg/diamond/orange_3.svg',
	'svg/diamond/purple_4.svg',
	'svg/diamond/red_5.svg',
	'svg/diamond/yellow_6.svg'],
  canvas: null,
  ctx: null,
  board: null,
  width: 0,
  height: 0,
  score: 0,
  dimensions: {
    max: {
      width: 800,
      height: 400
    },
    min: {
      width: 300,
      height: 300
    }
  },
  sprites: {
    cell: null,
    head: null,
    body: null,
  },
  start() {
    this.init();
    this.preload(() => {
      this.run();
    });
  },
  init() {
    this.canvas = document.getElementById('mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.initDimensions();
    this.setTextFont();
  },
  setTextFont() {
    this.ctx.font = '20px Cactus';
    this.ctx.fillStyle = '#304251';
  },
  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length;

    let onAssetLoad = () => {
      ++loaded;
      console.log(loaded);

      if (loaded >= required) {
        callback();
      }
    };

    this.preloadSprites(onAssetLoad);
  },
  preloadSprites(onAssetLoad) {
    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = 'svg/diamond' + key + '.svg';
      this.sprites[key].addEventListener('load', onAssetLoad);
    }
  },
  initDimensions() {
    let data = {
      maxWidth: this.dimensions.max.width,
      maxHeight: this.dimensions.max.height,
      minWidth: this.dimensions.min.width,
      minHeight: this.dimensions.min.height,
      realWidth: window.innerWidth,
      realHeight: window.innerHeight
    };

    if (data.realWidth / data.realHeight > data.maxWidth / data.maxHeight) {
      this.fitWidth(data);
    } else {
      this.fitHeight(data);
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },
  fitWidth(data) {
    this.height = Math.round(this.width * data.realHeight / data.realWidth);
    this.height = Math.min(this.height, data.maxHeight);
    this.height = Math.max(this.height, data.minHeight);
    this.width = Math.round(data.realWidth * this.height / data.realHeight);
    this.canvas.style.height = '100%';
  },
  fitHeight(data) {
    this.width = Math.round(data.realWidth * data.maxHeight / data.realHeight);
    this.width = Math.min(this.width, data.maxWidth);
    this.width = Math.max(this.width, data.minWidth);
    this.height = Math.round(this.width * data.realHeight / data.realWidth);
    this.canvas.style.height = '100%';
  },
  run() {
    // запуск игры
    console.log('запуск игры');
    this.create();

    this.gameInterval = setInterval(() => {
      this.update();
    }, 150);

    this.bombInterval = setInterval(() => {
      if (this.snake.moving) {
        this.board.createBomb();
      }
    }, 3000);
  },
  create() {
    // создаём элементы - работа с данными
    this.board.create();
    this.snake.create();
    this.board.createFood();
    this.board.createBomb();

    // установить игровые события
    window.addEventListener('keydown', (event) => {
      this.snake.start(event.keyCode);
    });
  },
  update() {
    this.snake.move();
    this.render();
  },
  render() {
    // отрисовка элементов на canvas
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(this.sprites.background, 0, 0);
      this.board.render();
      this.snake.render();
      this.ctx.fillText('Score: ' + this.score, 30, 30);
    });
  },
  stop() {
    clearInterval(this.gameInterval);
    clearInterval(this.bombInterval);
    alert('Игра завершена');
    window.location.reload();
  },
  onSnakeStart() {
    // старт чего-то для змейки
  },
  onSnakeEat() {
    ++this.score;
    this.board.createFood();
  }
};

window.addEventListener('load', () => {
  game.start();
});
