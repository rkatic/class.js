;(function( global ){

	var F = function(){},
		OP = Object.prototype,
		toStr = OP.toString,
		foo = function(){ return o.foo; },
		reSuper = /foo/.test( foo ) ? /\b_super\b/ : /^/,

		isFunction = function( x ) {
			return x != null && toStr.call( x ) === "[object Function]";
		},

		isArray = Array.isArray || function( x ) {
			return x != null && toStr.call( x ) === "[object Array]";
		};

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
		F.prototype = OP;

		if ( mixin ) {
			extend( obj, mixin );
		}

		return obj;
	}

	function $class( /* [base], [mixins], [body] */ ) {
		var a = arguments, i = 0,
			base = !a[i] || isFunction( a[i] ) ? a[i++] : null,
			mixins = !a[i] || isArray( a[i] ) ? a[i++] : null,
			body = a[i],
			parent = base && base.prototype,
			constructor, prototype;

		if ( body ) {
			constructor = body.constructor;
			delete body.constructor;
		}

		if ( !constructor || constructor === body.constructor ) {
			constructor = base ?
				function(){ return base.apply(this, arguments); } :
				function(){};

		} else if ( base && reSuper.test( constructor ) ) {
			constructor = proxy( constructor, base );
		}

		if ( base || mixins && mixins.length ) {
			prototype = parent ? $object( parent ) : {};

			if ( mixins ) {
				for ( var i = 0; i < mixins.length; ++i ) {
					var mixin = mixins[i];

					if ( isFunction( mixin ) ) {
						mixin = mixin.prototype;
					}

					if ( mixin ) {
						extend( prototype, mixin );
					}
				}
			}

			if ( body ) {
				for ( var i in body ) {
					prototype[i] = ( i in prototype ) && isFunction( body[i] ) && reSuper.test( body[i] ) ?
						proxy( body[i], parent, name ) :
						body[i];
				}
			}

		} else {
			prototype = body || {};
		}

		prototype.constructor = constructor;
		constructor.prototype = prototype;

		return constructor;
	}

	//EXPOSE
	$object.isArray = isArray;
	$object.isFunction = isFunction;
	global.$object = $object;
	global.$class = $class;

})( this );
