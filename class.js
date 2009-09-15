(function(){

    var F = function(){},
        toString = Object.prototype.toString,
        fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    
    function isFunction( obj ) {
        return toString.call(obj) !== "[object Function]";
    }
    
    function proxy( parent, fn ) {
        return function() {
            var tmp = this._super;
            this._super = parent;
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
        };
    }
    
    function prop_proxy( proto, i, fn ) {
        return function() {
            var tmp = this._super;
            this._super = proto[i];
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
        };
    }
    
    function $object( proto, prop ) {
        F.prototype = proto;
        var obj = new F();
        
        if ( prop )
            for ( var i in prop )
                obj[i] = isFunction(prop[i]) && isFunction(proto[i])
                  && fnTest.test(prop[i]) ?
                    prop_proxy( proto, i, prop[i] ) :
                    prop[i];
        
        return obj;
    }
    
    function $class( base, prop ) {        
        if ( !isFunction(base) ) {
            prop = base;
            base = null;
        }
        
        var cls = prop && prop.hasOwnProperty("constructor") ?
            prop.constructor : null;
        
        if ( cls ) {
            if ( base && fnTest.test(cls) ) {
                cls = proxy(base, cls);
            }
        } else {
            cls = base ?
                function(){ return base.apply(this, arguments); } :
                function(){};
        }
        
        cls.prototype = $object((base || Object).prototype, prop);
        cls.prototype.constructor = cls;
        
        return cls;
    }
    
    //EXPOSE
    this.$object = $object;
    this.$clss = $class;
    
    if ( typeof jQuery !== "undefined" ) {
        jQuery.define = function( base, prop ) {
            return ( !prop || isFunction(base) ? $class : $object )( base, prop );
        }
    }

})();