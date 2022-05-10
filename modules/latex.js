function laTeX2HTML(str) {
    return str ? str.replace(/([a-zA-Z_']+)_{(\w+)}/g, '$1<sub>$2</sub>') : "";
}

function removeLaTeX(txt) {
    return txt.replace(/([\w']+)_{(\w+)}/, '$1$2');
}

export { laTeX2HTML, removeLaTeX };
