'use strict';
game.snake = {
  game: game,
  cells: [],
  direction: null,
  directions: {
    up: {
      row: -1,
      col: 0,
      angle: 0
    },
    down: {
      row: 1,
      col: 0,
      angle: 180
    },
    left: {
      row: 0,
      col: -1,
      angle: 270
    },
    right: {
      row: 0,
      col: 1,
      angle: 90
    }
  },
  moving: false,
  start(keyCode) {
    switch (keyCode) {
      case 38:
        this.direction = this.directions.up;
        break;
      case 37:
        this.direction = this.directions.left;
        break;
      case 39:
        this.direction = this.directions.right;
        break;
      case 40:
        this.direction = this.directions.down;
        break;
    }
    if (!this.moving) {
      this.game.onSnakeStart();
    }
    this.moving = true;
  },
  hasCell(cell) {
    return this.cells.find((snakeCell) => {
      return snakeCell === cell;
    })
  },
  create() {
    const startCells = [
      {
        row: 7,
        col: 7
      },
      {
        row: 8,
        col: 7
      }
    ];
    this.direction = this.directions.up;

    for (let startCell of startCells) {
      this.cells.push(this.game.board.getCell(startCell.row, startCell.col));
    }
  },
  move() {
    if (!this.moving) {
      return;
    }

    let cell = this.getNextCell();

    if (!cell || this.hasCell(cell) || this.game.board.isBombCell(cell)) {
      this.game.stop();
    } else {
      this.cells.unshift(cell);

      if (!this.game.board.isFoodCell(cell)) {
        this.cells.pop();
      } else {
        this.game.onSnakeEat();
      }
    }

  },
  getNextCell() {
    let head = this.cells[0];

    let row = head.row + this.direction.row;
    let col = head.col + this.direction.col;

    return this.game.board.getCell(row, col);
  },
  render() {
    this.renderHead();
    this.renderBody();
  },
  renderHead() {
    let head = this.cells[0];

    let halfSize = this.game.sprites.head.width / 2;

    // сохранить исходное состояние контекста
    this.game.ctx.save();

    // перемещение точки начала отсчета координат в координаты головы
    this.game.ctx.translate(head.x, head.y);
    // перемещение точки начала отсчета координат в центр головы
    this.game.ctx.translate(halfSize, halfSize);
    // вращаем контекст относительно центра спрайта головы snake
    this.game.ctx.rotate(this.direction.angle * Math.PI / 180);
    // отрисовываем голову с учётом поворота контекста
    this.game.ctx.drawImage(this.game.sprites.head, -halfSize, -halfSize);
    // возвращаем исходное состояние контекста
    this.game.ctx.restore();
  },
  renderBody() {
    for (let i = 1; i < this.cells.length; i++) {
      this.game.ctx.drawImage(this.game.sprites.body, this.cells[i].x, this.cells[i].y);
    }
  }
};
