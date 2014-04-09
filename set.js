/*
 * setBuilder - Creates sets using set notation:
 * 	{1, 2, ..., 100} -> set from numbers 1 to 100
 * 	{0, 2, ..., 20} -> set of even numbers from 0 to 20
 * 	{-50, -40, ..., 0} -> set from -50 to 0. Each numbers is 10 greater than the previous one
 * 	{0, 1, ...} -> set from 0 to 2^53. Represents a set from 0 to infinity.
 *
 * @param (string) template The set template. Curly braces optional,but recommended so it is clear it is a set string
 * @returns (object) set An object representing the evaluation of the set, and containing useful methods for working with sets.
 */
function setBuilder(template) {
	// allow instantiation withouth this keyword
	// seen on jQuery (jquery.Event)
	if (!(this instanceof setBuilder)) {
		return new setBuilder(template);
	}

	this.parse(template);

	return this;
}

setBuilder.prototype = (function(u) {
	var oTemplate,
		items,
		start,
		step,
		end,
		current_value,
		ellipsis = false,
		index = 0,
		is_infinite = false,
		direction;

	function _getNextValue() {
		index++; // keep track of how many values we've extracted

		// if simple set, just return next item
		if (!ellipsis) return items[index] || false;

		var old_current_value = +current_value; // make sure it is a number, or concatenation will happen instado of addition
		current_value = +current_value; // make sure it is a number, or concatenation will happen instado of addition
		current_value += step;

		if (start < end && old_current_value > end) {
			return false;
		}
		if (start > end && old_current_value < end) {
			return false;
		}

		return old_current_value;
	}

	return {
		parse : function(template) {
			oTemplate = template;

			// reset some variables in case it was called by rewind
			index = 0;

			var tmplt = template.replace(/[\{\}]/g, ''),
				itms = tmplt.split(',');

			for (var i = 0; itms[i] && (itms[i] = itms[i++].trim()););
			items = itms;

			if (template.search(/\.{2,}/) > -1) {
				ellipsis = true;
			}

			start = items[0];
			current_value = start;
			end = items[items.length - 1];

			if (start.match(/^\.\.+$/)) {
				// {..., n, m} not supported
				throw "Lists from -infinity to any number not supported";
			}

			if (isNaN(items[1])) {
				if (isNaN(end)) {
					// {n, ...}
					// {n, ..., m, ...}
					// Those sets make no sense
					throw "Your set makes no sense";
				}
				// {n, ..., m} defaults to {n, n+1, ..., m}
				step = 1;
				items[1] = start + step; // set a more useful second elem
			} else {
				step = items[1] - start;
			}

			direction = start < items[1] ? "asc" : "dsc";

			if (end.match(/^\.\.+$/)) {
				is_infinite = true;
				end = Math.pow(2, 53); // set end to the max js int
				direction === "dsc" && (end *= -1);
			}

			return this;
		},

		head : function() {
			return _getNextValue();
		},

		tail : function() {
			this.head(); // extract the head
			return this.nextAll();
		},

		next : function(count) {
			count = count || 1;
			var set = [];
			while(count--) {
				set.push(this.head());
			}
			return set;
		},

		nextAll : function() {
			var set = [];
			// the explicit strict comparison to false is required
			// else the wile will exit if this.peek returns 0
			// which is a valid non-false value to get
			while (false !== this.peek()) {
				set.push(current_value);
				this.head(); // advance the head so we can get the next value.
			}
			return set;
		},

		peek : function() {
			var next_val = this.head();
			current_value -= step; // step back by one in the set so the head is not moved

			return next_val;
		},

		serializeAll : function() {
			return oTemplate;
		},

		serialize : function() {
			var new_template = "{";

			if ((direction === "asc" && current_value > end) || (direction === "dsc" && current_value < end)) {
				return false; // Current value out of range. Cannot serialize
			}

			// Use peek because if the next element is out of range, we know that 
			// only the current element is in the set
			// Use strict bool equality in case peek returns 0
			if (current_value == end || this.peek() === false) {
				return "{" + current_value + "}"; // Only one element in the set
			}

			if (this.peek() === end) {
				return "{" + current_value + ", " + end + "}"; // Only current and last values in the set
			}

			new_template += current_value + ", ";
			new_template += (+current_value + step) + ", ";
			new_template += is_infinite ? "...}" : "..., " + end + "}";

			return new_template;
		},

		serializeTail : function() {
			this.head(); // updates the current value
			return this.serialize();
		},

		rewind : function() {
			this.parse(oTemplate);
		}
	}
})();
