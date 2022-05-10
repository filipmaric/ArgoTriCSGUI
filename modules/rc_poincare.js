import { DG } from './dg.js';
import { CP1 } from './complex_geom.js';
import { Circline } from './complex_geom.js';

function absolute() {
    const O = DG.Point(0, 0).hide();
    const X = DG.Point(0, 1).hide();
    return DG.Circle(O, X);
}

const unit_circle = Circline.unit_circle();
const in_disc = p => unit_circle.in_disc(p);

// free point (must be in the unit disc)
function point(x, y) {
    return DG.Point(x, y, in_disc);
}

const free = point;

// line AB
function line(A, B) {
    return DG.PoincareLine(A, B);
}

// intersection of lines l1 and l2
function intersectLL(l1, l2) {
    return DG.IntersectCC(l1, l2).select(in_disc);
}

// both intersections of line l and circle c
function intersectLC(l, c) {
    return DG.IntersectCC(l, c).both();
}

// other intersection of line l and circle c (different from given point A)
function intersectLC_other(l, c, A) {
    return DG.IntersectCC(l, c).select(p => !p.eq(A.cp1()));
}

// circle centered at O containing A
function circle(O, A) {
    return DG.PoincareCircle(O, A);
}

// both intersection of circles c1 and c2
function intersectCC(c1, c2) {
    return DG.IntersectCC(c1, c2).both();
}

// other intersection of circles c1 and c2 (different from the given point A)
function intersectCC_other(c1, c2, A) {
    return DG.IntersectCC(c1, c2).select(p => !p.eq(A.cp1()));
}

// bisector of segment AB
function bisector(A, B) {
    const c1 = circle(A, B).hide();
    const c2 = circle(B, A).hide();
    const [X1, X2] = intersectCC(c1, c2).map(p => p.hide());
    const m = line(X1, X2);
    m.description("Bisector of segment " + A.label() + B.label());
    return m;
}

// midpoint of segment AB
function midpoint(A, B) {
    const m = bisector(A, B).hide();
    const l = line(A, B).hide();
    const M = intersectLL(m, l).hide();
    const Mp = DG.If((A, B) => A.eq(B), B.clone().hide(), M, [A, B]);
    Mp.description("Midpoint of segment " + A.label() + B.label());
    return Mp;
}

// circle over segment AB
function circle_over_segment(A, B) {
    const l1 = line(A, B).hide();
    const l2 = bisector(A, B).hide();
    const M = intersectLL(l1, l2).hide();
    return circle(M, A);
}


// line perpendicular to line l containing point A
function drop_perp(l, A) {
    const B = l.randomPointInDisc(unit_circle).hide(); // FIXME: diffferent from A
    const c = circle(A, B).hide();
    const [X1, X2] = intersectLC(l, c).map(p => p.hide());
    const m = bisector(X1, X2);
    m.description("Drop perpendicular from point " + A.label() + " onto line " + l.label());
    return m;
}

// foot of the perpendicular projection of point A onto line l
function foot(l, A)  {
    const p = drop_perp(l, A).hide();
    const X = intersectLL(p, l);
    X.description("Project point " + A.label() + " onto line " + l.label());
    return X;
}

// reflection of point B around point O
function reflectP(O, B) {
    const l = line(O, B).hide();
    const c = circle(O, B).hide();
    const BB = intersectLC_other(l, c, B).hide();
    const r = DG.If((O, B) => O.eq(B), B.clone().hide(), BB, [O, B]);
    r.description("Reflect point " + B.label() + " over point " + O.label());
    return r;
}

// reflection of pointb A around line l
function reflectL(l, A) {
    const p = drop_perp(l, A).hide();
    const M = intersectLL(p, l).hide();
    const c = circle(M, A).hide();
    const AA = intersectLC_other(p, c, A).hide();
    const r = DG.If((A, M) => A.eq(M), A.clone().hide(), AA, [A, M]);
    r.description("Reflect point " + A.label() + " over line " + l.label());
    return r;
}

// reflection of line l around point O 
function reflectP_line(O, l) {
    var B1 = l.randomPointInDisc(unit_circle).hide();
    var B2 = l.randomPointInDisc(unit_circle, !B1.eq(p)).hide();
    var B1p = reflectP(O, B1).hide();
    var B2p = reflectP(O, B2).hide();
    var lp = line(B1p, B2p);
    return lp;
}


// circle centered at point A that touches line l
function touching_circle(A, l) {
    const p = drop_perp(l, A).hide();
    const M = intersectLL(p, l).hide();
    const c = circle(A, M);
    c.description("Circle centered in " + A.label() + " touching line " + l.label());
    return c;
}


// both tangents from point A that touch circle c centered at O
// FIXME: remove parameter O
function tangents(A, O, c) {
    var T = c.randomPointInDisc(unit_circle).hide();
    var ot = line(O, T).hide();
    var t = drop_perp(ot, T).hide();
    var cA = circle(O, A).width(3).hide();
    var [X1, X2] = intersectLC(t, cA).map(p => p.hide());

    var p1 = bisector(X1, A).hide();
    var T1 = reflectL(p1, T).hide();
    var t1 = line(A, T1);
    
    var p2 = bisector(X2, A).hide();
    var T2 = reflectL(p2, T).hide();
    var t2 = line(A, T2);

    return [t1, t2];
}

// tangent from point A that touch circle c, that is different from the given line t
function other_tangent(A, O, c, t) {
    const [t1, t2] = tangents(A, O, c).map(t => t.hide());
    const t_ = DG.If((x, y) => x.eq(y), t2, t1, [t, t1]);
    t_.description("Tangent from point " + A.label() + " to circle " + c.label());
    return t_;
}


// hyperparallel line to line l that contains point A 
function hyperparallel(l, A) {
    const n = drop_perp(l, A).hide();
    return drop_perp(n, A);
}

// a line that bisect the angle BAC
function angle_bisector(B, A, C) {
    const k = circle(A, B).hide();
    const c = line(A, B).hide();
    const b = line(A, C).hide();
    const X = DG.IntersectCC(b, k).select(p => !Circline.h_between(p, A.cp1(), C.cp1())).hide();
    const k1 = circle(B, X).hide();
    const k2 = circle(X, B).hide();
    const Y = DG.IntersectCC(k1, k2).any().hide();
    const l = line(A, Y);
    return l;
}

function triangle(A, B, C) {
    const elements = [A, B, C];
    const a = line(B, C).label("a").width(2); elements.push(a);
    const b = line(A, C).label("b").width(2); elements.push(b);
    const c = line(A, B).label("c").width(2); elements.push(c);

    const Ma = midpoint(B, C).color("green").label("M_{a}"); elements.push(Ma);
    const Mb = midpoint(A, C).color("green").label("M_{b}"); elements.push(Mb);
    const Mc = midpoint(A, B).color("green").label("M_{c}"); elements.push(Mc);
    
    const ba = bisector(B, C).color("blue").label("b_{a}"); elements.push(ba);
    const bb = bisector(A, C).color("blue").label("b_{b}"); elements.push(bb);
    const bc = bisector(A, B).color("blue").label("b_{c}"); elements.push(bc);
    const O = intersectLL(ba, bb).color("blue").label("O"); elements.push(O);

    const o = circle(O, A).color("blue"); elements.push(o);

    const ia = angle_bisector(B, A, C).color("orange").label("i_{a}"); elements.push(ia);
    const ib = angle_bisector(A, B, C).color("orange").label("i_{b}"); elements.push(ib);
    const ic = angle_bisector(B, C, A).color("orange").label("i_{c}"); elements.push(ic);
    const I = intersectLL(ia, ib).color("orange").label("I"); elements.push(I);
    const ta = drop_perp(a, I).color("yellow").label("t_{a}"); elements.push(ta);
    const tb = drop_perp(b, I).color("yellow").label("t_{b}"); elements.push(tb);
    const tc = drop_perp(c, I).color("yellow").label("t_{c}"); elements.push(tc);
    const Ta = intersectLL(ta, a).color("yellow").label("T_{a}"); elements.push(Ta);
    const Tb = intersectLL(tb, b).color("yellow").label("T_{b}"); elements.push(Tb);
    const Tc = intersectLL(tc, c).color("yellow").label("T_{c}"); elements.push(Tc);
    const i = circle(I, Ta).color("orange").label("i"); elements.push(i);

    elements.map(obj => obj.hide());
    return elements;
}


export {
    absolute,
    
    point, free,

    intersectLL,
    intersectLC,
    intersectLC_other,
    intersectCC,
    intersectCC_other,

    midpoint,
    reflectP,
    reflectL,

    bisector,
    drop_perp,
    foot,
    
    triangle
};
