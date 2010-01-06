var Dict = $class({
	constructor: function( obj ) {
		this.m = {};
		if ( obj ) {
			this.update( obj );
		}
	},
	get: function( key ) {
		return this.m[ '#' + key ];
	},
	set: function( key, value ) {
		this.m[ '#' + key ] = value;
	},
	remove: function( key ) {
		delete this.m[ '#' + key ];
	},
	has: function( key ) {
		return this.m.hasOwnProperty( '#' + key );
	},
	isEmpty: function() {
		for ( var i in this.m ) {
			if ( !this.m.hasOwnProperty(i) ) {
				break;
			}
			return false;
		}
		return true;
	},
	size: function() {
		var n = 0, m = this.m;
		for ( var i in m ) {
			if ( !m.hasOwnProperty(i) ) {
				break;
			}
			++n;
		}
		return n;
	},
	setKeys: function( keys, value ) {
		var m = this.m;
		for (var i = 0, l = keys.length; i < l; ++i) {
			m[ '#' + key ] = value;
		}
	},
	removeKeys: function( keys ) {
		var m = this.m;
		for (var i = 0, l = keys.length; i < l; ++i) {
			delete m[ '#' + key ];
		}
	},
	update: function( obj ) {
		if ( obj instanceof Dict ) {
			var dm = this.m, sm = obj.m;
			for ( var i in sm ) {
				if ( !sm.hasOwnProperty(i) ) {
					break;
				}
				dm[i] = sm[i];
			}
		} else {
			var dm = this.m;
			for ( var i in obj ) {
				if ( !obj.hasOwnProperty(i) ) {
					break;
				}
				dm[ "#" + i ] = obj[ i ];
			}
		}
		return this;
	},
	each: function( callback, context ) {
		var m = this.m;
		for ( var i in m ) {
			if ( !m.hasOwnProperty(i) || callback.call(context, i.substring(1), m[i]) === false ) {
				break;
			}
		}
		return this;
	},
	eachKey: function( callback, context ) {
		for ( var i in this.m ) {
			if ( !m.hasOwnProperty(i) || callback.call(context, i.substring(1)) === false ) {
				break;
			}
		}
		return this;
	},
	eachValue: function( callback, context ) {
		var m = this.m;
		for ( var i in m ) {
			if ( !m.hasOwnProperty(i) || callback.call(context, m[i]) === false ) {
				break;
			}
		}
		return this;
	},
	pairs: function() {
		var a = [];
		this.each(function( key, value ) {
			a.push( [key, value] );
		});
		return a;
	},
	keys: function() {
		var a = [];
		this.eachKey( a.push, a );
		return a;
	},
	values: function() {
		var a = [];
		this.eachValue( a.push, a );
		return a;
	}
});
