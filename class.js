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

	function $class( /* base, mixins, prop */ ) {
		var a = arguments, i = 0,
			base = !a[i] || isFunction( a[i] ) ? a[i++] : null,
			mixins = !a[i] || isArray( a[i] ) ? a[i++] : null,
			prop = a[i],
			parent = base && base.prototype,
			constructor, prototype;

		if ( prop ) {
			constructor = prop.constructor;
			delete prop.constructor;
		}

		if ( !constructor || constructor === prop.constructor ) {
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

			if ( prop ) {
				for ( var i in prop ) {
					prototype[i] = ( i in prototype ) && isFunction( prop[i] ) && reSuper.test( prop[i] ) ?
						proxy( prop[i], parent, name ) :
						prop[i];
				}
			}

		} else {
			prototype = prop || {};
		}

		prototype.constructor = constructor;
		constructor.prototype = prototype;

		return constructor;
	}

	//EXPOSE
	global.$object = $object;
	global.$class = $class;
	//global.isFunction = isFunction;
	//global.isArray = isArray;

})( this );
