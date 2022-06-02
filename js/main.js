'use strict';
import {AJAXstorage} from './ajax.js';
import {showResult} from './render.js';

export let Scorege = new AJAXstorage();
let piz = document.getElementById('piz');

window.onbeforeunload = function () {
	game();
	return false;
};

export function game() {
	let canvas = document.getElementById('mycanvas');
	if (!canvas) {
		console.log('Ищем канвас');
		return;
	}
	let ctx = canvas.getContext('2d');

	let lastframe = 0;

	let drag = false;

	let config = {
		y: 2, // вертикальный отступ
		x: 2, // горизонтальный отступ
		columns: 9, // Кол-во столбцов
		rows: 9, // Кол-во рядов
		stoneWidth: 50, // ширина камешка
		stoneHeight: 50, // высота камешка
		stone: [], // двумерный массив камешков
		selectStone: {
			select: false,
			column: 0,
			row: 0
		}
	};

	let stoneColors = [
		[255, 128, 128], //цвета камешков
		[128, 255, 128],
		[128, 128, 255],
		[255, 255, 128],
		[255, 128, 255],
		[128, 255, 255],
		[255, 255, 255]
	];

	// совпадения и ходы
	let coincidences = []; // { column, row, length, horizontal }
	let moves = []; // { column1, row1, column2, row2 }

	// Текущий ход
	let currentmove = {
		column1: 0,
		row1: 0,
		column2: 0,
		row2: 0
	};
	// Игровые события
	let gamestates = {
		init: 0,
		ready: 1,
		resolve: 2
	};
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
	function style() {
		canvas.style.display = 'block';
		canvas.style.margin = '0 auto';
	}
	style();

	//адаптив
	function adaptive() {
		let bodyWidth = window.innerWidth;
		console.log(bodyWidth);
		if (bodyWidth <= 600) {
			config.columns = 8;
			config.rows = 8;
			canvas.width = 405;
			canvas.height = 405;
		}
		if (bodyWidth <= 513) {
			config.columns = 6;
			config.rows = 6;
			canvas.width = 305;
			canvas.height = 305;
		}
	}
	adaptive();

	// Инициализируем игру
	function init() {
		// Мышиные события
		canvas.addEventListener('mousemove', onMouseMove);
		canvas.addEventListener('mousedown', onMouseDown);
		canvas.addEventListener('mouseup', onMouseUp);
		canvas.addEventListener('mouseout', onMouseOut);

		// Инициализируем двумерный массив камней
		for (let i = 0; i < config.columns; i++) {
			config.stone[i] = [];
			for (let j = 0; j < config.rows; j++) {
				// Определяем тип камня и параметр сдвига для анимации
				config.stone[i][j] = {
					type: 0,
					shift: 0
				};
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

		if (gamestate === gamestates.ready) {
			// Игра готова для ввода игроком

			// Проверка на окончание игры
			if (moves.length <= 0) {
				gameover = true;
			}
		} else if (gamestate === gamestates.resolve) {
			// Игра занята решениями и анимацией для совпадений, решает дела красиво короче
			animationtime += dt;

			if (animationstate === 0) {
				// совпадения нужно найти и удалить
				if (animationtime > animationtimetotal) {
					// Находим совпадения
					findCoincidences();

					if (coincidences.length > 0) {
						// Добавляем очки к счету
						countingScore();

						// совпадения найдены, удаляем их
						removeCoincidences();

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
					shiftStone();

					// Ищем новые совпадения
					animationstate = 0;
					animationtime = 0;

					// Проверяем, есть ли новые совпадения
					findCoincidences();
					if (coincidences.length <= 0) {
						// Анимация завершена
						gamestate = gamestates.ready;
					}
				}
			} else if (animationstate === 2) {
				// Анимация замены камня
				if (animationtime > animationtimetotal) {
					// Поменять камень
					swap(currentmove.column1, currentmove.row1, currentmove.column2, currentmove.row2);

					// Проверяем, сделал ли свaп кластер
					findCoincidences();
					if (coincidences.length > 0) {
						// Валидный обмен, найдено одно или несколько совпадений
						// Подготавливаем состояния анимации
						animationstate = 0;
						animationtime = 0;
						gamestate = gamestates.resolve;
					} else {
						// Неверный свaп, анимация перемотки назад
						animationstate = 3;
						animationtime = 0;
					}
					// Обновление ходов и совпадений
					findMoves();
					findCoincidences();
				}
			} else if (animationstate === 3) {
				// Перемотать анимацию замены назад
				if (animationtime > animationtimetotal) {
					// Неверный свaп, свaп обратно
					swap(currentmove.column1, currentmove.row1, currentmove.column2, currentmove.row2);
					// Анимация завершена
					gamestate = gamestates.ready;
				}
			}
			// Обновление ходов и совпадений
			findMoves();
			findCoincidences();
		}
	}
	//делаем скор
	function createScore() {
		let scoreTXT = document.createElement('span');
		piz.appendChild(scoreTXT);
		scoreTXT.setAttribute('id', 'create-score');
		scoreTXT.innerHTML = `SCORE:`;
	}
	createScore();

	//подсчет скора
	function countingScore() {
		for (let i = 0; i < coincidences.length; i++) {
			score = score += 100;
			console.log(score);
			var song = new Audio();
			song.src = './audio/scrr.mp3';
			song.play();
		}
		let scoreSpan = document.createElement('span');
		piz.appendChild(scoreSpan);
		scoreSpan.setAttribute('id', 'counting-score');
		document.getElementById('counting-score').innerHTML = score;
	}

	function drawCenterText(text, x, y, width) {
		let textdim = ctx.measureText(text);
		ctx.fillText(text, x + (width - textdim.width) / 2, y);
	}

	// Визуализируем игру
	function render() {
		// Рисуем рамку
		drawFrame();
		// Отрисовка кластеров
		renderStone();
		drawerDrawer();
	}

	function drawerDrawer() {
		if (gameover === true) {
			let levelwidth = config.columns * config.stoneWidth;
			let levelheight = config.rows * config.stoneHeight;
			ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
			ctx.fillRect(config.x, config.y, levelwidth, levelheight);

			ctx.fillStyle = '#ffffff';
			ctx.font = '24px Verdana';
			drawCenterText('Game Over!', config.y, config.x + levelheight / 2 + 10, levelwidth);
		}
	}

	let ajaxbtn = document.getElementById('ajaxbtn');
	ajaxbtn.addEventListener('click', function () {
		let user = prompt('Введите свое имя', '');
		let scores = score;
		Scorege.addValue(user, scores);
	});
	showResult();

	// Рисуем рамку с рамкой)))
	function drawFrame() {
		// Рисуем фон и границу
		ctx.fillStyle = '#d0d0d0';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#e8eaec';
		ctx.fillRect(1, 1, canvas.width - 2, canvas.height - 2);
	}

	// Рендеринг камня
	function renderStone() {
		for (let i = 0; i < config.columns; i++) {
			for (let j = 0; j < config.rows; j++) {
				// Получаем сдвиг камня для анимации
				let shift = config.stone[i][j].shift;
				// Рассчитываем координаты камня
				let coord = getTileCoordinate(i, j, 0, (animationtime / animationtimetotal) * shift);
				// Проверяем, есть ли камень
				if (config.stone[i][j].type >= 0) {
					// Получаем цвет камня
					let col = stoneColors[config.stone[i][j].type];
					// Рисуем камень цветом
					drawTile(coord.tilex, coord.tiley, col[0], col[1], col[2]);
				}
				// Рисуем камень выбора
				if (config.selectStone.select) {
					if (config.selectStone.column === i && config.selectStone.row === j) {
						// Рисуем красный камень
						drawTile(coord.tilex, coord.tiley, 255, 0, 0);
					}
				}
			}
		}

		// Визуализировать анимацию подкачки
		if (gamestate === gamestates.resolve && (animationstate === 2 || animationstate === 3)) {
			// Вычисляем сдвиг по осям x и y
			let shiftx = currentmove.column2 - currentmove.column1;
			let shifty = currentmove.row2 - currentmove.row1;
			// Первый камень
			let coord1 = getTileCoordinate(currentmove.column1, currentmove.row1, 0, 0);
			let coord1shift = getTileCoordinate(currentmove.column1, currentmove.row1, (animationtime / animationtimetotal) * shiftx, (animationtime / animationtimetotal) * shifty);
			let col1 = stoneColors[config.stone[currentmove.column1][currentmove.row1].type];
			// Второй камеь
			let coord2 = getTileCoordinate(currentmove.column2, currentmove.row2, 0, 0);
			let coord2shift = getTileCoordinate(currentmove.column2, currentmove.row2, (animationtime / animationtimetotal) * -shiftx, (animationtime / animationtimetotal) * -shifty);
			let col2 = stoneColors[config.stone[currentmove.column2][currentmove.row2].type];
			// Рисуем черный фон
			drawTile(coord1.tilex, coord1.tiley, 0, 0, 0);
			drawTile(coord2.tilex, coord2.tiley, 0, 0, 0);
			// Изменяем порядок в зависимости от состояния анимации
			if (animationstate === 2) {
				// Рисуем камень
				drawTile(coord1shift.tilex, coord1shift.tiley, col1[0], col1[1], col1[2]);
				drawTile(coord2shift.tilex, coord2shift.tiley, col2[0], col2[1], col2[2]);
			} else {
				// Рисуем камень
				drawTile(coord2shift.tilex, coord2shift.tiley, col2[0], col2[1], col2[2]);
				drawTile(coord1shift.tilex, coord1shift.tiley, col1[0], col1[1], col1[2]);
			}
		}
	}

	// Получаем координату камня
	function getTileCoordinate(column, row, columnoffset, rowoffset) {
		let tilex = config.x + (column + columnoffset) * config.stoneWidth;
		let tiley = config.y + (row + rowoffset) * config.stoneHeight;
		return {
			tilex: tilex,
			tiley: tiley
		};
	}

	// Рисуем камень цветом
	function drawTile(x, y, r, g, b) {
		ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
		ctx.fillRect(x + 2, y + 2, config.stoneWidth - 4, config.stoneHeight - 4);
	}

	// Начать новую игру
	function newGame() {
		// Сбросить счет
		score = 0;
		// Устанавливаем состояние игры в состояние готовности
		gamestate = gamestates.ready;
		// Сброс игры окончен
		gameover = false;
		// Создаем конфиг
		createconfig();
		// Находим начальные совпадения и ходы
		findMoves();
		findCoincidences();
	}

	// Создаем случайный конфиг
	function createconfig() {
		let done = false;
		// Продолжаем генерировать конфиги, пока они не станут правильными
		while (!done) {
			// Создаем конфиг со случайным камнем
			for (let i = 0; i < config.columns; i++) {
				for (let j = 0; j < config.rows; j++) {
					config.stone[i][j].type = getRandomTile();
				}
			}

			// Разрешить совпадения
			resolveCoincidences();
			// Проверяем, есть ли допустимые ходы
			findMoves();
			// Готово, когда есть правильный ход
			if (moves.length > 0) {
				done = true;
			}
		}
	}

	// Получаем случайный камень
	function getRandomTile() {
		return Math.floor(Math.random() * stoneColors.length);
	}

	// Убираем совпадения и вставляем камень
	function resolveCoincidences() {
		// Проверяем на совпадения
		findCoincidences();

		// Пока есть совпадения
		while (coincidences.length > 0) {

			// Удаляем совпадения
			removeCoincidences();
			// Сдвиг камня
			shiftStone();
			// Проверяем, остались ли совпадения
			findCoincidences();
		}
	}

	// Находим совпадения в конфиге
	function findCoincidences() {
		// Сброс совпадений
		coincidences = [];

		// Находим совпадения по горизонтали
		for (let j = 0; j < config.rows; j++) {
			// Начать с одного камня, кластер из 1
			let matchlength = 1;
			for (let i = 0; i < config.columns; i++) {
				let checkcluster = false;

				if (i === config.columns - 1) {
					// Последний камень
					checkcluster = true;
				} else {
					// Проверяем тип следующего камня
					if (config.stone[i][j].type === config.stone[i + 1][j].type &&
						config.stone[i][j].type != -1) {
						// Тот же тип, что и у предыдущего камня, увеличьте длину совпадения
						matchlength += 1;
					} else {
						// Другой тип
						checkcluster = true;
					}
				}

				// Проверяем, был ли кластер
				if (checkcluster) {
					if (matchlength >= 3) {
						// Найден горизонтальный кластер
						coincidences.push({
							column: i + 1 - matchlength,
							row: j,
							length: matchlength,
							horizontal: true
						});
					}
					matchlength = 1;
				}
			}
		}

		// Находим вертикальные совпадения
		for (let i = 0; i < config.columns; i++) {
			// Начать с одного камня, кластер из 1
			let matchlength = 1;
			for (let j = 0; j < config.rows; j++) {
				let checkcluster = false;

				if (j === config.rows - 1) {
					// Последний камень
					checkcluster = true;
				} else {
					// Проверяем тип следующего камня
					if (config.stone[i][j].type === config.stone[i][j + 1].type &&
						config.stone[i][j].type != -1) {
						// Тот же тип, что и у предыдущего камня, увеличьте длину совпадения
						matchlength += 1;
					} else {
						// Другой тип
						checkcluster = true;
					}
				}

				// Проверяем, был ли кластер
				if (checkcluster) {
					if (matchlength >= 3) {
						// Найден вертикальный кластер
						coincidences.push({
							column: i,
							row: j + 1 - matchlength,
							length: matchlength,
							horizontal: false
						});
					}
					matchlength = 1;
				}
			}
		}
	}

	// Находим доступные ходы
	function findMoves() {
		// Сбросить ходы
		moves = [];

		// Проверяем горизонтальные свапы
		for (let j = 0; j < config.rows; j++) {
			for (let i = 0; i < config.columns - 1; i++) {
				// Поменять местами, найти совпадения и поменять местами обратно
				swap(i, j, i + 1, j);
				findCoincidences();
				swap(i, j, i + 1, j);

				// Проверяем, сделал ли своп кластер
				if (coincidences.length > 0) {
					// Найден ход
					moves.push({
						column1: i,
						row1: j,
						column2: i + 1,
						row2: j
					});
				}
			}
		}

		// Проверяем вертикальные свопы
		for (let i = 0; i < config.columns; i++) {
			for (let j = 0; j < config.rows - 1; j++) {
				// Поменять местами, найти совпадения и поменять местами обратно
				swap(i, j, i, j + 1);
				findCoincidences();
				swap(i, j, i, j + 1);

				// Проверяем, сделал ли свап кластер
				if (coincidences.length > 0) {
					// Найден ход
					moves.push({
						column1: i,
						row1: j,
						column2: i,
						row2: j + 1
					});
				}
			}
		}

		// Сброс совпадений
		coincidences = [];
	}

	// Перебираем кластерный камень и выполняем функцию
	function loopCoincidences(func) {
		for (let i = 0; i < coincidences.length; i++) {
			//  { column, row, length, horizontal }
			let cluster = coincidences[i];
			let coffset = 0;
			let roffset = 0;
			for (let j = 0; j < cluster.length; j++) {
				func(i, cluster.column + coffset, cluster.row + roffset, cluster);

				if (cluster.horizontal) {
					coffset++;
				} else {
					roffset++;
				}
			}
		}
	}

	// Удаляем совпадения
	function removeCoincidences() {
		// Изменяем тип камня на -1, что указывает на удаленный камень
		loopCoincidences(function (index, column, row, cluster) {
			config.stone[column][row].type = -1;
		});

		// Рассчитываем, насколько камень должен быть смещен вниз
		for (let i = 0; i < config.columns; i++) {
			let shift = 0;
			for (let j = config.rows - 1; j >= 0; j--) {
				// Цикл снизу вверх
				if (config.stone[i][j].type == -1) {
					// Камень удаляется, увеличиваем сдвиг
					shift++;
					config.stone[i][j].shift = 0;
				} else {
					// Установить сдвиг
					config.stone[i][j].shift = shift;
				}
			}
		}
	}

	// Сдвинуть камень и вставить новый камень
	function shiftStone() {
		// Сдвиг камня
		for (let i = 0; i < config.columns; i++) {
			for (let j = config.rows - 1; j >= 0; j--) {
				// Цикл снизу вверх
				if (config.stone[i][j].type === -1) {
					// Вставляем новый случайный камень
					config.stone[i][j].type = getRandomTile();
				} else {
					// Поменяйте камни местами, чтобы сдвинуть их
					let shift = config.stone[i][j].shift;
					if (shift > 0) {
						swap(i, j, i, j + shift);
					}
				}
				// Сбросить смену
				config.stone[i][j].shift = 0;
			}
		}
	}

	// Получить камень под мышью
	function getMouseTile(pos) {
		// Рассчитываем индекс камня
		let tx = Math.floor((pos.x - config.x) / config.stoneWidth);
		let ty = Math.floor((pos.y - config.y) / config.stoneHeight);

		// Проверяем, действителен ли камень
		if (tx >= 0 && tx < config.columns && ty >= 0 && ty < config.rows) {
			// Камень действителен
			return {
				valid: true,
				x: tx,
				y: ty
			};
		}

		// Нет допустимого камня
		return {
			valid: false,
			x: 0,
			y: 0
		};
	}

	// Проверяем, можно ли поменять местами два камня
	function canSwap(x1, y1, x2, y2) {
		// Проверяем, является ли камень прямым соседом выбранного камня
		if ((Math.abs(x1 - x2) === 1 && y1 === y2) ||
			(Math.abs(y1 - y2) === 1 && x1 === x2)) {
			return true;
		}

		return false;
	}

	// Поменять местами два камня в конфиге
	function swap(x1, y1, x2, y2) {
		let typeswap = config.stone[x1][y1].type;
		config.stone[x1][y1].type = config.stone[x2][y2].type;
		config.stone[x2][y2].type = typeswap;
	}

	// Поменять местами два камня как действие игрока
	function mouseSwap(c1, r1, c2, r2) {
		// Сохраняем текущий ход
		currentmove = {
			column1: c1,
			row1: r1,
			column2: c2,
			row2: r2
		};

		// Отменить выбор
		config.selectStone.select = false;

		// Запустить анимацию
		animationstate = 2;
		animationtime = 0;
		gamestate = gamestates.resolve;
	}

	// При движении мыши
	function onMouseMove(e) {
		// Получить позицию мыши
		let pos = getMousePos(canvas, e);

		// Проверяем, перетаскиваем ли мы камень select
		if (drag && config.selectStone.select) {
			// Получить камень под мышью
			let mt = getMouseTile(pos);
			if (mt.valid) {
				// Действительный камень

				// Проверяем, можно ли поменять камень
				if (canSwap(mt.x, mt.y, config.selectStone.column, config.selectStone.row)) {
					// Поменять камень
					mouseSwap(mt.x, mt.y, config.selectStone.column, config.selectStone.row);
				}
			}
		}
	}

	// При нажатии кнопки мыши
	function onMouseDown(e) {
		// Получить позицию мыши
		let pos = getMousePos(canvas, e);

		// Начать перетаскивание
		if (!drag) {
			// Получить камень под мышью
			let mt = getMouseTile(pos);

			if (mt.valid) {
				// Действительный камень
				let swapped = false;
				if (config.selectStone.select) {
					if (mt.x === config.selectStone.column && mt.y === config.selectStone.row) {
						// Выбор того же камня, отмена выбора
						config.selectStone.select = false;
						drag = true;
						return;
					} else if (canSwap(mt.x, mt.y, config.selectStone.column, config.selectStone.row)) {
						// камень можно поменять местами, поменять местами камень
						mouseSwap(mt.x, mt.y, config.selectStone.column, config.selectStone.row);
						swapped = true;
					}
				}

				if (!swapped) {
					// Установить новый выбранный камень 
					config.selectStone.column = mt.x;
					config.selectStone.row = mt.y;
					config.selectStone.select = true;
				}
			} else {
				// Неверный камень
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
			x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
			y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
		};
	}

	init();
}