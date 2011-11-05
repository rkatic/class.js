;(function( GLOBALS ){

	var F = function(){},
		OP = Object.prototype,
		toStr = OP.toString,
		hasOwn = OP.hasOwnProperty,
		SPECAILS = { STATIC: 1, prototype: 1, constructor: 1 },

		slice = [].slice,
		concat = [].concat,

		// Test if function serialization works.
		foo = function(){ return OP.foo; },
		reSuper = /foo/.test( foo ) ? /\b_super\b/ : /^/,

		isFunction = function( x ) {
			return x != null && toStr.call( x ) === "[object Function]";
		},

		isArray = Array.isArray || function( x ) {
			return x != null && toStr.call( x ) === "[object Array]";
		},

		proxy = function( fn, parent, method ) {
			return function() {
				var tmp = this._super;
				this._super = method ? parent[ method ] : parent;
				var ret = fn.apply( this, arguments );
				this._super = tmp;
				return ret;
			};
		},

		_extend_ = function( obj, mixin, override ) {
			for ( var i in mixin ) {
				if ( !( i in SPECAILS ) ) {
					obj[i] = override && ( i in override ) && isFunction( mixin[i] ) && reSuper.test( mixin[i] ) ?
						proxy( mixin[i], override, i ) :
						mixin[i];
				}
			}
		},

		proc = function( fun, o, a, from ) {
			a = concat.apply( [], from ? slice.call( a, from ) : a );

			for ( var i = 0, l = a.length; i < l; ++i ) {
				a[i] && fun( o, a[i] );
			}

			return o;
		};

	function $object( parent ) {
		F.prototype = parent || OP;
		var obj = new F();
		// Don't keep the reference!
		F.prototype = OP;

		if ( arguments.length > 1 ) {
			proc( $object._extend, obj, arguments, 1 );
		}

		return obj;
	}

	$object._extend = function( obj, mixin ) {
		for ( var key in mixin ) {
			obj[ key ] = mixin[ key ];
		}
	};

	$object.extend = function( obj ) {
		return proc( $object._extend, obj, arguments, 1 );
	};

	function $class( /* [base], [mixins], [body] */ ) {
		var a = arguments, i = 0,
			base = !a[i] || isFunction( a[i] ) ? a[i++] : null,
			mixins = !a[i] || isArray( a[i] ) ? a[i++] : null,
			body = a[i] || {},
			parent = base && base.prototype,
			constructor = hasOwn.call( body, "constructor" ) && body.constructor,
			prototype;

		if ( !constructor ) {
			constructor = base ?
				function(){ return base.apply(this, arguments); } :
				function(){};

		} else if ( base && reSuper.test( constructor ) ) {
			constructor = proxy( constructor, base );
		}

		if ( base || mixins && mixins.length || body.STATIC ) {
			prototype = $object( parent );

			if ( base ) {
				_extend_( constructor, base );
			}

			if ( mixins ) {
				proc( $class._mixin, constructor, mixins );
			}

			_extend_( prototype, body, parent );

			if ( body.STATIC ) {
				_extend_( constructor, body.STATIC, base );
			}

		} else {
			prototype = body;
		}


		prototype.constructor = constructor;
		constructor.prototype = prototype;

		return constructor;
	}

	$class._mixin = function( cls, mixin ) {
		var is_cls = isFunction( mixin ),
			statics = is_cls ? mixin : mixin.STATIC,
			proto = is_cls ? mixin.prototype : mixin;

		proto && _extend_( cls.prototype, proto );
		statics && _extend_( cls, statics );
	};

	$class.mixin = function( cls ) {
		return proc( $class._mixin, cls, arguments, 1 );
	};

	// EXPOSE
	$object.isArray = isArray;
	$object.isFunction = isFunction;
	GLOBALS.$object = $object;
	GLOBALS.$class = $class;

})( this );
