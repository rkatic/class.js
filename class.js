;(function(){

	var F = function(){},
		OP = Object.prototype,
		hasOwnProperty = OP.hasOwnProperty,
		toString = OP.toString,
		rsuper = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /^/;
	
	function isFunction( obj ) {
		return !!obj && toString.call(obj) === "[object Function]";
	}
	
	function isArray( obj ) {
		return !!obj && toString.call(obj) === "[object Array]";
	}
	
	function proxy( fn, parent, method ) {
		return function() {
			var tmp = this._super;
			this._super = method ? parent[ method ] : parent;
			var ret = fn.apply(this, arguments);
			this._super = tmp;
			return ret;
		};
	}
	
	function $object( parent, mixins, prop ) {
		F.prototype = parent || OP;
		var obj = new F();
		
		if ( mixins && isArray(mixins) ) {
			for ( var i = 0, l = mixins.length; i < l; ++i ) {
				var mixin = mixins[i];
				
				for ( var key in mixin ) {
					obj[ key ] = mixin[ key ];
				}
			}
			
		} else {
			prop = prop || mixins;
		}
		
		if ( prop ) {
			for ( var key in prop ) {
				// Own properties are enumerated firstly, so break if current one is not own.
				if ( !hasOwnProperty.call(prop, key) ) {
					break;
				}
				
				var value = prop[ key ];
				
				obj[i] = isFunction( value ) && rsuper.test( value ) ?
					proxy( value, parent, key ) :
					value;
			}
		}
		
		return obj;
	}
	
	function $class( /* base, mixins, prop */ ) {
		var a = arguments, i = 0,
			base = isFunction( a[i] ) ? a[i++] : null,
			mixins = isArray( a[i] ) ? a[i++] : null,
			prop = a[i],
			cls = prop && hasOwnProperty.call( prop, "constructor" ) && prop.constructor;
		
		if ( !isFunction(cls) ) {
			cls = base ?
				function(){ return base.apply(this, arguments); } :
				function(){};
		
		} else if ( rsuper.test(cls) ) {
			cls = proxy( cls, base );
		}
		
		cls.prototype = base || mixins && mixins.length ?
			$object( base && base.prototype, mixins, prop ) :
			prop;
			
		cls.prototype.constructor = cls;
		
		return cls;
	}
	
	//EXPOSE
	this.$object = $object;
	this.$class = $class;
	//this.isFunction = isFunction;
	//this.isArray = isArray;

}).call(this);
