(function(){

	var F = function(){},
		hasOwnProperty = Object.prototype.hasOwnProperty,
		toString = Object.prototype.toString,
		rsuper = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /^/;
	
	function isFunction( obj ) {
		return toString.call(obj) === "[object Function]";
	}
	
	function proxy( fn, parent, i ) {
		return function() {
			var tmp = this._super;
			this._super = i ? parent[i] : parent;
			var ret = fn.apply(this, arguments);
			this._super = tmp;
			return ret;
		};
	}
	
	function $object( proto, prop ) {
		F.prototype = proto;
		var obj = new F();
		
		if ( prop ) {
			for ( var i in prop ) {
				// Own properties are enumerated firstly, so break if current one is not own.
				if ( !hasOwnProperty.call(prop, i) ) {
					break;
				}
				
				var value = prop[i];
				
				obj[i] = isFunction(value) && rsuper.test(value)  ?
					proxy( value, proto, i ) :
					value;
			}
		}
		
		return obj;
	}
	
	function $class( base, prop ) {        
		if ( !isFunction(base) ) {
			prop = base;
			base = null;
		}
		
		var cls = prop && hasOwnProperty.call(prop, "constructor") && isFunction(prop.constructor) ?
			prop.constructor : null;
		
		if ( cls == null ) {
			cls = base ?
				function(){ return base.apply(this, arguments); } :
				function(){};
		
		} else if ( rsuper.test(cls) ) {
			cls = proxy(cls, base);
		}
		
		cls.prototype = base ? $object(base.prototype, prop) : prop;
		cls.prototype.constructor = cls;
		
		return cls;
	}
	
	//EXPOSE
	this.$object = $object;
	this.$class = $class;

})();
