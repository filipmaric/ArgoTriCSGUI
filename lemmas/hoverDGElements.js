function hoverDGElements(htmlElements, dgElements, opacity) {
    if (!opacity) opacity = 0.5;
    originalWidth = {};
    dgElements.forEach(element => {
        const width = element.width();
        originalWidth[element.label()] = width ? width : 1;
    });

    function dim() {
        dgElements.forEach(element => { element.opacity(opacity).width(originalWidth[element.label()]); });
    }

    dim();

    function normalizeBraces(str) {
        return str ? str.replace(/([\w'()]+)_(\w)/g, '$1_{$2}') : "";
    }

    htmlElements.forEach(element => {
        element.addEventListener("mouseenter", function(e) {
            MathJax.startup.document.getMathItemsWithin(e.target).forEach(x => {
                const math = normalizeBraces(x.math);
                elements.filter(element => normalizeBraces(element.label()) == math).forEach(element => {
                    element.opacity(1).width(originalWidth[element.label()] >= 1 ? 2.5 : 1.5);
                });
            });
        });

        element.addEventListener("mouseleave", dim);
    });
}
