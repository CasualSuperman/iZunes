(function() {
	function calculateScrollbarSize(node) {
		var totalHeight = node.scrollHeight;
		var visibleHeight = node.clientHeight;
		var percent = visibleHeight/totalHeight;
		if (percent >= 1) {
			return 0;
		}
		return percent * 100;
	}
	function calculateScrollbarPosition(node, bar) {
		var totalHeight = node.scrollHeight;
		var visibleHeight = node.clientHeight;
		var percentScrolled = (node.scrollTop) / (totalHeight - visibleHeight);
		var barHeight = bar.clientHeight;
		var barSlideRange = visibleHeight - barHeight;
		var barScrollPos = barSlideRange * percentScrolled;
		return barScrollPos + node.scrollTop;
	}

	function watchNodeAndUpdateScrollbar(node, scrollbar) {
	}
	function updateSize(node, scrollbar) {
		var timeout = null;
		return function() {
			timeout && clearTimeout(timeout);
			timeout = setTimeout(function() {
				scrollbar.style.display = "none";
				node.scrollTop = Math.min(node.scrollTop, node.scrollHeight - node.clientHeight);
				scrollbar.style.height = calculateScrollbarSize(node)+"%";
				scrollbar.style.top = calculateScrollbarPosition(node, scrollbar)+"px";
				scrollbar.style.display = "";
			}, 100);
		}
	}
	window.makeScroller = function(node) {
		node.style.overflowY = "hidden";
		node.classList.add("scrollerContainer");
		var scrollbar = document.createElement("div");
		scrollbar.classList.add("scrollerBar");
		node.appendChild(scrollbar);
		node.addEventListener("wheel", function(e) {
			var mode = 1;
			switch (e.deltaMode) {
			case 1:
				mode = document.defaultView.getComputedStyle(node, null).getPropertyValue("font-size").replace(/\D/g, "");
			}
			var amountToScroll = e.deltaY * mode;
			var targetScrollPos = Math.min(Math.max(0, node.scrollTop + amountToScroll), node.scrollHeight - node.clientHeight);
			node.scrollTop = targetScrollPos;
			scrollbar.style.top = calculateScrollbarPosition(node, scrollbar)+"px";
		});
		var changeFunc = updateSize(node, scrollbar);
		new MutationObserver(changeFunc).observe(node, {childList:true});
		window.addEventListener("resize", changeFunc);
		var moveStart = 0;
		function handleMove(e) {
			e.preventDefault();
			e.stopPropagation();
			var amount = e.clientY - moveStart;
			moveStart = e.clientY;
			var currentRelativePos = scrollbar.style.top - node.scrollTop;
			var targetRelativePos = currentRelativePos + e.movementY;
			if (targetRelativePos <= 0) {
				node.scrollTop = 0;
				scrollbar.style.top = 0;
				return;
			}
			if (targetRelativePos + scrollbar.clientHeight > node.clientHeight) {
				node.scrollTop = node.scrollHeight - node.clientHeight;
				scrollbar.style.top = node.scrollHeight - scrollbar.clientHeight;
				return;
			}
			// Actual math.
			var percentScrolled = amount/node.clientHeight;
			var scrollableArea = node.scrollHeight;
			var amountToScroll = percentScrolled * scrollableArea;
			node.scrollTop += amountToScroll;
			scrollbar.style.top = calculateScrollbarPosition(node, scrollbar)+"px";
		}
		function removeHandle(e) {
			document.body.removeEventListener("mousemove", handleMove);
			document.body.removeEventListener("click", removeHandle, true);
			scrollbar.classList.remove("hover");
			e.stopPropagation();
		}
		scrollbar.addEventListener("mousedown", function(e) {
			scrollbar.classList.add("hover");
			moveStart = e.clientY;
			document.body.addEventListener("mousemove", handleMove);
			document.body.addEventListener("click", removeHandle, true);
			e.stopPropagation();
		});
		scrollbar.style.height = calculateScrollbarSize(node) + "%";
		watchNodeAndUpdateScrollbar(node, scrollbar);
	};
})();
