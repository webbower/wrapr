; (function(w, d, undefined) {
	'use strict';
	
	var
		arrayProto = Array.prototype,
	
		isArrayLike = function(obj) {
			var length = obj.length;
			
			if (obj instanceof Function) {
				return false;
			}
			
			return obj instanceof Array || length === 0 || (length && (length - 1) in obj);
		}
	;
	
	var each = function(obj, callback) {
		if (obj == null) {
			return;
		}
		
		var
			i = 0,
			value,
			length = obj.length
		;
		
		if (isArrayLike(obj)) {
			for ( ; i < length ; i++) {
				value = callback.call(obj[i], i, obj[i]);
				
				if (value === false) {
					break;
				}
			}
		}
		else {
			for (i in obj) {
				if (obj.hasOwnProperty(i)) {
					value = callback.call(obj[i], i, obj[i]);
					
					if (value === false) {
						break;
					}
				}
			}
		}
		
		return obj;
	};
	
	var Wrapr = function(nodes) {
		// Allow constructor to be called as a regular function
	    if (!(this instanceof Wrapr)) {
			return new Wrapr(nodes);
		}

		var self = this;

		// For a single node passed in
		if(nodes.nodeType && nodes.nodeType === 1) {
			this[0] = nodes;
			this.length = 1;
		}
		// For an array-like collection of nodes (NodeList, HTMLCollection, etc), roll them all into the instance
		else if('length' in nodes) {
			each(nodes, function(i, el) {
				self[i] = nodes[i];
			});
			this.length = nodes.length;
		}
		
		return this;
	};
	
	Wrapr.each = each;
	
	Wrapr.extend = function() {
		var
			tgt = arrayProto.shift.call(arguments),
			i = 0,
			prop,
			current
		;
		
		for(; i < arguments.length ; i++) {
			current = arguments[i];
			
			for(prop in current) {
				if(current.hasOwnProperty(prop)) {
					tgt[prop] = current[prop];
				}
			}
		}
		
		return tgt;
	};
	
	// Static methods/properties
	Wrapr.extend(Wrapr, {
		version: '0.1.0',
		
		byId: function(id, context) {
			context = context || d;

			return Wrapr(context.getElementById(id))
		},
		
		byTag: function(tag, context) {
			context = context || d;
			
			return Wrapr(context.getElementsByTagName(tag));
		},
		
		byClass: 'getElementsByClassName' in d ?
			function(klass, context) {
				context = context || d;

				return Wrapr(context.getElementsByClassName(klass));
			} :
			function(klass, context) {
				context = context || d;
				
				return Wrapr(context.querySelectorAll('.' + klass));
			}
		,
		
		bySelector: function(seletor, one, context) {
			context = context || d;

			var method = !!one ? 'querySelector' : 'querySelectorAll';
			
			return Wrapr(context[method](seletor));
		}
	});
	
	// Instance methods/properties
	Wrapr.fn = Wrapr.prototype = {
		constructor: Wrapr,
		
		extend: function(obj) {
			Wrapr.extend(Wrapr.fn, obj);
		}
	};

	Wrapr.fn.extend({
		each: function(iterator) {
			return Wrapr.each(this, iterator);
		},
		
		toArray: function() {
			return arrayProto.slice.call(this, 0);
		}
	})

	// Expose Wrapr
	w.Wrapr = w._Wrapr = Wrapr;
})(this, this.document);