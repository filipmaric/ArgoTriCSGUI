import { Complex, CP1, Circline } from './complex_geom.js';
import { DG } from './dg.js';

// -----------------------------------------------------------------------------
// the base class for all geometric objects
// -----------------------------------------------------------------------------
class DGObject {
    // global number of created objects
    static num_objects = 0;
    
    constructor() {
        // unique object identifier
        this._ID = DGObject.num_objects++;
        
        // objects dependent on the current one (the ones constructed
        // using this object)
        this._dependent_objects = [];

        // some objects can be invalid (e.g., intersection point
        // selected by some given criteria, when no selection point exists)
        this._valid = true;

        // style (visibility, color, width, size, dashed, ...)
        this._style = {};
    }

    // most objects are not free points so this function is predefined
    // in the base class
    isFreePoint() {
        return false;
    }

    isPoint() {
        return false;
    }

    isLine() {
        return false;
    }

    isCircle() {
        return false;
    }
    
    // set if this object should be visible
    show(yes) {
        if (yes == undefined)
            yes = true;
        this._style._hide = !yes;
        DG.draw();
        return this;
    }

    // set that this object should not be visible
    hide() {
        this.show(false);
        return this;
    }

    // check if the object is hidden (not visible)
    hidden() {
        return this._style._hide;
    }

    // check if the object is visible (not hidden)
    visible() {
        return !this.hidden();
    }

    // set the color of the object
    color(c) {
        this._style._color = c;
        DG.draw();
        return this;
    }

    // set the line width of the object
    width(w) {
        this._style._width = w;
        DG.draw();
        return this;
    }

    // set dashed pattern
    dashed() {
        this._style._dash = [8, 4];
        DG.draw();
        return this;
    }

    solid() {
        this._style._dash = [];
        DG.draw();
        return this;
    }

    // set the size of the object (for drawing points)
    size(s) {
        this._style._size = s;
        DG.draw();
        return this;
    }

    // get/set the label of the object
    label(str, show, redraw) {
        if (str) {
            if (show === undefined)
                show = true;
            this._style._label = str;
            this._style._showing_label = show;
            if (redraw === undefined || redraw)
                DG.draw();
            return this;
        } else
            return this._style._label;
    }

    showingLabel() {
        return this._style._showing_label;
    }

    getStyle() {
        return this._style;
    }
    
    // set the entire style object
    setStyle(style, redraw) {
        this._style = style;
        if (redraw === undefined || redraw)
            DG.draw();
        return this;
    }

    // draw object on the given DGView
    // this is a template method and the real drawing is done within
    // the polimorphic drawMe method
    draw(view) {
        if (this.hidden())
            return;
        if (!this._valid)
            return;
        this.drawMe(view);
        if (this.showingLabel())
            this.drawLabel(view);
    }

    // this should be overridden
    drawMe(view) {
    }

    // this should be overridden
    drawLabel(view) {
    }
    
    // Register a DGObject to depend on the current object, so that it
    // is updated whenever the current object changes
    addDependent(o) {
        this._dependent_objects.push(o);
    }

    // shallow copy allowing different style
    clone() {
        const p = new DGClone(this);
        DG.addObject(p);
        return p;
    }

    // Recaculate the position of all dependent objects when this object changes
    // this is a template method that handles the order of
    // recalculations, while the coordinate calculations happen within
    // the polimorphic recalceMe method
    recalc() {
        // a topological sort is performed to determine the optimal
        // order of recalculation of dependent objects

        // first a BFS traversal is used to calculate the number of objects that 
        // each relevant object depends on (its degree)
        
        let queue = [];
        const n = DGObject.num_objects;
        const degree = new Array(n).fill(0);
        const objects = new Array(n).fill(null);
        
        function enqueue(obj) {
            degree[obj._ID]++;
            if (objects[obj._ID] == null) {
                objects[obj._ID] = obj;
                queue.push(obj);
            }
        }

        objects[this._ID] = this;
        this._dependent_objects.forEach(enqueue);
        while (queue.length > 0) {
            const obj = queue.shift();
            obj._dependent_objects.forEach(enqueue);
        }

        // next the Kahn's algoritm is performed
        queue = [this._ID];
        while (queue.length > 0) {
            const id = queue.shift();
            objects[id].recalcMe();
            objects[id]._dependent_objects.forEach(obj => {
                if (--degree[obj._ID] == 0)
                    queue.push(obj._ID);
            });
        }
    }

    description(desc) {
        if (desc != undefined) {
            this._style._description = desc;
            DG.draw();
            return this;
        } else {
            const label = this._style._label || "";
            const description = this._style._description || "";
            if (!label)
                return description;
            if (!description)
                return label;
            return label + ": " + description;
        }
    }

    addDescription(desc) {
        this._style._description += desc;
        DG.draw();
        return this;
    }
    
    // this should be overridden
    recalcMe() {
    }

    // check if two objects are equal
    eq(other) {
        if (this.isPoint() && other.isPoint()) {
            return this.cp1().eq(other.cp1());
        }
        if (this instanceof DGCircline && other instanceof DGCircline) {
            return this.circline().eq(other.circline())
        }
        return false;
    }
}

// -----------------------------------------------------------------------------
// clone - shallow copy of object that can have its own style and visibility
// -----------------------------------------------------------------------------

class DGClone extends DGObject {
    constructor(object) {
        super();
        this._object = object;
        this._style = {...this._object.getStyle()};
        return new Proxy(this, this);
    }

    drawMe(view) {
        const old_style = this._object.getStyle();
        this._object.setStyle(this._style, false);
        this._object.drawMe(view);
        this._object.setStyle(old_style, false);
    }

    drawLabel(view) {
        const old_style = this._object.getStyle();
        this._object.setStyle(this._style, false);
        this._object.drawLabel(view);
        this._object.setStyle(old_style, false);
    }

    isPoint() {
        return this._object.isPoint();
    }

    get(target, prop) {
        return this[prop] || this._object[prop];
    }
}


// -----------------------------------------------------------------------------
// free point
// -----------------------------------------------------------------------------
// the point is internally represented by a CP1 object
class DGPoint extends DGObject {
    constructor(x, y) {
        super();

        this._validity_check = undefined;
        if (arguments.length == 2)
            this._valid = this.moveTo(x, y);
        
        return this;
    }

    // fix the point so that it cannot be moved
    fix() {
        this._fixed = true;
        return this;
    }

    // this is the only class that defines free points (points that
    // can be moved by using the mouse, unless they are fixed)
    isFreePoint() {
        if (this._fixed)
            return false;
        return true;
    }

    // this object is a point
    isPoint() {
        return true;
    }

    // user can constrain this point to satisfy some criteria defined
    // by the function fun cp1 -> bool
    validityCheck(fun) {
        this._validity_check = fun;
        return this;
    }

    // trying to move the point to the given position
    // moving is not allowed if the target position does not satisfy
    // the validity check
    moveTo(x, y) {
        if (this._validity_check == undefined || this._validity_check(CP1.of_xy(x, y))) {
            // update the internal CP1 object
            this._coords = new CP1(new Complex(x, y));
            // update all dependent objects
            this.recalc();
            DG.draw();
            // the point was successfully moved
            return true;
        }
        // the point could not be moved
        return false;
    }

    // theoretically, the point can be infinite
    is_inf() {
        return this._coords.is_inf();
    }

    // conversion to complex number (unless infinite)
    to_complex() {
        return this._coords.to_complex();
    }

    // x coordinate (unless infinite)
    x() {
        const c = this.to_complex();
        return c.re;
    }

    // y coordinate (unless infinite)
    y() {
        const c = this.to_complex();
        return c.im;
    }
    
    // both coordinates (unless infinite)
    coords() {
        const c = this.to_complex();
        return [c.re, c.im];
    }

    // internal cp1 representation
    cp1() {
        return this._coords;
    }

    // check equality of two points
    eq(other) {
        if (other instanceof CP1)
            return this.cp1().eq(other);
        if (other.isPoint()) {
            return this.cp1().eq(other.cp1());
        }
        return false;
    }

    // distance to the other point (unless one of them is infinite)
    distance(other) {
        return this.to_complex().sub(other.to_complex()).norm();
    }

    // check if this point is near the given point on the screen
    // (world-to-screen coordinate transform is given)
    isNear(x, y, transform) {
        const [xt, yt] = transform(this.x(), this.y());
        const dist2 = (xt - x)*(xt - x) + (yt - y)*(yt - y);
        const EPS = 5;
        if (this._style._size)
            EPS *= this._style._size;
        return dist2 <= EPS * EPS;
    }

    // drawing the point on the given DGView
    drawMe(view) {
        if (!this.is_inf())
            view.point(this.x(), this.y(), {color: this._style._color, size: this._style._size});
    }

    // drawing the point label on the given DGView 
    drawLabel(view) {
        if (!this.is_inf() && this._style._label)
            view.text(this.x(), this.y(), this._style._label);
    }
}

// -----------------------------------------------------------------------------
// random point
// -----------------------------------------------------------------------------
class DGRandomPoint extends DGPoint {
    constructor(validity_check, xmin, xmax, ymin, ymax) {
        xmin = xmin || -1;
        xmax = xmax || 1;
        ymin = ymin || -1;
        ymax = ymax || 1;
        super();
        this.label("rnd" + this._ID, false);
        this._xmin = xmin; this._xmax = xmax;
        this._ymin = ymin; this._ymax = ymax;
        this._validity_check = validity_check ? validity_check : (p => true);
        this.recalcMe();
    }
    
    // random point is not free
    isFreePoint() {
        return false;
    }

    recalcMe() {
        const MAX_ITER = 100;
        let x, y;
        let i = 0;
        do {
            x = this._xmin + Math.random() * (this._xmax - this._xmin);
            y = this._ymin + Math.random() * (this._ymax - this._ymin);
            this._coords = new CP1(new Complex(x, y));
            i++;
        } while (!this._validity_check(this._coords) && i < MAX_ITER);
        if (i == MAX_ITER)
            throw "Could not generate valid random point";
    }
}

// -----------------------------------------------------------------------------
// joint class for circles and lines
// -----------------------------------------------------------------------------

class DGCircline extends DGObject {
    constructor() {
        super();
    }

    drawMe(view) {
        if (this._circline.is_line()) {
            const [p1, p2] = this._circline.line_points();
            const [x1, y1] = [p1.re, p1.im];
            const [x2, y2] = [p2.re, p2.im];
            const style = {color: this._style._color,
                           width: this._style._width,
                           dash: this._style._dash};
            view.line(x1, y1, x2, y2, style);
        } else {
            const c = this._circline.circle_center();
            const r = this._circline.circle_radius();
            const [x, y] = [c.re, c.im];
            view.circle(x, y, r, {color: this._style._color, width: this._style._width, dash: this._style._dash});
        }
    }

    // drawing the line label on the given DGView 
    drawLabel(view) {
        if (this._circline.is_line() && this._style._label) {
            const [p1, p2] = this._circline.line_points();
            const [x1, y1] = [p1.re, p1.im];
            const [x2, y2] = [p2.re, p2.im];
            view.line_label(x1, y1, x2, y2, this._style._color, this._style._label);
        }
    }

    // return internal representation (FIXME: this should be private)
    circline() {
        return this._circline;
    }

    // return a random point on this circline
    randomPoint(validity_check) {
        return new DGPointOnCircline(this, {"validity_check": validity_check});
    }

    randomPointInDisc(disc, validity_check) {
        return new DGPointOnCircline(this, {"validity_check": validity_check, "disc": disc})
    }
    
    intersect(other) {
        return this.circline().intersect(other.circline());
    }
}

// -----------------------------------------------------------------------------
// straight line between two given points
// -----------------------------------------------------------------------------
// internally the line is represented by a CP1 circline (a Hermitean matrix)
class DGLine extends DGCircline {
    // construct a line given the two points
    constructor(p1, p2) {
        super();
        this._p1 = p1;
        this._p2 = p2;
        // if any of the two points move, this line must be updated
        p1.addDependent(this);
        p2.addDependent(this);
        // initialize the internal circline representation (Hermitean matrix)
        this.recalcMe();
        this.description("Line " + this._p1.label() + this._p2.label());
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._p1._valid && this._p2._valid;
        this._circline = Circline.circline3(this._p1.cp1(), this._p2.cp1(), CP1.inf);
    }

    // find intersection of two lines (infinite point if the lines are parallel)
    static intersect(l1, l2) {
        const p = l1.intersect(l2);
        if (!p[0].is_inf())
            return p[0];
        if (!p[1].is_inf())
            return p[1];
        // both points are infinite (lines are parallel)
        return CP1.inf;
    }

    isLine() {
        return true;
    }

    circline() {
        return this._circline;
    }

    // check if this line is near the given point on the screen
    // (world-to-screen coordinate transform is given)
    isNearLine(x, y, transform) {
        return this._circline.transform(transform).on_circline(CP1.of_complex(new Complex(x, y)));
    }
}

// -----------------------------------------------------------------------------
// a line segment
// -----------------------------------------------------------------------------
class DGSegment extends DGLine {
    constructor(p1, p2) {
        super(p1, p2);
        this.description("Segment " + this._p1.label() + this._p2.label());
    }

    drawMe(view) {
        const [x1, y1] = this._p1.coords();
        const [x2, y2] = this._p2.coords();
        view.segment(x1, y1, x2, y2, {color: this._style._color, width: this._style._width, dash: this._style._dash});
    }

    // drawing the segment label on the given DGView 
    drawLabel(view) {
        // TODO
    }
}

// -----------------------------------------------------------------------------
// a random point on the line
// -----------------------------------------------------------------------------
class DGPointOnCircline extends DGPoint {
    constructor(l, params) {
        super()
        this.label("onCircline" + this._ID, false);
        this._line = l;
        this._validity_check = params.validity_check ? params.validity_check : p => true;
        this._disc = params.disc;
        // if the line moves, this point must be updated
        l.addDependent(this);
        // initialize (randomly) the point coordinates
        this.recalcMe();
        // add the point to the global registry of objects
        DG.addObject(this);
    }

    // recalculate the coordinates
    recalcMe() {
        const MAX_ITER = 100;
        this._valid = this._line._valid;
        let iter = 0;
        do {
            if (this._disc)
                this._coords = this._line.circline().random_point_in_disc(this._disc);
            else
                this._coords = this._line.circline().random_point();
            iter++;
        } while (!this._validity_check(this._coords) && iter < MAX_ITER);
        if (iter == MAX_ITER) {
            this._valid = false;
            console.log(this._line.circline());
            throw "Unable to generate valid random point";
        }
    }
}

// -----------------------------------------------------------------------------
// a circle with a given center and point
// -----------------------------------------------------------------------------
// internally the line is represented by a CP1 circline (a Hermitean matrix)
class DGCircle extends DGCircline {
    constructor(c, p) {
        super();
        this.label("circle" + this._ID, false);
        this._c = c;
        this._p = p;
        // if any of the two points move, this line must be updated
        c.addDependent(this);
        p.addDependent(this);
        this.description("Circle with center in point " + this._c.label() + " containing point " + this._p.label());
        // initialize the internal circline representation (Hermitean matrix)
        this.recalcMe();
    }

    // this is a circle
    isCircle() {
        return true;
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._c._valid && this._p._valid;
        this._r = this._c.distance(this._p);
        this._circline = Circline.mk_circle(this._c.to_complex(), this._r);
    }

    // return the center of the circle
    center() {
        return new DGCircleCenterPoint(this);
    }

    // check if the given CP1 object lies in the current circle disc (boundary excluded)
    inDisc(p) {
        return this._circline.in_disc(p);
    }

    // check if the point (x, y) lies in the current circle disc (boundary excluded)
    inDiscXY(x, y) {
        return this._circline.in_disc(CP1.of_complex(new Complex(x, y)));
    }

    // check if the point (x, y) lies on the current circle
    onCircleXY(x, y) {
        return this._circline.on_circline(CP1.of_complex(new Complex(x, y)), 1e-3);
    }

    // check if this circle is near the given point on the screen
    // (world-to-screen coordinate transform is given)
    isNearCircle(x, y, transform) {
        return res = this._circline.transform(transform).on_circline(CP1.of_complex(new Complex(x, y)));
    }
    

    // intersect a line and a circle
    static intersectLC(l, c) {
        return l.intersect(c);
    }

    // intersect two circles
    static intersectCC(c1, c2) {
        return c1.intersect(c2);
    }
}

// -----------------------------------------------------------------------------
// center of the given circle
// -----------------------------------------------------------------------------
class DGCircleCenterPoint extends DGPoint {
    constructor(c) {
        super();
        this._circle = c;
        // if the circle moves, this point must be updated
        c.addDependent(this);
        // initialize center coordinates
        this.recalcMe();
        // add the center point to the global registry of objects
        DG.addObject(this);
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._circle._valid;
        this._coords = CP1.of_complex(this._circle.circline().circle_center());
    }
}

// -----------------------------------------------------------------------------
// intersection of two lines
// -----------------------------------------------------------------------------
// a finte CP1 point, unless lines are parallel
class DGIntersectLL extends DGPoint {
    constructor(l1, l2) {
        super();
        this._l1 = l1;
        this._l2 = l2;
        this.label("intersectLL" + this._ID, false);
        // if any of the two line line changes, the intersection must be updated
        l1.addDependent(this);
        l2.addDependent(this);

        this.description("Intersect line " + this._l1.label() + " and line " + this._l2.label());
        
        // initialize the coordinates of the intersection
        this.recalcMe();
    }

    // although the intersection is a point, it is not a free point
    isFreePoint() {
        return false;
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._l1._valid && this._l2._valid;
        this._coords = DGLine.intersect(this._l1, this._l2);
    }
}


// -----------------------------------------------------------------------------
// object that represents the set of all intersection points between two
// geometric objects (e.g. a line and a circle, or two circles)
// -----------------------------------------------------------------------------
class DGIntersections extends DGObject {
    constructor() {
        super();
        this.label("intersections" + this._ID, false);
        this.hide();
    }
    
    // creates a single intersection point based on the given
    // selection criterion cp1 -> bool
    intersectionPoint(selectionCriterion) {
        const p = new DGIntersectPoint(this, selectionCriterion, this.description());
        // if this set of all intersection points changes, then the
        // single selected intersection point must be updated
        this.addDependent(p);
        return p;
    }

    // return any intersection point
    any() {
        return this.intersectionPoint(p => true);
    }

    // return both intersection points
    both() {
        return [this.intersectionPoint(0), this.intersectionPoint(1)];
    }

    // return any point that satisfies the given criterion (the point
    // is invalid if no intersections satisfy the given criterion)
    select(selectionFun) {
        return this.intersectionPoint(selectionFun);
    }

    // perform the selection based on the given criterion (this method
    // is called by the single intersection point objects)
    selectPoint(selectionCriterion) {
        if (typeof selectionCriterion == "function") {
            const selected = this._intersections.filter(selectionCriterion);
            if (selected.length > 0)
                return selected[0];
            console.log(selectionCriterion);
            throw "No selected points";
        }
        
        if (typeof selectionCriterion == "number")
            return this._intersections[selectionCriterion];

        throw "Unknown criterion";
    }
}

// -----------------------------------------------------------------------------
// all intersections of a line and a circle
// -----------------------------------------------------------------------------
class DGIntersectLC extends DGIntersections {
    constructor(l, c) {
        super();
        this._l = l;
        this._c = c;
        this.label("intersectLC" + this._ID, false);
        // if the circle or the line changes, the intersection must be updated
        c.addDependent(this);
        l.addDependent(this);
        // set description
        this.description("Interection of line " + this._l.label() + " and circle " + this._c.label());
        // initialize the intersection coordinates
        this.recalcMe();
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._l._valid && this._c._valid;
        this._intersections = DGCircle.intersectLC(this._l, this._c);
    }
}


// -----------------------------------------------------------------------------
// all intersections of two circles
// -----------------------------------------------------------------------------
class DGIntersectCC extends DGIntersections {
    constructor(c1, c2) {
        super();
        this._c1 = c1;
        this._c2 = c2;
        this.label("intersectCC" + this._ID, false);
        // if any of the circles changes, the intersection must be updated
        c1.addDependent(this);
        c2.addDependent(this);
        // initialize the intersection coordinates
        this.recalcMe();
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._c1._valid && this._c2._valid;
        this._intersections = DGCircle.intersectCC(this._c1, this._c2);
    }
}

// -----------------------------------------------------------------------------
// a single intersection point selected from the set of all intersection points
// by some criteria
// -----------------------------------------------------------------------------
class DGIntersectPoint extends DGPoint {
    constructor(intersections, selectionCriterion, description) {
        super();
        this.label("intersectPoint" + this._ID, false);
        this._intersections = intersections;
        this._selectionCriterion = selectionCriterion;
        this.description(description);
        // initialize the coordinates
        this.recalcMe();
        // add this object to the global registry
        DG.addObject(this);
    }

    // although this is a single point, it is not free
    isFreePoint() {
        return false;
    }
    
    // recalculate the coordinates
    recalcMe() {
        // if no point satisfies the selection criterion, then this point is invalid
        this._valid = this._intersections._valid;
        try {
            this._coords = this._intersections.selectPoint(this._selectionCriterion);
        } catch (err) {
            console.log(err);
            this._valid = false;
        }
    }
}

// -----------------------------------------------------------------------------
// condition
// -----------------------------------------------------------------------------

class DGIf extends DGObject {
    constructor(condition, thenObject, elseObject, dependencies) {
        super();
        this._condition = condition;
        this._thenObject = thenObject;
        this._elseObject = elseObject;
        this._dependencies = dependencies;
        thenObject.addDependent(this);
        elseObject.addDependent(this);
        dependencies.forEach(o => o.addDependent(this));
        this.recalcMe();
    }

    isPoint() {
        return this._object.isPoint();
    }

    isLine() {
        return this._object.isLine();
    }

    isCircle() {
        return this._object.isLine();
    }
    
    color(c) {
        this._thenObject.color(c);
        this._elseObject.color(c);
        return this;
    }

    width(w) {
        this._thenObject.width(w);
        this._elseObject.width(w);
        return this;
    }
    
    label(l, show_label, redraw) {
        if (!l)
            return this._object.label();
        else {
            this._thenObject.label(l, show_label, redraw);
            this._elseObject.label(l, show_label, redraw);
            return this;
        }
    }

    showingLabel() {
        return this._object.showingLabel();
    }

    description(d) {
        if (!d)
            return this._object.description();
        else {
            this._thenObject.description(d);
            this._elseObject.description(d);
            return this;
        }
    }

    getStyle() {
        return this._object.getStyle();
    }
    
    setStyle(style, redraw) {
        this._thenObject.setStyle(style, redraw);
        this._elseObject.setStyle(style, redraw);
    }

    is_inf() {
        return this._object.is_inf();
    }
    
    to_complex() {
        return this._object.to_complex();
    }
    
    cp1() {
        return this._object.cp1();
    }

    x() {
        return this._object.x();
    }

    y() {
        return this._object.y();
    }
    
    coords() {
        return this._object.coords();
    }

    distance(other) {
        return this._object.distance(other);
    }

    intersect(l) {
        return this._object.intersect(l);
    }

    circline() {
        return this._object.circline();
    }

    randomPoint() {
        return this._object.randomPoint();
    }

    recalcMe() {
        if (this._condition(...this._dependencies)) {
            this._object = this._thenObject;
        } else {
            this._object = this._elseObject;
        }
        this._valid = this._object._valid;
    }

    drawMe(view) {
        this._object.drawMe(view);
    }

    isNear(x, y, transform) {
        return this._object.isNear(x, y, transform);
    }

    isNearLine(x, y, transform) {
        return this._object.isNearLine(x, y, transform);
    }

    isNearCircle(x, y, transform) {
        return this._object.isNearCircle(x, y, transform);
    }
    
    drawLabel(view) {
        this._object.drawLabel(view);
    }
}

class DGPoincareLine extends DGCircline {
    constructor(p1, p2) {
        super();
        this._p1 = p1;
        this._p2 = p2;
        // if any of the two points move, this line must be updated
        p1.addDependent(this);
        p2.addDependent(this);
        // initialize the internal circline representation (Hermitean matrix)
        this.recalcMe();
    }

    recalcMe() {
        const u = this._p1.cp1().to_complex();
        const v = this._p2.cp1().to_complex();
        const A = Complex.i.mult((u.mult(v.cnj())).sub(v.mult(u.cnj())));
        const B = Complex.i.mult(v.scale(u.norm2() + 1).sub(u.scale(v.norm2() + 1)));
        this._circline = new Circline(A, B, B.cnj(), A);
        this._valid = this._p1._valid && this._p2._valid;
    }
}

class DGPoincareCircle extends DGCircline {
    constructor(c, p) {
        super();
        this._c = c;
        this._p = p;
        // if any of the two points move, this line must be updated
        c.addDependent(this);
        p.addDependent(this);
        // initialize the circline
        this.recalcMe();
    }

    recalcMe() {
        const u = this._c.cp1().to_complex();
        const v = this._p.cp1().to_complex();
        const r = Math.acosh(1 + (2 * u.sub(v).norm2()) / ((1 - u.norm2())* (1 - v.norm2())));
        const ue = u.scale(1 / ((1 - u.norm2())*(Math.cosh(r) - 1)/2 + 1));
        const re = ((1 - u.norm2()) * Math.sinh(r)) / ((1 - u.norm2()) * (Math.cosh(r) - 1) + 2);
        this._circline = Circline.mk_circle(ue, re);
        this._valid = this._c._valid && this._p._valid;
    }
}

export { DGPoint, DGLine, DGCircle, DGSegment, DGClone, DGRandomPoint, DGCircleCenterPoint, DGIntersectLL, DGIntersectLC, DGIntersectCC, DGIf, DGPoincareLine, DGPoincareCircle };
