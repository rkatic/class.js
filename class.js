(function(){

    var F = function(){},
        hasOwnProperty = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        superTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    
    function isToWrap( obj ) {
        return toString.call(obj) === "[object Function]" && superTest.test(obj);
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
                // Own properties are iterated firstly, so break if current is not own.
                if ( !hasOwnProperty.call(prop, i) ) {
                    break;
                }
                obj[i] = isToWrap( prop[i] ) ?
                    proxy( prop[i], proto, i ) :
                    prop[i];
            }
        }
        
        return obj;
    }
    
    function $class( base, prop ) {        
        if ( toString.call(base) !== "[object Function]" ) {
            prop = base;
            base = null;
        }
        
        var cls = prop && hasOwnProperty.call(prop, "constructor") ?
            prop.constructor : null;
        
        if ( cls == null ) {
            cls = base ?
                function(){ return base.apply(this, arguments); } :
                function(){};
        }
        else if ( isToWrap(cls) ) {
            cls = proxy(cls, base);
        }
        
        cls.prototype = base ? $object(base.prototype, prop) : prop;
        cls.prototype.constructor = cls;
        
        return cls;
    }
    
    //EXPOSE
    this.$object = $object;
    this.$class = $class;
    
    if ( typeof jQuery !== "undefined" ) {
        jQuery.define = function( base, prop ) {
            return ( !prop || jQuery.isFunction(base) ? $class : $object )( base, prop );
        }
    }

})();