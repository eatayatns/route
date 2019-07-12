var pos = { start: null, end: null }
var routes = [];
var maxSize = 19;

//объявляем функцию .
//parentId - идентификатор основного элемента
function city(parentId) {
	//размер элемента
	
	//иниацилизация класса для хранения определений позиций домов
	var table = {};
	//цикл по строкам
	for (var row = 0; row <= maxSize; row++) {
		table[row] = {};
		//цикл по столбцам
		for (var col = 0; col <= maxSize; col++) {
			//случайным образом проставляем признак наличия дома
			if (isEven(col)) {
				table[row][col] = 0;
			} else {
				table[row][col] = random();
			}
		}
	}
	var $main = document.getElementById(parentId);
	while ($main.firstChild) {
		$main.removeChild($main.firstChild);
	}

	for (var i = 0; i <= maxSize; i++) {
		var $row = document.createElement("div");
		$row.className = "row";
		for (var j = 0; j <= maxSize; j++) {
			var $cell = document.createElement("div");
			//$cell.textContent = ""+i+"_"+j;
			$cell.dataset.row = i;
			$cell.dataset.col = j;
			$cell.id = i + "_" + j;
			$cell.onclick = cell_click;
			if (table[i][j]) {
				$cell.className = "cell house";
				table[i][j].house = 1;
			}
			else {
				$cell.className = "cell";
			}
			$row.appendChild($cell);
		}
		$main.appendChild($row);
	}

	for (var i = 0; i <= maxSize; i++) {
		for (var j = 0; j <= maxSize; j++) {
			if (table[i][j] == 1) {

				if (i - 1 >= 0 && table[i - 1][j] == 0) {
					setRoad(i - 1, j);
					var s = i - 1;
					setRoad(s, j);
					if (j - 1 >= 0 && table[s][j - 1] == 0) {
						setRoad(s, j - 1);
					}
					if (j + 1 <= maxSize && table[s][j + 1] == 0) {
						setRoad(s, j + 1);
					}
				}
				if (i + 1 <= maxSize && table[i + 1][j] == 0) {
					var s = i + 1;
					setRoad(s, j);
					if (j - 1 >= 0 && table[s][j - 1] == 0) {
						setRoad(s, j - 1);
					}
					if (j + 1 <= maxSize && table[s][j + 1] == 0) {
						setRoad(s, j + 1);
					}
				}
				if (j - 1 >= 0 && table[i][j - 1] == 0) {
					setRoad(i, j - 1);
				}
				if (j + 1 <= maxSize && table[i][j + 1] == 0) {
					setRoad(i, j + 1);
				}

				if (j + 1 <= maxSize && table[i][j + 1] == 0) {
					setRoad(i, j + 1);
				}
			}
		}
	}

	for (var i = 0; i <= maxSize; i++) {
		for (var j = 0; j <= maxSize; j++) {
			var $cell = document.getElementById(i + "_" + j);
			if ($cell.className == "cell") {
				$cell.className = "cell tree";
			}
		}
	}
}

function setRoad(row, col) {
	var $id = row + "_" + col;
	var $cell = document.getElementById($id);
	if ($cell) {
		$cell.className = "cell road";
		$cell.dataset.isRoad = true;;
	}
}

function random() {
	return Math.round(Math.random());;
}

function isEven(value) {
	if (value % 2 == 0)
		return true;
	else
		return false;
}

function cell_click() {
	var $this = this;
	if ($this.className.startsWith("cell road")) {
		if (pos.start != null && pos.end != null) {
			pos.end.className = "cell road";
			pos.start.className = "cell road";
			pos.start = null;
			pos.end = null;
			unmark_route();
		}
		else {
			if (pos.start == null) {
				pos.start = $this;
				pos.start.className = "cell road start"
			}
			else {
				pos.end = $this;
				pos.end.className = "cell road end"
			}
		}
	}
}

function route() {
	if (pos.start == null || pos.end == null) {
		alert("Incorrect route points!");
		return;
	}
	unmark_route();
	caclucate_route();
	mark_route();
}

function unmark_route() {
	for (var i = 0; i < routes.length; i++) {
		var item = routes[i];
		item.className = "cell road";	
	}
	routes.length = 0;
}

function mark_route() {
	for (var i = 0; i < routes.length - 1; i++) {
		var item = routes[i];
		if (item && item.className == "cell road"){
			item.className = "cell road point";
		}	
	}
}

function caclucate_route() {
	var dstRow = Number.parseInt(pos.end.dataset.row);
	var dstCol = Number.parseInt(pos.end.dataset.col);
	var curRow = Number.parseInt(pos.start.dataset.row); 
	var curCol = Number.parseInt(pos.start.dataset.col); 
	var grid = new PF.Grid(maxSize+1, maxSize+1); 
	for (var i = 0; i <= maxSize; i++) {
		for (var j = 0; j <= maxSize; j++) {
			grid.setWalkableAt(i, j,  isRoadCell(i,j));
		}
	}
	var finder = new PF.AStarFinder();
	var path = finder.findPath(curRow, curCol, dstRow, dstCol, grid);

	for (var i = 0; i <= path.length-1; i++) {
		var $id = path[i][0] + "_" + path[i][1];
		var $cell = document.getElementById($id);
		if ($cell) {
			routes.push($cell);
		}
	}
}

function isRoadCell(row, col) {
	var $id = row + "_" + col;
	var $cell = document.getElementById($id);
	if ($cell) {
		return $cell.dataset.isRoad;
	}
	return false;
}

function drive(parentId){
	var $main = document.getElementById(parentId);
	var $car = document.createElement("div");
	$car.className = "car";
	$car.id = "car";
	$main.appendChild($car);
	var index = 0; 
	var run = setInterval (function () {
		index++;
		if (index >= routes.length) { 
			clearInterval (run);
			$main.removeChild($car);
		 }
		 else{
			var $item = routes[index];
			var point = GetScreenCordinates($item);
			$car.style="left:"+(point.left+10)+"px; top:"+(point.top+10)+"px";
		 }
	}, 1000);
}

function GetScreenCordinates(obj) {
	var p = {};
	p.left = obj.offsetLeft;
	p.top = obj.offsetTop;
	while (obj.offsetParent) {
		p.left = p.left + obj.offsetParent.offsetLeft;
		p.top = p.top + obj.offsetParent.offsetTop;
		if (obj == document.getElementsByTagName("body")[0]) {
			break;
		}
		else {
			obj = obj.offsetParent;
		}
	}
	return p;
}