function fetchJSON(file, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.overrideMimeType("application/json");
    xhttp.responseType = 'json';
    xhttp.open("GET", file, true);
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status == "200") {
            callback(xhttp.response);
        }
    }
    xhttp.send(null);
}

export { fetchJSON };
