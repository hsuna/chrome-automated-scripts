const patterns = {
    validate: /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
    key:      /[a-z0-9_]+|(?=\[\])/gi,
    push:     /^$/,
    fixed:    /^\d+$/,
    named:    /^[a-z0-9_]+$/i
};

function isObj(x){ 
    var type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
}
 
function toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
 
    return Object(val);
}
 
function assignKey(to, from, key) {
    var val = from[key];
 
    if (val === undefined || val === null) {
        return;
    }
 
    if (to.hasOwnProperty(key)) {
        if (to[key] === undefined || to[key] === null) {
            throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
        }
    }
 
    if (!to.hasOwnProperty(key) || !isObj(val)) {
        to[key] = val;
    } else {
        to[key] = assign(Object(to[key]), from[key]);
    }
}
 
function assign(to, from) {
    if (to === from) {
        return to;
    }
 
    from = Object(from);
 
    for (var key in from) {
        if (from.hasOwnProperty(key)) {
            assignKey(to, from, key);
        }
    }
 
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(from);
 
        for (var i = 0; i < symbols.length; i++) {
            if (from.propIsEnumerable(symbols[i])) {
                assignKey(to, from, symbols[i]);
            }
        }
    }
 
    return to;
}
 
function deepAssign(target) {
    target = toObject(target);
 
    for (var s = 1; s < arguments.length; s++) {
        assign(target, arguments[s]);
    }
    return target;
}
  
function FormSerializer() {

  // private variables
  var data     = {},
      pushes   = {};

  // private API
  function build(base, key, value) {
    base[key] = value;
    return base;
  }

  function makeObject(root, value) {

    var keys = root.match(patterns.key), k;

    // nest, nest, ..., nest
    while ((k = keys.pop()) !== undefined) {
      // foo[]
      if (patterns.push.test(k)) {
        var idx = incrementPush(root.replace(/\[\]$/, ''));
        value = build([], idx, value);
      }

      // foo[n]
      else if (patterns.fixed.test(k)) {
        value = build([], k, value);
      }

      // foo; foo[bar]
      else if (patterns.named.test(k)) {
        value = build({}, k, value);
      }
    }

    return value;
  }

  function incrementPush(key) {
    if (pushes[key] === undefined) {
      pushes[key] = 0;
    }
    return pushes[key]++;
  }

  function addPair(pair) {
    if (!patterns.validate.test(pair.name)) return this;
    var obj = makeObject(pair.name, "true"===pair.value || pair.value);
    data = deepAssign(data, obj);
    return this;
  }

  function addPairs(pairs) {
    if (!Array.isArray(pairs)) {
      throw new Error("formSerializer.addPairs expects an Array");
    }
    for (var i=0, len=pairs.length; i<len; i++) {
      this.addPair(pairs[i]);
    }
    return this;
  }

  function serialize() {
    return data;
  }

  function serializeJSON() {
    return JSON.stringify(serialize());
  }

  // public API
  this.addPair = addPair;
  this.addPairs = addPairs;
  this.serialize = serialize;
  this.serializeJSON = serializeJSON;
}
  
FormSerializer.patterns = patterns;

const serializeObject = serializeArray => new FormSerializer().addPairs(serializeArray).serialize();
const serializeJSON = serializeArray => new FormSerializer().addPairs(serializeArray).serializeJSON();

export {
    serializeObject,
    serializeJSON
}