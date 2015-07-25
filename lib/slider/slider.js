(function() {
	window.makeSlider = function(node, startHandler, moveHandler, dropHandler) {
		if (dropHandler === undefined && moveHandler == undefined) {
			moveHandler = startHandler;
			dropHandler = moveHandler;
			startHandler = function(){};
		} else if (dropHandler === undefined) {
			dropHandler = moveHandler;
			moveHandler = startHandler;
			startHandler = function(){};
		}
		node.addEventListener("click", function(e) {
			if (e.button !== 0) return;
			var xPos = e.offsetX;
			if (xPos === undefined) {
				xPos = e.layerX;
			}
			var percent = xPos / node.clientWidth;
			dropHandler(percent);
		});

		var elemLeft = 0;
		var elemRight = 0;
		var percent = 0;
		function handleMove(e) {
			e.preventDefault();
			e.stopPropagation();
			var position = Math.min(Math.max(elemLeft, e.clientX), elemRight);
			var relPos = position - elemLeft;
			percent = relPos / (elemRight - elemLeft);
			moveHandler(percent);
		}

		function removeHandle() {
			dropHandler(percent);
			document.body.removeEventListener("mousemove", handleMove);
			document.body.removeEventListener("mouseup", removeHandle);
		}

		node.addEventListener("mousedown", function(e) {
			if (e.button !== 0) return;
			var offset = e.offsetX;
			if (offset === undefined) {
				offset = e.layerX;
			}
			elemLeft = e.clientX - offset;
			elemRight = elemLeft + node.clientWidth;

			startHandler();

			document.body.addEventListener("mousemove", handleMove);
			document.body.addEventListener("mouseup", removeHandle);
		});
	};
})();
