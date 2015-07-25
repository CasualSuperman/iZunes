(function() {
	var elem = function(tagname) {
		if (this === window) {
			return new elem(tagname);
		}
		if (typeof tagname === "Elem") {
			return tagname;
		}
		if (tagname instanceof Element) {
			this.e = tagname;
			return;
		}
		this.e = document.createElement(tagname);
		this.root = this.e;
		return this;
	};

	elem.prototype = {
		attr: function(name, val) {
			if (val === undefined) {
				return this.e.getAttrbute(name);
			}
			this.e.setAttribute(name, val);
			return this;
		},
		className: function(name) {
			this.e.className = name;
			return this;
		},
		append: function(elem) {
			if (elem instanceof Elem)
				this.e.appendChild(elem.e);
			else if (typeof elem === "string") {
				var nextElem = document.createElement(elem);
				this.e.appendChild(nextElem);
				this.e = nextElem;
			} else
				this.e.appendChild(elem);
			return this;
		},
		end: function() {
			this.e = this.e.parentNode;
			return this;
		},
		text: function(text) {
			this.e.textContent = text;
			return this;
		},
		on: function(ev, handler, bind) {
			this.e.addEventListener(ev, handler, bind);
			return this;
		},
		off: function(ev, handler, bind) {
			this.e.removeEventListener(ev, handler, bind);
			return this;
		},
		pass: function(wrap) {
			wrap(this.e);
			return this;
		},
		done: function() {
			return this.root;
		}
	};

	window.Elem = elem;
})();
