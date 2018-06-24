window.alert = function alert (message) {
    console.log (message);
}
setTimeout(window.scrollBy(0, Math.random() * 1000), Math.random() * 2000);