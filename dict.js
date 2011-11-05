var Dict = $class({
	r: '/',
	constructor: function( obj ) {
		this.m = {};
		this.r = this.r;
		if ( obj ) {
			this.update( obj );
		}
	},
	copy: function() {
		return new this.constructor( this );
	},
	sub: function( root ) {
		var dict = new this.constructor();
		dict.m = this.m;
		dict.r = this.r + root;
		return dict;
	},
	get: function( key ) {
		return this.m[ this.r + key ];
	},
	set: function( key, value ) {
		this.m[ this.r + key ] = value;
	},
	remove: function( key ) {
		delete this.m[ this.r + key ];
	},
	has: function( key ) {
		return ( this.r + key ) in this.m;
	},
	isEmpty: function() {
		var r = this.r;
		for ( var h in this.m ) {
			if ( h.indexOf(r) == 0 ) {
				return false;
			}
		}
		return true;
	},
	size: function() {
		var n = 0, m = this.m, r = this.r;
		for ( var h in m ) {
			if ( h.indexOf(r) == 0 ) {
				++n;
			}
		}
		return n;
	},
	setKeys: function( keys, value ) {
		var m = this.m, r = this.r;
		for ( var i = 0, l = keys.length; i < l; ++i ) {
			m[ r + keys[i] ] = value;
		}
	},
	setRecordsBy: function( by, records ) {
		var record, m = this.m, r = this.r;
		for ( var i = 0, l = records.length; i < l; ++i ) {
			record = records[i];
			m[ r + record[by] ] = record;
		}
	},
	removeKeys: function( keys ) {
		var m = this.m, r = this.r;
		for ( var i = 0, l = keys.length; i < l; ++i ) {
			delete m[ r + keys[i] ];
		}
	},
	update: function( obj, notDict ) {
		if ( !notDict && 'iter' in obj && !this.hasOwnProperty.call(obj, 'iter') ) {
			obj.iter( this.set, this );

		} else {
			var m = this.m, r = this.r;

			for ( var k in obj ) {
				m[ r + k ] = obj[ k ];
			}
		}

		return this;
	},
	iter: function( callback, context ) {
		var m = this.m, r = this.r, rlen = r.length;
		for ( var h in m ) {
			if ( h.indexOf(r) == 0 && callback.call(context, h.substring(rlen), m[h]) === false ) {
				break;
			}
		}
		return this;
	},
	toArray: function() {
		var a = [];
		this.iter( a.push, a );
		return a;
	},
	pairs: function() {
		var a = [];
		this.iter(function( key, value ) {
			a.push( [key, value ] );
		});
		return a;
	},
	keys: function() {
		var a = [];
		this.iter(function( key, value ) {
			a.push( key );
		});
		return a;
	},
	values: function() {
		var a = [];
		this.iter(function( key, value ) {
			a.push( value );
		});
		return a;
	}
});
