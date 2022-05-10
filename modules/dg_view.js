import { DG } from './dg.js';
import { removeLaTeX, laTeX2HTML } from './latex.js';
import * as RC from './rc.js';

// -----------------------------------------------------------------------------
// encapsulate drawing canvas with a few basic drawing primitives
// -----------------------------------------------------------------------------
class Canvas {
    constructor(element, options) {
        if (typeof element == "string")
            element = document.getElementById(element);

        if (element instanceof HTMLCanvasElement) {
            this._canvas = element;
            this._container = document.createElement("div");
            this._canvas.parentNode.replaceChild(this._container, this._canvas);
            this._container.append(this._canvas);
            this._container.style.width = "500px";
            const h1 = document.getElementsByTagName("h1")[0];
            h1.style.textAlign = "center";
            h1.style.marginTop = "45px";
        } else {
            this._container = element;
            this._canvas = document.createElement("canvas");
            this._container.append(this._canvas);
            this._canvas.width = this._container.width;
            this._canvas.height = this._container.height;
        }

        this._container.style.marginLeft = "auto";
        this._container.style.marginRight = "auto";

        const ratio = window.devicePixelRatio;
        
        if (options.width) {
            this._canvas.width = options.width * ratio;
            this._canvas.style.width = options.width + "px";
        }

        if (options.height) {
            this._canvas.height = options.height * ratio;
            this._canvas.style.height = options.height + "px";
        }

        this._canvas.getContext("2d").scale(ratio, ratio);
        
        if (options.border)
            this._canvas.style.border = options.border;

        this._defaultColor = "black";
        this._defaultWidth = 1;
        this._defaultDash = [];

        // add status line paragraph
        const p = document.createElement("p");;
        this._p_status = p;
        const divContainer = document.createElement("div");
        this._canvas.parentNode.replaceChild(divContainer, this._canvas);
        divContainer.style.position = "relative";
        divContainer.append(this._canvas);
        divContainer.append(p);
        p.style.position = "absolute";
        p.style.top = "0px";
        p.style.left = "0px";
        p.style.margin = "5px";
        p.style.backgroundColor = "white";
    }

    addEventListener(event, fun) {
        this._canvas.addEventListener(event, fun);
    }

    width() {
        const ratio = window.devicePixelRatio;
        return this._canvas.width / ratio;
    }

    height() {
        const ratio = window.devicePixelRatio;
        return this._canvas.height / ratio;
    }

    context() {
        return this._canvas.getContext("2d");
    }

    clear() {
        const ctx = this.context();
        ctx.clearRect(0, 0, this.width(), this.height());
    }

    arc(x, y, r, angle_from, angle_to, color, width, dash, fill) {
        color = color || this._defaultColor;
        width = width || this._defaultWidth;
        dash = dash || this._defaultDash;
        if (fill === undefined)
            fill = false;
        
        const ctx = this.context();
        ctx.lineWidth = width;
        ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.arc(x, y, r, angle_from, angle_to, true);
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.stroke();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }
    
    circle(x, y, r, color, width, dash, fill) {
        this.arc(x, y, r, 0, 2*Math.PI, color, width, dash, fill);
    }

    segment(x1, y1, x2, y2, color, width, dash) {
        color = color || this._defaultColor;
        width = width || this._defaultWidth;
        dash = dash || this._defaultDash;
        const ctx = this.context();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.setLineDash(dash);
        ctx.stroke();
    }

    line_endpoints(x1, y1, x2, y2) {
        const [w, h] = [this.width(), this.height()];

        if (x1 == x2)
            return [x1, 0, x1, h];
        else if (y1 == y2)
            return [0, y1, w, y1];
        else {
            let result = []

            function point(t) {
                const x = x1 + t * (x2 - x1);
                const y = y1 + t * (y2 - y1);
                return [x, y];
            }

            let t, x, y;
            
            t = (0 - x1) / (x2 - x1);
            [x, y] = point(t);

            if (0 <= y && y <= h)
                result.push.apply(result, [x, y]);

            t = (w - x1) / (x2 - x1);
            [x, y] = point(t);

            if (0 <= y && y <= h)
                result.push.apply(result, [x, y]);

            if (result.length == 4)
                return result;

            t = (0 - y1) / (y2 - y1);
            [x, y] = point(t);

            if (0 <= x && x <= w)
                result.push.apply(result, [x, y]);
            
            if (result.length == 4)
                return result;
                
            t = (h - y1) / (y2 - y1);
            [x, y] = point(t);

            if (0 <= x && x <= w)
                result.push.apply(result, [x, y]);

            return result;
        }
    }

    line(x1, y1, x2, y2, color, width, dash) {
        const [x1l, y1l, x2l, y2l] = this.line_endpoints(x1, y1, x2, y2);
        this.segment(x1l, y1l, x2l, y2l, color, width, dash);
    }

    line_label(x1, y1, x2, y2, color, label) {
        let [x1l, y1l, x2l, y2l] = this.line_endpoints(x1, y1, x2, y2).map(x => Math.round(x));
        if (y1l > y2l)
            [x1l, y1l] = [x2l, y2l];


        const offset = 15;
        let x, y;
        if (x1l == 0) {
            x = 0;
            y = y1l;
        } else if (x1l == this.width()) {
            x = this.width() - offset;
            y = y1l;
        } if (y1l == 0) {
            x = x1l;
            y = offset;
        } else if (y1l == this.height()) {
            x = x1l;
            y = this.height() - offset;
        }
        this.text(x, y, label, "15px Arial", color);
    }
    
    text(x, y, txt, font, color) {
        const ctx = this.context();
        ctx.font = font || "15px Arial";
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.lineJoin = "miter";
	ctx.miterLimit = 2;
        ctx.strokeText(txt, x, y);
        if (color)
            ctx.fillStyle = color;
        ctx.fillText(txt, x, y);
    }

    message(msg) {
        // this.text(5, 15, msg, "15px Arial", "black");
        this._p_status.innerHTML = laTeX2HTML(msg);
    }
}

// -----------------------------------------------------------------------------
// handling of mouse and keyboard events on a view
// -----------------------------------------------------------------------------
class DGTool {
    constructor(view) {
        this._view = view;
    }

    getMousePosition(e) {
        return [e.offsetX, e.offsetY];
    }

    mousemove(e) {
    }

    mousedown(e) {
    }

    mouseup(e) {
    }
    
    keydown(e) {
    }

    getObject() {
        return undefined;
    }
}

class DGToolDragFree extends DGTool {
    constructor(view, construction) {
        super(view);
        // mouse button is not yet pressed
        this._mousedown = false;
        // point dragged by the mouse
        this._dragPoint = undefined;
        // point moved by the keyboard
        this._keyboardTarget = undefined;
        // construction whose points can be dragged
        // (if not specified all existing points free points can be dragged)
        this._construction = construction;
    }

    mousemove(e) {
        if (this._mousedown && this._dragPoint !== undefined) {
            const [xm, ym] = this.getMousePosition(e);
            const [x, y] = this._view.transformInverse(xm, ym);
            if (!this._dragPoint.moveTo(x, y)) {
                const N = 10;
                for (let d = 1; d <= N; d++) {
                    let ring = [];
                    for (let x = -d; x <= d; x++)
                        ring.push([x, -d]);
                    for (let y = -d+1; y <= d; y++)
                        ring.push([d, y]);
                    for (let x = d-1; x >= -d; x--)
                        ring.push([x, d]);
                    for (let y = d-1; y >= -d+1; y--)
                        ring.push([-d, y]);

                    for (let i = 0; i < ring.length; i++) {
                        const [dx, dy] = ring[i];
                        const [x, y] = this._view.transformInverse(xm+dx, ym+dy);
                        if (this._dragPoint.moveTo(x, y))
                            return;
                    }
                }
            }
        }
    }

    mousedown(e) {
        this._mousedown = true;
        const [x, y] = this.getMousePosition(e);
        if (this._construction)
            this._dragPoint = this._construction.findFreePointAt(x, y, this._view.transform.bind(this._view));
        else
            this._dragPoint = DG.findFreePointAt(x, y, this._view.transform.bind(this._view));
        this._keyboardTarget = this._dragPoint;
    }

    mouseup(e) {
        this._mousedown = false;
        this._dragPoint = undefined;
    }

    keydown(e) {
        if (!this._keyboardTarget)
            return;
        const p = this._keyboardTarget;
        let [x, y] = [p.x(), p.y()];
        let [xt, yt] = this._view.transform(x, y);
        const eps = 2;
        if (e.key == "ArrowRight")
            xt += 1;
        else if (e.key == "ArrowLeft")
            xt -= 1;
        if (e.key == "ArrowUp")
            yt -= 1;
        else if (e.key == "ArrowDown")
            yt += 1;

        [x, y] = this._view.transformInverse(xt, yt)
        p.moveTo(x, y);
    }
}


class DGTool_ConstructObject extends DGTool {
    constructor(view, types, construction, callback) {
        super(view);
        this._object = undefined;
        this._types = types;
        this._selected = [];
        this._construction = construction;
        this._callback = callback;

        this._view.message("Select a " + this.typeName(this._types[0]));
    }

    typeName(t) {
        if (t == 'p') return "point";
        if (t == 'l') return "line";
        if (t == 'c') return "circle";
    }

    mouseup(e) {
        const [x, y] = this.getMousePosition(e);
        let obj;
        const k = this._selected.length;
        if (this._types[k] == "p")
            obj = this._construction.findPointAt(x, y, this._view.transform.bind(this._view));
        else if (this._types[k] == "l")
            obj = this._construction.findLineAt(x, y, this._view.transform.bind(this._view));
        else if (this._types[k] == "c")
            obj = this._construction.findCircleAt(x, y, this._view.transform.bind(this._view));
        if (!obj)
            return;

        this._selected.push(obj);
        
        if (this._selected.length == this._types.length) {
            this._object = this.construct(...this._selected);
            if (this._callback)
                this._callback(this._object);
            this._selected = [];
        }

        let msg = "";
        this._selected.forEach((obj, i) => {msg += "Selected " + this.typeName(this._types[i]) + " " + obj.label() + ". "});
        msg += "Select a " + this.typeName(this._types[this._selected.length]);
        this._view.message(msg);
    }
    
    getObject() {
        return this._object;
    }
}


class DGToolLine extends DGTool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pp", construction, callback);
    }
    
    construct(p1, p2) {
        return RC.line(p1, p2);
    }
}

class DGToolMidpoint extends DGTool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pp", construction, callback);
    }
    
    construct(p1, p2) {
        return RC.midpoint(p1, p2);
    }
}

class DGToolBisector extends DGTool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pp", construction, callback);
    }
    
    construct(p1, p2) {
        return RC.bisector(p1, p2);
    }
}

class DGToolCircle extends DGTool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pp", construction, callback);
    }
    
    construct(p1, p2) {
        return RC.circle(p1, p2);
    }
}

class DGToolDropPerp extends DGTool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pl", construction, callback);
    }

    construct(p, l) {
        return RC.drop_perp(l, p);
    }
}

class DGToolParallel extends DGTool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pl", construction, callback);
    }

    construct(p, l) {
        return RC.parallel(l, p);
    }
}

class DGToolIntersectLL extends DGTool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "ll", construction, callback);
    }

    construct(l1, l2) {
        return RC.intersectLL(l1, l2);
    }
}

class DGToolIntersectLC extends DGTool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "lcp", construction, callback);
    }

    construct(l, c, p) {
        return RC.intersectLC_other(l, c, p);
    }
}

class DGToolIntersectCC extends DGTool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "ccp", construction, callback);
    }

    construct(c1, c2, p) {
        return RC.intersectCC_other(c1, c2, p);
    }
}

// -----------------------------------------------------------------------------
// drawing view enables drawing objects given in the world coordinate system
// -----------------------------------------------------------------------------
class DGView {
    constructor(element, options, xmin, xmax, ymin, ymax, tool) {
        if (arguments.length == 2) {
            [xmin, xmax] = [-5, 5];
            [ymin, ymax] = [-5, 5];
        }

        this._canvas = new Canvas(element, options);

        this._xmin = xmin;
        this._xmax = xmin;
        this._ymin = ymin;
        this._ymin = ymax;
        const ratio = window.devicePixelRatio;
        this._scalex = (this._canvas.width()) / (xmax - xmin);
        this._scaley = (this._canvas.height()) / (ymax - ymin);
        this._x0 = -xmin * this._scalex;
        this._y0 = ymax * this._scaley;
        if (tool)
            this._tool = tool;
        else
            this._tool = new DGToolDragFree(this);
        
        this.addEventListener('mousemove', this.mousemove.bind(this), false);
        this.addEventListener('mousedown', this.mousedown.bind(this), false);
        this.addEventListener('mouseup', this.mouseup.bind(this), false);
        document.body.addEventListener('keydown', this.keydown.bind(this), false);
    }

    addEventListener(event, fun) {
        this._canvas.addEventListener(event, fun);
    }

    clear() {
        this._canvas.clear();
    }

    transform(x, y) {
        return [this._x0 + x * this._scalex, this._y0 - y * this._scaley];
    }

    transformInverse(x, y) {
        return [(x - this._x0) / this._scalex, (this._y0 - y) / this._scaley];
    }

    point(x, y, options) {
        options = options || {}
        const size = options.size || 1;
        const [xt, yt] = this.transform(x, y);
        this._canvas.circle(xt, yt, 4 * size, options.color, undefined, undefined, true)
    }

    text(x, y, txt) {
        txt = removeLaTeX(txt);
        const [xt, yt] = this.transform(x, y);
        const displace = 8;
        this._canvas.text(xt + displace, yt + displace, txt);
    }
    
    segment(x1, y1, x2, y2, options) {
        options = options || {}
        const [x1t, y1t] = this.transform(x1, y1);
        const [x2t, y2t] = this.transform(x2, y2);
        this._canvas.segment(x1t, y1t, x2t, y2t, options.color, options.width, options.dash);
    }

    line(x1, y1, x2, y2, options) {
        options = options || {}
        const [x1t, y1t] = this.transform(x1, y1);
        const [x2t, y2t] = this.transform(x2, y2);
        this._canvas.line(x1t, y1t, x2t, y2t, options.color, options.width, options.dash);
    }

    circle(x, y, r, options) {
        options = options || {};
        const [xt, yt] = this.transform(x, y);
        const rt = r * this._scalex; // FIXME: different scales
        this._canvas.circle(xt, yt, rt, options.color, options.width, options.dash);
    }

    line_label(x1, y1, x2, y2, color, label) {
        label = removeLaTeX(label);
        const [x1t, y1t] = this.transform(x1, y1);
        const [x2t, y2t] = this.transform(x2, y2);
        this._canvas.line_label(x1t, y1t, x2t, y2t, color, label);
    }

    message(msg) {
        this._canvas.message(msg);
    }

    setTool(tool) {
        this._tool = tool;
    }    
    
    mousemove(e) {
        if (this._tool)
            this._tool.mousemove(e);
    }

    mousedown(e) {
        if (this._tool)
            this._tool.mousedown(e);
    }

    mouseup(e) {
        if (this._tool)
            this._tool.mouseup(e);
    }

    keydown(e) {
        if (this._tool)
            this._tool.keydown(e);
    }
}

class DGConstructionToolbar {
    constructor(construction, view, callback, element) {
        this._construction = construction;
        this._view = view;
        this._tool_callback = callback;
        
        const divTools = document.createElement("div");
        element.prepend(divTools);
        
        const self = this;
        
        const btnDrag = document.createElement("button");
        btnDrag.innerHTML = "drag";
        btnDrag.addEventListener("click", function() {
            self._view.message("");
            self.setTool(new DGToolDragFree(self._view, self._construction));
        });
        divTools.append(btnDrag);

        const btnLine = document.createElement("button");
        btnLine.innerHTML = "line";
        btnLine.addEventListener("click", function() {
            self.setTool(new DGToolLine(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnLine);

        const btnCircle = document.createElement("button");
        btnCircle.innerHTML = "circle";
        btnCircle.addEventListener("click", function() {
            self.setTool(new DGToolCircle(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnCircle);
        
        const btnMidpoint = document.createElement("button");
        btnMidpoint.innerHTML = "midpoint";
        btnMidpoint.addEventListener("click", function() {
            self.setTool(new DGToolMidpoint(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnMidpoint);

        const btnBisector = document.createElement("button");
        btnBisector.innerHTML = "bisector";
        btnBisector.addEventListener("click", function() {
            self.setTool(new DGToolBisector(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnBisector);
        
        const btnDropPerp = document.createElement("button");
        btnDropPerp.innerHTML = "perp";
        btnDropPerp.addEventListener("click", function() {
            self.setTool(new DGToolDropPerp(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnDropPerp);

        const btnParallel = document.createElement("button");
        btnParallel.innerHTML = "parallel";
        btnParallel.addEventListener("click", function() {
            self.setTool(new DGToolParallel(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnParallel);

        divTools.append(document.createElement("br"));
        
        const btnIntersectLL = document.createElement("button");
        btnIntersectLL.innerHTML = "intersectLL";
        btnIntersectLL.addEventListener("click", function() {
            self.setTool(new DGToolIntersectLL(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnIntersectLL);

        const btnIntersectLC = document.createElement("button");
        btnIntersectLC.innerHTML = "intersectLC";
        btnIntersectLC.addEventListener("click", function() {
            self.setTool(new DGToolIntersectLC(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnIntersectLC);

        const btnIntersectCC = document.createElement("button");
        btnIntersectCC.innerHTML = "intersectCC";
        btnIntersectCC.addEventListener("click", function() {
            self.setTool(new DGToolIntersectCC(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnIntersectCC);
        
        [...divTools.getElementsByTagName("button")].forEach(button => { button.style.fontSize = "12px"; });
    }

    setTool(tool) {
        this._view.setTool(tool);
    }    
}

class DGAnimation {
    constructor(construction, element) {
        const divBtns = document.createElement("div");
        element.appendChild(divBtns);
            
        const btnPrev = document.createElement("button");
        btnPrev.innerHTML = "<<";
        btnPrev.addEventListener("click", construction.prevAnimationStep.bind(construction));
        divBtns.appendChild(btnPrev);
            
        const btnNext = document.createElement("button");
        btnNext.innerHTML = ">>";
        btnNext.addEventListener("click", construction.nextAnimationStep.bind(construction));
        divBtns.append(btnNext);
    }
}

export { DGView, DGConstructionToolbar, DGAnimation };
