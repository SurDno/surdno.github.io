let keyQueue = [];
self.onmessage = function(e) {
    if(e.data.type === 'key') {
        if (typeof Module !== 'undefined' && Module._set_key) {
            Module._set_key(e.data.key, e.data.state);
        } else {
            keyQueue.push(e.data);
        }
    }
};

var Module = {
    onRuntimeInitialized: function() {
        keyQueue.forEach(k => Module._set_key(k.key, k.state));
        keyQueue = [];
    }
};

importScripts('engine.js');
