'use strict';
game.board = {
  game: game,
  size: 15,
  cells: [],
  create() {
    this.createCells();
  },
  createCells() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.cells.push(this.createCell(row, col));
      }
    }
  },
  createCell(row, col) {
    let cellSize = this.game.sprites.cell.width + 1;
    let offsetX = (this.game.width - cellSize * this.size) / 2;
    let offsetY = (this.game.height - cellSize * this.size) / 2;
    return {
      row: row,
      col: col,
      x: offsetX + cellSize * col,
      y: offsetY + cellSize * row
    };
  },
  createCellObject(type) {
    // проверить есть ли ячейка данного типа
    let cell = this.cells.find((cell) => {
      return cell.type === type;
    });

    if (cell) {
      cell.type = false;
    }

    // найти доступную ячейку
    cell = this.getRandomAvailableCell();

    cell.type = type;
  },
  createFood() {
    this.createCellObject('food');
  },
  createBomb() {
    this.createCellObject('bomb');
  },
  getRandomAvailableCell() {
    let pool = this.cells.filter((cell) => {
      return !cell.type && !this.game.snake.hasCell(cell);
    });
    let index = this.random(0, pool.length - 1);
    return pool[index];
  },
  getCell(row, col) {
    return this.cells.find((cell) => {
      return cell.row === row && cell.col === col;
    });
  },
  isBombCell(cell) {
    return cell.type === 'bomb';
  },
  isFoodCell(cell) {
    return cell.type === 'food';
  },
  random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  },
  render() {
    this.cells.forEach((cell) => {
      this.game.ctx.drawImage(this.game.sprites.cell, cell.x, cell.y);
      if (cell.type) {
        this.game.ctx.drawImage(this.game.sprites[cell.type], cell.x, cell.y);
      }
    });
  }
};
