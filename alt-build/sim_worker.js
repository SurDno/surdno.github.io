let keyQueue = [];
self.onmessage = function(e) {
    if(e.data.type === 'key') {
        if (typeof Module !== 'undefined' && Module._set_key) {
            Module._set_key(e.data.key, e.data.state);
        } else {
            keyQueue.push(e.data);
        }
    } else if(e.data.type === 'state') {
        if (typeof Module !== 'undefined' && Module._receive_render_state) {
            let size = e.data.data.byteLength;
            let ptr = Module._malloc(size);
            Module.HEAPU8.set(new Uint8Array(e.data.data), ptr);
            Module._receive_render_state(ptr, size);
            Module._free(ptr);
            if (Module._run_worker_tick) Module._run_worker_tick();
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
