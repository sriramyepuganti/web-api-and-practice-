self.onmessage = function(e) {
    console.log('in index js');
    console.log(e);
    postMessage('hello world')
}

console.log(caches);