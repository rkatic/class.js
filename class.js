;(function( GLOBALS ){

	var F = function(){},
		OP = Object.prototype,
		toStr = OP.toString,
		hasOwn = OP.hasOwnProperty,
		SPECAILS = { STATIC: 1, prototype: 1, constructor: 1 },

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
		};

	function $object( parent, mixin ) {
		F.prototype = parent || OP;
		var obj = new F();
		// Don't keep the reference!
		F.prototype = OP;

		if ( mixin ) {
			$object.extend( obj, mixin );
		}

		return obj;
	}

	$object.extend = function( obj, mixin ) {
		for ( var key in mixin ) {
			obj[ key ] = mixin[ key ];
		}
		return obj;
	};

	function $class( /* [base], [mixins], [body] */ ) {
		var a = arguments, i = 0,
			base = !a[i] || isFunction( a[i] ) ? a[i++] : null,
			mixins = !a[i] || isArray( a[i] ) ? a[i++] : null,
			body = a[i],
			parent = base && base.prototype,
			constructor = body && hasOwn.call( body, "constructor" ) && body.constructor,
			prototype;

		if ( !constructor ) {
			constructor = base ?
				function(){ return base.apply(this, arguments); } :
				function(){};

		} else if ( base && reSuper.test( constructor ) ) {
			constructor = proxy( constructor, base );
		}

		if ( base || mixins && mixins.length || body && body.STATIC ) {
			prototype = $object( parent );

			if ( mixins ) {
				for ( i = 0; i < mixins.length; ++i ) {
					$class.mixin( constructor, mixins[i] );
				}
			}

			if ( body ) {
				_extend_( prototype, body, parent );

				if ( body.STATIC ) {
					_extend_( constructor, body.STATIC, base );
				}
			}

		} else {
			prototype = body || {};
		}


		prototype.constructor = constructor;
		constructor.prototype = prototype;

		return constructor;
	}

	$class.mixin = function( cls, mixin ) {
		var is_cls = isFunction( mixin ),
			statics = is_cls ? mixin : mixin.STATIC,
			proto = is_cls ? mixin.prototype : mixin;

		proto && _extend_( cls.prototype, proto );
		statics && _extend_( cls, statics );
	};

	//EXPOSE
	$object.isArray = isArray;
	$object.isFunction = isFunction;
	GLOBALS.$object = $object;
	GLOBALS.$class = $class;

})( this );
