import { DGView } from './dg_view.js';
import { DGPoint, DGLine, DGCircle, DGSegment, DGClone, DGRandomPoint, DGCircleCenterPoint, DGIntersectLL, DGIntersectLC, DGIntersectCC, DGIf, DGPoincareLine, DGPoincareCircle } from './dg_objects.js';

/**
 * Construction is a list of DGObjects
 */
class DGConstruction {
    constructor() {
        this._objects = [];
        this._view = null;
        this._animation_step = -1;
    }

    setView(view) {
        this._view = view;
    }

    addObject(o) {
        this._objects.push(o);
        this.draw();
    }

    draw() {
        const view = this._view;
        if (view) {
            view.clear();
            this._objects.filter(o => !o.isPoint()).forEach(o => {o.draw(view)});
            this._objects.filter(o => o.isPoint()).forEach(o => {o.draw(view)});
        }
    }

    drawAnimationStep() {
        const view = this._view;
        if (view) {
            view.clear();
            this._objects.slice(0, this._animation_step+1).forEach(o => o.draw(view));
            view.message(this._objects[this._animation_step].description());
        }
    }
    
    doAnimationStep(increment) {
        do {
            const n = this._objects.length;
            this._animation_step = (this._animation_step + n + increment) % n;
        } while (!this._objects[this._animation_step].visible());
        this.drawAnimationStep();
    }

    nextAnimationStep() {
        this.doAnimationStep(+1);
    }
    
    prevAnimationStep() {
        this.doAnimationStep(-1);
    }
    
    animate() {
        const view = this._view;
        if (view) {
            view.clear();
            window.setInterval(function() {
                this.nextAnimationStep();
                this.drawAnimationStep();
            }, 1000);
        }
    }

    findFreePointAt(x, y, transform) {
        return this._objects.filter(o => o.isFreePoint() && !o.hidden()).find(p => p.isNear(x, y, transform));
    }
    
    findPointAt(x, y, transform) {
        return this._objects.filter(o => o.isPoint() && !o.hidden()).find(p => p.isNear(x, y, transform));
    }

    findLineAt(x, y, transform) {
        return this._objects.filter(o => o.isLine() && !o.hidden()).find(l => l.isNearLine(x, y, transform));
    }

    findCircleAt(x, y, transform) {
        return this._objects.filter(o => o.isCircle() && !o.hidden()).find(l => l.isNearCircle(x, y, transform));
    }

    includes(label) {
        // this can be faster if all object labels are put in a hash-set  
        return this._objects.some(o => o.label() == label);
    }
}


// -----------------------------------------------------------------------------
// API and a global register of all DGobjects
// -----------------------------------------------------------------------------
class DG {
    static _construction = new DGConstruction();
    static _view = null;

    static setup(element, options, xmin, xmax, ymin, ymax) {
        if (arguments.length == 2)
            DG._view = new DGView(element, options);
        else
            DG._view = new DGView(element, options, xmin, xmax, ymin, ymax);
        DG._construction.setView(DG._view);
    }


    static addObject(o) {
        DG._construction.addObject(o);
    }
    
    static draw() {
        DG._construction.draw();
    }

    static nextAnimationStep() {
        DG._construction.nextAnimationStep();
    }

    static prevAnimationStep() {
        DG._construction.prevAnimationStep();
    }
    
    static animate() {
        DG._construction.animate();
    }

    static Point(x, y, validity_check) {
        const p = new DGPoint(x, y);
        if (validity_check)
            p.validityCheck(validity_check);
        DG.addObject(p);
        return p;
    }

    static RandomPoint(validity_check, xmin, xmax, ymin, ymax) {
        const p = new DGRandomPoint(validity_check, xmin, xmax, ymin, ymax);
        DG.addObject(p);
        return p;
    }

    static Line(P1, P2) {
        const l = new DGLine(P1, P2);
        DG.addObject(l);
        return l;
    }

    static Circle(C, P) {
        const c = new DGCircle(C, P);
        DG.addObject(c);
        return c;
    }

    static IntersectLL(l1, l2) {
        const p = new DGIntersectLL(l1, l2);
        DG.addObject(p);
        return p;
    }

    static IntersectLC(l, c) {
        const p = new DGIntersectLC(l, c);
        DG.addObject(p);
        return p;
    }

    static IntersectCC(c1, c2) {
        const p = new DGIntersectCC(c1, c2);
        DG.addObject(p);
        return p;
    }

    static If(cond, then_object, else_object, dependencies) {
        const p = new DGIf(cond, then_object, else_object, dependencies);
        DG.addObject(p);
        return p;
    }

    static PoincareLine(p1, p2) {
        const l = new DGPoincareLine(p1, p2);
        DG.addObject(l);
        return l;
    }

    static PoincareCircle(c, p) {
        const pc = new DGPoincareCircle(c, p);
        DG.addObject(pc);
        return pc;
    }

    static Segment(p1, p2) {
        const s = new DGSegment(p1, p2);
        DG.addObject(s);
        return s;
    }
    
    static findFreePointAt(x, y, transform) {
        return DG._construction.findFreePointAt(x, y, transform);
    }
    
    static findPointAt(x, y, transform) {
        return DG._construction.findPointAt(x, y, transform);
    }

    static findLineAt(x, y, transform) {
        return DG._construction.findLineAt(x, y, transform);
    }

    static findCircleAt(x, y, transform) {
        return DG._construction.findCircleAt(x, y, transform);
    }
    
}

export { DGConstruction, DG };
