'use strict';

 let piz = document.getElementById('piz');
 



game();
function game(){
	let canvas = document.getElementById('mycanvas'); 
	if (!canvas) {
    console.log('no');
    return;
  }
	let ctx = canvas.getContext('2d');
	
	let lastframe = 0;
	
	let drag = false;
	
	let config = {
		y: 2,         // вертикальный отступ
		x: 2,         // горизонтальный отступ
		columns: 10,     // Кол-во столбцов
		rows: 10,        // Кол-во рядов
		stoneWidth: 50,  // ширина камешка
		stoneHeight: 50, // высота камешка
		stone: [],      // двумерный массив камешков
		selectStone: { select: false, column: 0, row: 0 }
	};
	
	let stoneColors = [[255, 128, 128], //цвета камешков
		[128, 255, 128],
		[128, 128, 255],
		[255, 255, 128],
		[255, 128, 255],
		[128, 255, 255],
		[255, 255, 255]];
	
	// совпадения и ходы
	let coincidences = [];  // { column, row, length, horizontal }
	let moves = [];     // { column1, row1, column2, row2 }

	// Текущий ход
	let currentmove = { column1: 0, row1: 0, column2: 0, row2: 0 };
	
	// Игровые события
	let gamestates = { init: 0, ready: 1, resolve: 2 };
	let gamestate = gamestates.init;
	
	// счет
	let score = 0;
	
	
	// Анимация
	let animationstate = 0;
	let animationtime = 0;
	let animationtimetotal = 0.3;

	// Game Over
	let gameover = false;
	
	//центруем канвас
 	function style(){
		canvas.style.display = 'block';
		canvas.style.margin = '0 auto';
 	}
	style();

	//адаптив по-тупому
	
	let bodyWidth = window.innerWidth;
	let bodyHeight = window.innerHeight;
	console.log(bodyWidth);
	if(bodyWidth <= 600){
		config.columns = 8;
		config.rows = 8;
		canvas.width = 405;
		canvas.height = 405;
	}
 	if(bodyWidth <= 513){
		config.columns = 6;
		config.rows = 6;
		canvas.width = 305;
		canvas.height = 305;
	}

	// Инициализируем игру
	function init() {
		// Мышиные события
		canvas.addEventListener('mousemove', onMouseMove);
		canvas.addEventListener('mousedown', onMouseDown);
		canvas.addEventListener('mouseup', onMouseUp);
		canvas.addEventListener('mouseout', onMouseOut);
			
			// Инициализируем двумерный массив камней
		for(let i = 0; i < config.columns; i++) {
			config.stone[i] = [];
			for (let j=0; j<config.rows; j++) {
				// Определяем тип плитки и параметр сдвига для анимации
				config.stone[i][j] = { type: 0, shift:0 };
			}
		}		
	
			// New game
		newGame();		
			// Влезаем в основной цикл
		main(0);
	}
	
	// основной цикл
	function main(tframe) {
		// Request animation frames
		window.requestAnimationFrame(main);
			
		// Обновить и отрендерить игру
		update(tframe);
		render();
	}
	
	// Обновить состояние игры
	function update(tframe) {
		let dt = (tframe - lastframe) / 1000;
		lastframe = tframe;
		
		
		if (gamestate == gamestates.ready) {
					// Игра готова для ввода игроком
					
					// Проверка на окончание игры
			if (moves.length <= 0) {
				gameover = true;
			}	
			
		} else if (gamestate == gamestates.resolve) {
					// Игра занята решениями и анимацией для совпадений, решает дела красиво короче
			animationtime += dt;
					
			if (animationstate == 0) {
							// совпадения нужно найти и удалить
				if (animationtime > animationtimetotal) {
									// Находим совпадения
					findcoincidences();
								
					if (coincidences.length > 0) {
						// Добавляем очки к счету
							countingScore();
							
									
						// совпадения найдены, удаляем их
				    removecoincidences();
											
						// двигаем камни
				    animationstate = 1;
					} else {
										// Совпадения не найдены, анимация не работает, а мы грустим
										gamestate = gamestates.ready;
									}
									animationtime = 0;
							}
					} else if (animationstate == 1) {
							// камень нужно сдвинуть
							if (animationtime > animationtimetotal) {
									// двигаем камень
									shiftstone();
									
									// Ищем новые совпадения
									animationstate = 0;
									animationtime = 0;
									
									// Проверяем, есть ли новые совпадения
									findcoincidences();
									if (coincidences.length <= 0) {
											// Анимация завершена
											gamestate = gamestates.ready;
									}
							}
					} else if (animationstate == 2) {
							// Swapping stone animation
							if (animationtime > animationtimetotal) {
									// Swap the stone
									swap(currentmove.column1, currentmove.row1, currentmove.column2, currentmove.row2);
									
									// Check if the swap made a cluster
									findcoincidences();
									if (coincidences.length > 0) {
											// Valid swap, found one or more coincidences
											// Prepare animation states
											animationstate = 0;
											animationtime = 0;
											gamestate = gamestates.resolve;
									} else {
											// Invalid swap, Rewind swapping animation
											animationstate = 3;
											animationtime = 0;
									}
									
									// Update moves and coincidences
									findMoves();
									findcoincidences();
							}
					} else if (animationstate == 3) {
							// Rewind swapping animation
							if (animationtime > animationtimetotal) {
									// Invalid swap, swap back
									swap(currentmove.column1, currentmove.row1, currentmove.column2, currentmove.row2);
									
									// Animation complete
									gamestate = gamestates.ready;
							}
					}
					
					// Update moves and coincidences
					findMoves();
					findcoincidences();
			}
	}


	//делаем скор
	function createScore(){
		let scoreTXT = document.createElement('span');
		piz.appendChild(scoreTXT);
		scoreTXT.innerHTML = `SCORE:`;

	}
	createScore();

	//подсчет скора
	
	function countingScore(){
		for (let i = 0; i < coincidences.length; i++) {
			score=score += 100;
			console.log(score);
		}
		let scoreSpan = document.createElement('span');
  	piz.appendChild(scoreSpan);
		scoreSpan.setAttribute('id','span');
		document.getElementById('span').innerHTML = score;
	}
		
	function drawCenterText(text, x, y, width) {
		let textdim = ctx.measureText(text);
		ctx.fillText(text, x + (width-textdim.width)/2, y);
}

    // Render the game
    function render() {
			// Draw the frame
			drawFrame();
			
			
			
			// Render clusters
			renderstone();
			
			
			// Game Over overlay
			if (gameover == true) {
				let levelwidth = config.columns * config.stoneWidth;
				let levelheight = config.rows * config.stoneHeight;
					ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
					ctx.fillRect(config.x, config.y, levelwidth, levelheight);
					
					ctx.fillStyle = '#ffffff';
					ctx.font = '24px Verdana';
					drawCenterText('Game Over!', config.y, config.x + levelheight / 2 + 10, levelwidth);
			}
	}
	
	// Draw a frame with a border
	function drawFrame() {
			// Draw background and a border
			ctx.fillStyle = '#d0d0d0';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#e8eaec';
			ctx.fillRect(1, 1, canvas.width-2, canvas.height-2);
			
			
	}
	
	
	
	// Render stone
	function renderstone() {
			for (let i=0; i<config.columns; i++) {
					for (let j=0; j<config.rows; j++) {
							// Get the shift of the tile for animation
							let shift = config.stone[i][j].shift;
							
							// Calculate the tile coordinates
							let coord = getTileCoordinate(i, j, 0, (animationtime / animationtimetotal) * shift);
							
							// Check if there is a tile present
							if (config.stone[i][j].type >= 0) {
									// Get the color of the tile
									let col = stoneColors[config.stone[i][j].type];
									
									// Draw the tile using the color
									drawTile(coord.tilex, coord.tiley, col[0], col[1], col[2]);
							}
							
							// Draw the select tile
							if (config.selectStone.select) {
									if (config.selectStone.column == i && config.selectStone.row == j) {
											// Draw a red tile
											drawTile(coord.tilex, coord.tiley, 255, 0, 0);
									}
							}
					}
			}
			
			// Render the swap animation
			if (gamestate == gamestates.resolve && (animationstate == 2 || animationstate == 3)) {
					// Calculate the x and y shift
					let shiftx = currentmove.column2 - currentmove.column1;
					let shifty = currentmove.row2 - currentmove.row1;

					// First tile
					let coord1 = getTileCoordinate(currentmove.column1, currentmove.row1, 0, 0);
					let coord1shift = getTileCoordinate(currentmove.column1, currentmove.row1, (animationtime / animationtimetotal) * shiftx, (animationtime / animationtimetotal) * shifty);
					let col1 = stoneColors[config.stone[currentmove.column1][currentmove.row1].type];
					
					// Second tile
					let coord2 = getTileCoordinate(currentmove.column2, currentmove.row2, 0, 0);
					let coord2shift = getTileCoordinate(currentmove.column2, currentmove.row2, (animationtime / animationtimetotal) * -shiftx, (animationtime / animationtimetotal) * -shifty);
					let col2 = stoneColors[config.stone[currentmove.column2][currentmove.row2].type];
					
					// Draw a black background
					drawTile(coord1.tilex, coord1.tiley, 0, 0, 0);
					drawTile(coord2.tilex, coord2.tiley, 0, 0, 0);
					
					// Change the order, depending on the animation state
					if (animationstate == 2) {
							// Draw the stone
							drawTile(coord1shift.tilex, coord1shift.tiley, col1[0], col1[1], col1[2]);
							drawTile(coord2shift.tilex, coord2shift.tiley, col2[0], col2[1], col2[2]);
					} else {
							// Draw the stone
							drawTile(coord2shift.tilex, coord2shift.tiley, col2[0], col2[1], col2[2]);
							drawTile(coord1shift.tilex, coord1shift.tiley, col1[0], col1[1], col1[2]);
					}
			}
	}
	
	// Get the tile coordinate
	function getTileCoordinate(column, row, columnoffset, rowoffset) {
			let tilex = config.x + (column + columnoffset) * config.stoneWidth;
			let tiley = config.y + (row + rowoffset) * config.stoneHeight;
			return { tilex: tilex, tiley: tiley};
	}
	
	// Draw a tile with a color
	function drawTile(x, y, r, g, b) {
			ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
			ctx.fillRect(x + 2, y + 2, config.stoneWidth - 4, config.stoneHeight - 4);
	}
	
	// Start a new game
	function newGame() {
			// Reset score
			score = 0;
			
			// Set the gamestate to ready
			gamestate = gamestates.ready;
			
			// Reset game over
			gameover = false;
			
			// Create the config
			createconfig();
			
			// Find initial coincidences and moves
			findMoves();
			findcoincidences(); 
	}
	
	// Create a random config
	function createconfig() {
			let done = false;
			
			// Keep generating configs until it is correct
			while (!done) {
			
					// Create a config with random stone
					for (let i=0; i<config.columns; i++) {
							for (let j=0; j<config.rows; j++) {
									config.stone[i][j].type = getRandomTile();
							}
					}
					
					// Resolve the coincidences
					resolvecoincidences();
					
					// Check if there are valid moves
					findMoves();
					
					// Done when there is a valid move
					if (moves.length > 0) {
							done = true;
					}
			}
	}
	
	// Get a random tile
	function getRandomTile() {
			return Math.floor(Math.random() * stoneColors.length);
	}
	
	// Remove coincidences and insert stone
	function resolvecoincidences() {
			// Check for coincidences
			findcoincidences();
			
			// While there are coincidences left
			while (coincidences.length > 0) {
			
					// Remove coincidences
					removecoincidences();
					
					// Shift stone
					shiftstone();
					
					// Check if there are coincidences left
					findcoincidences();
			}
	}
	
	// Find coincidences in the config
	function findcoincidences() {
			// Reset coincidences
			coincidences = [];
			
			// Find horizontal coincidences
			for (let j=0; j<config.rows; j++) {
					// Start with a single tile, cluster of 1
					let matchlength = 1;
					for (let i=0; i<config.columns; i++) {
							let checkcluster = false;
							
							if (i == config.columns-1) {
									// Last tile
									checkcluster = true;
							} else {
									// Check the type of the next tile
									if (config.stone[i][j].type == config.stone[i+1][j].type &&
											config.stone[i][j].type != -1) {
											// Same type as the previous tile, increase matchlength
											matchlength += 1;
									} else {
											// Different type
											checkcluster = true;
									}
							}
							
							// Check if there was a cluster
							if (checkcluster) {
									if (matchlength >= 3) {
											// Found a horizontal cluster
											coincidences.push({ column: i+1-matchlength, row:j,
																			length: matchlength, horizontal: true });
									}
									
									matchlength = 1;
							}
					}
			}

			// Find vertical coincidences
			for (let i=0; i<config.columns; i++) {
					// Start with a single tile, cluster of 1
					let matchlength = 1;
					for (let j=0; j<config.rows; j++) {
							let checkcluster = false;
							
							if (j == config.rows-1) {
									// Last tile
									checkcluster = true;
							} else {
									// Check the type of the next tile
									if (config.stone[i][j].type == config.stone[i][j+1].type &&
											config.stone[i][j].type != -1) {
											// Same type as the previous tile, increase matchlength
											matchlength += 1;
									} else {
											// Different type
											checkcluster = true;
									}
							}
							
							// Check if there was a cluster
							if (checkcluster) {
									if (matchlength >= 3) {
											// Found a vertical cluster
											coincidences.push({ column: i, row:j+1-matchlength,
																			length: matchlength, horizontal: false });
									}
									
									matchlength = 1;
							}
					}
			}
	}
	
	// Find available moves
	function findMoves() {
			// Reset moves
			moves = [];
			
			// Check horizontal swaps
			for (let j=0; j<config.rows; j++) {
					for (let i=0; i<config.columns-1; i++) {
							// Swap, find coincidences and swap back
							swap(i, j, i+1, j);
							findcoincidences();
							swap(i, j, i+1, j);
							
							// Check if the swap made a cluster
							if (coincidences.length > 0) {
									// Found a move
									moves.push({column1: i, row1: j, column2: i+1, row2: j});
							}
					}
			}
			
			// Check vertical swaps
			for (let i=0; i<config.columns; i++) {
					for (let j=0; j<config.rows-1; j++) {
							// Swap, find coincidences and swap back
							swap(i, j, i, j+1);
							findcoincidences();
							swap(i, j, i, j+1);
							
							// Check if the swap made a cluster
							if (coincidences.length > 0) {
									// Found a move
									moves.push({column1: i, row1: j, column2: i, row2: j+1});
							}
					}
			}
			
			// Reset coincidences
			coincidences = [];
	}
	
	// Loop over the cluster stone and execute a function
	function loopcoincidences(func) {
			for (let i=0; i<coincidences.length; i++) {
					//  { column, row, length, horizontal }
					let cluster = coincidences[i];
					let coffset = 0;
					let roffset = 0;
					for (let j=0; j<cluster.length; j++) {
							func(i, cluster.column+coffset, cluster.row+roffset, cluster);
							
							if (cluster.horizontal) {
									coffset++;
							} else {
									roffset++;
							}
					}
			}
	}
	
	// Remove the coincidences
	function removecoincidences() {
			// Change the type of the stone to -1, indicating a removed tile
			loopcoincidences(function(index, column, row, cluster) { config.stone[column][row].type = -1; });

			// Calculate how much a tile should be shifted downwards
			for (let i=0; i<config.columns; i++) {
					let shift = 0;
					for (let j=config.rows-1; j>=0; j--) {
							// Loop from bottom to top
							if (config.stone[i][j].type == -1) {
									// Tile is removed, increase shift
									shift++;
									config.stone[i][j].shift = 0;
							} else {
									// Set the shift
									config.stone[i][j].shift = shift;
							}
					}
			}
	}
	
	// Shift stone and insert new stone
	function shiftstone() {
			// Shift stone
			for (let i=0; i<config.columns; i++) {
					for (let j=config.rows-1; j>=0; j--) {
							// Loop from bottom to top
							if (config.stone[i][j].type == -1) {
									// Insert new random tile
									config.stone[i][j].type = getRandomTile();
							} else {
									// Swap tile to shift it
									let shift = config.stone[i][j].shift;
									if (shift > 0) {
											swap(i, j, i, j+shift);
									}
							}
							
							// Reset shift
							config.stone[i][j].shift = 0;
					}
			}
	}
	
	// Get the tile under the mouse
	function getMouseTile(pos) {
			// Calculate the index of the tile
			let tx = Math.floor((pos.x - config.x) / config.stoneWidth);
			let ty = Math.floor((pos.y - config.y) / config.stoneHeight);
			
			// Check if the tile is valid
			if (tx >= 0 && tx < config.columns && ty >= 0 && ty < config.rows) {
					// Tile is valid
					return {
							valid: true,
							x: tx,
							y: ty
					};
			}
			
			// No valid tile
			return {
					valid: false,
					x: 0,
					y: 0
			};
	}
	
	// Check if two stone can be swapped
	function canSwap(x1, y1, x2, y2) {
			// Check if the tile is a direct neighbor of the select tile
			if ((Math.abs(x1 - x2) == 1 && y1 == y2) ||
					(Math.abs(y1 - y2) == 1 && x1 == x2)) {
					return true;
			}
			
			return false;
	}
	
	// Swap two stone in the config
	function swap(x1, y1, x2, y2) {
			let typeswap = config.stone[x1][y1].type;
			config.stone[x1][y1].type = config.stone[x2][y2].type;
			config.stone[x2][y2].type = typeswap;
	}
	
	// Swap two stone as a player action
	function mouseSwap(c1, r1, c2, r2) {
			// Save the current move
			currentmove = {column1: c1, row1: r1, column2: c2, row2: r2};
	
			// Deselect
			config.selectStone.select = false;
			
			// Start animation
			animationstate = 2;
			animationtime = 0;
			gamestate = gamestates.resolve;
	}
	
	// On mouse movement
	function onMouseMove(e) {
			// Get the mouse position
			let pos = getMousePos(canvas, e);
			
			// Check if we are dragging with a tile select
			if (drag && config.selectStone.select) {
					// Get the tile under the mouse
					let mt = getMouseTile(pos);
					if (mt.valid) {
							// Valid tile
							
							// Check if the stone can be swapped
							if (canSwap(mt.x, mt.y, config.selectStone.column, config.selectStone.row)){
									// Swap the stone
									mouseSwap(mt.x, mt.y, config.selectStone.column, config.selectStone.row);
							}
					}
			}
	}
	
	// On mouse button click
	function onMouseDown(e) {
			// Get the mouse position
			let pos = getMousePos(canvas, e);
			
			// Start dragging
			if (!drag) {
					// Get the tile under the mouse
					 let mt = getMouseTile(pos);
					
					if (mt.valid) {
							// Valid tile
							let swapped = false;
							if (config.selectStone.select) {
									if (mt.x == config.selectStone.column && mt.y == config.selectStone.row) {
											// Same tile select, deselect
											config.selectStone.select = false;
											drag = true;
											return;
									} else if (canSwap(mt.x, mt.y, config.selectStone.column, config.selectStone.row)){
											// stone can be swapped, swap the stone
											mouseSwap(mt.x, mt.y, config.selectStone.column, config.selectStone.row);
											swapped = true;
									}
							}
							
							if (!swapped) {
									// Set the new select tile
									config.selectStone.column = mt.x;
									config.selectStone.row = mt.y;
									config.selectStone.select = true;
							}
					} else {
							// Invalid tile
							config.selectStone.select = false;
					}

					// начать перетаскивание
					drag = true;
			}
			
			
	}

	function onMouseUp(e) {
		// Сбросить перетаскивание
		drag = false;
	}
	
	function onMouseOut(e) {
		// Сбросить перетаскивание
		drag = false;
	}
	
	// Получаем позицию мыши
	function getMousePos(canvas, e) {
			let rect = canvas.getBoundingClientRect();
			return {
					x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
					y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
			};
	}
	
	init();


}