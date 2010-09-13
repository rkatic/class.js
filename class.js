;(function(){

	var F = function(){},
		OP = Object.prototype,
		ostr = OP.toString,
		tmp = function(){foo;},
		foo = tmp, // IE9..
		reSuper = /foo/.test( foo ) ? /\b_super\b/ : /^/;
	
	function isFunction( obj ) {
		return !!obj && ostr.call(obj) === "[object Function]";
	}
	
	function isArray( obj ) {
		return !!obj && ostr.call(obj) === "[object Array]";
	}
	
	function proxy( fn, parent, method ) {
		return function() {
			var tmp = this._super;
			this._super = method ? parent[ method ] : parent;
			var ret = fn.apply( this, arguments );
			this._super = tmp;
			return ret;
		};
	}
	
	function extend( obj, mixin ) {
		for ( var key in mixin ) {
			obj[ key ] = mixin[ key ];
		}
		return obj;
	}
	
	function $object( parent, mixin ) {
		F.prototype = parent || OP;
		var obj = new F();
		
		if ( mixin ) {
			extend( obj, mixin );
		}
		
		return obj;
	}
	
	function $class( /* base, mixins, prop */ ) {
		var a = arguments, i = 0,
			base = isFunction( a[i] ) ? a[i++] : null,
			mixins = isArray( a[i] ) ? a[i++] : null,
			prop = a[i],
			parent = base && base.prototype,
			constructor, prototype;
		
		if ( prop ) {
			constructor = prop.constructor;
			delete prop.constructor;
			
			// If after delition, constructor is inaltered, then it is not own.
			if ( constructor === prop.constructor ) {
				constructor = null;
			}
		}
		
		if ( base || mixins && mixins.length ) {
			prototype = $object( parent );
			
			if ( mixins ) {
				for ( var i = 0; i < mixins.length; ++i ) {
					extend( prototype, mixins[i] );
				}
			}
			
			if ( prop ) {			
				for ( var name in prop ) {
					var value = prop[ name ];
					
					prototype[ name ] = ( name in prototype ) && isFunction( value ) && reSuper.test( value ) ?
						proxy( value, parent, name ) :
						value;
				}
			}
			
		} else {
			prototype = prop || {};
		}
		
		if ( !constructor ) {
			constructor =  base ?
				function(){ return base.apply(this, arguments); } :
				function(){};
		}
		
		prototype.constructor = constructor;
		constructor.prototype = prototype;
		
		return constructor;
	}
	
	//EXPOSE
	this.$object = $object;
	this.$class = $class;
	//this.isFunction = isFunction;
	//this.isArray = isArray;

}).call(this);
