import { DG } from './dg.js';
import { Circline } from './complex_geom.js';

// free point
function point(x, y) {
    return DG.Point(x, y);
}

const free = point;

// line AB
// det: A != B
function line(A, B) {
    return DG.Line(A, B);
}

// segment AB
// det: A != B
function segment(A, B) {
    return DG.Segment(A, B);
}

// intersection of lines l1 and l2
// non-deg: !parallel(l1, l2)
// det: l1 != l2
function intersectLL(l1, l2) {
    return DG.IntersectLL(l1, l2);
}

// both intersections of line l and circle c
// non-deg: l intersects c
function intersectLC(l, c) {
    return DG.IntersectLC(l, c).both();
}

// other intersection of line l and circle c (different from given point A)
// non-deg: l intersects c (in two points)
function intersectLC_other(l, c, A) {
    const I = DG.IntersectLC(l, c).select(p => !p.eq(A.cp1()))
    I.description("Intersect line " + l.label() + " and circle " + c.label());
    return I;
}

// circle centered at C containing A
// non-deg: C != A
function circle(C, A) {
    return DG.Circle(C, A);
}

// both intersection of circles c1 and c2
// non-deg: c1 intersects c2
// det: c1 != c2
function intersectCC(c1, c2) {
    return DG.IntersectCC(c1, c2).both();
}

// other intersection of circles c1 and c2 (different from the given point A)
// non-deg: c1 intersects c2 (in two different points)
// det: c1 != c2
function intersectCC_other(c1, c2, A) {
    return DG.IntersectCC(c1, c2).select(p => !p.eq(A.cp1()));
}

// bisector of segment AB
// nondeg: A != B
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
// non-deg: A != B
function circle_over_segment(A, B) {
    const l1 = line(A, B).hide();
    const l2 = bisector(A, B).hide();
    const M = intersectLL(l1, l2).hide();
    return circle(M, A);
}

// line perpendicular to line l containing point A
function drop_perp(l, A) {
    const B = l.randomPoint().hide(); // FIXME: diffferent from A
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

// circle centered at point A that touches line l
// non-deg: A not on l
function touching_circle(A, l) {
    const p = drop_perp(l, A).hide();
    const M = intersectLL(p, l).hide();
    const c = circle(A, M);
    c.description("Circle centered in " + A.label() + " touching line " + l.label());
    return c;
}

// both tangents from point A that touch circle c
// non-deg: A outside c
function tangents(A, c) {
    const O = c.center().hide();
    const c1 = circle_over_segment(O, A).hide();
    const [X1, X2] = intersectCC(c, c1).map(p => p.hide());
    return [line(A, X1).hide(), line(A, X2).hide()];
}

// tangent from point A that touch circle c, that is different from the given line t
// non-deg: A outside c
function other_tangent(A, c, t) {
    const [t1, t2] = tangents(A, c);
    const t_ = DG.If((x, y) => x.eq(y), t2, t1, [t, t1]);
    t_.description("Tangent from point " + A.label() + " to circle " + c.label());
    return t_.show();
}

// homothety of a line
function homothety_line() {
    // TODO
}

// parallel line to line l that contains point A 
function parallel(l, A) {
    const n = drop_perp(l, A).hide();
    return drop_perp(n, A);
}


// point Z such that XY : XZ = p : q
function towards_aux(X, Y, p, q) {
    const pp = Math.abs(p), qq = Math.abs(q);
    
    const M = DG.RandomPoint().hide();
    // change M whenever X and Y change
    X.addDependent(M); Y.addDependent(M);
    const l = line(X, M).hide();
    const points = [X, M];
    for (let i = 0; i < Math.max(pp, qq); i++) {
        const O = points[points.length - 1];
        const A = points[points.length - 2];
        const c = circle(O, A).hide();
        const MM = intersectLC_other(l, c, A).hide();
        points.push(MM);
    }

    const p1 = line(Y, points[pp]).hide();
    const p2 = parallel(p1, points[qq]).hide();
    const xy = line(X, Y).hide();
    let Z =  intersectLL(xy, p2).hide();

    if (p*q < 0)
        Z = reflectP(X, Z).hide();
    
    return DG.If((X, Y) => X.eq(Y), X.clone().hide(), Z, [X, Y]);
}

// point B such that vector AB equals vector XY
function translate_vec(X, Y, A) {
    const xy = line(X, Y).hide();
    const xa = line(X, A).hide();
    const p1 = parallel(xy, A).hide();
    const p2 = parallel(xa, Y).hide();
    const B = intersectLL(p1, p2).hide();
    return DG.If((X, Y) => X.eq(Y),
                 A.clone().hide(),
                 DG.If((X, A) => X.eq(A),
                       Y.clone().hide(),
                       B,
                       [X, A]).hide(),
                 [X, Y]);
}

// point W such that XY : ZW = p : q
function towards(X, Y, Z, p, q) {
    const YY = towards_aux(X, Y, p, q).hide();
    const w = translate_vec(X, YY, Z).show();
    w.description("Point X such that " + X.label() + Y.label() + ":" + Z.label() + "X" + " = " + p + ":" + q);
    return w;
}


// angle divide
function angle_divide() {
    // TODO
}

// a line that bisect the angle BAC
function angle_bisector(B, A, C) {
    const k = circle(A, B).hide();
    const c = line(A, B).hide();
    const b = line(A, C).hide();
    const X = DG.IntersectLC(b, k).select(p => Circline.same_side(p, C.cp1(), A.cp1())).hide();
    const k1 = circle(B, X).hide();
    const k2 = circle(X, B).hide();
    const Y = DG.IntersectCC(k1, k2).any().hide();
    const l = line(A, Y);
    return l;
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

// reflection of point A around line l
function reflectL(l, A) {
    const p = drop_perp(l, A).hide();
    const M = intersectLL(p, l).hide();
    const c = circle(M, A).hide();
    const AA = intersectLC_other(p, c, A).hide();
    const r = DG.If((A, M) => A.eq(M), A.clone().hide(), AA, [A, M]);
    r.description("Reflect point " + A.label() + " over line " + l.label());
    return r;
}

// circumcenter of triangle ABC 
function circle3_center(A, B, C) {
    const ma = bisector(B, C).hide();
    const mb = bisector(A, C).hide();
    const O = intersectLL(ma, mb);
    return O;
}

// point D such that H(A, B, C, D)=-1 
// non-deg: collinear A, B, C and C != A and C != B and C is not midpoint of AB
function harmonic_conjugate(A, B, C) {
    const R = DG.RandomPoint().hide();
    A.addDependent(R); B.addDependent(R); C.addDependent(R);
    const ra = line(R, A).hide();
    const rb = line(R, B).hide();
    const Q = ra.randomPoint().hide();
    const qc = line(Q, C).hide();
    const P = intersectLL(rb, qc).hide();
    const ap = line(A, P).hide();
    const bq = line(B, Q).hide();
    const S = intersectLL(ap, bq).hide();
    const ab = line(A, B).hide();
    const rs = line(R, S).hide();
    return intersectLL(ab, rs);
}

// all significant points of the triangle
function triangle(A, B, C) {
    const elements = [A, B, C];
    const a = line(B, C).label("a").width(2); elements.push(a);
    const b = line(A, C).label("b").width(2); elements.push(b);
    const c = line(A, B).label("c").width(2); elements.push(c);
    const ha = drop_perp(a, A).color("red").label("h_{a}"); elements.push(ha);
    const hb = drop_perp(b, B).color("red").label("h_{b}"); elements.push(hb);
    const hc = drop_perp(c, C).color("red").label("h_{c}"); elements.push(hc);
    const H = intersectLL(ha, hb).color("red").label("H"); elements.push(H);
    const Ha = intersectLL(ha, a).color("red").label("H_{a}"); elements.push(Ha);
    const Hb = intersectLL(hb, b).color("red").label("H_{b}"); elements.push(Hb);
    const Hc = intersectLL(hc, c).color("red").label("H_{c}"); elements.push(Hc);
    const Ma = midpoint(B, C).color("green").label("M_{a}"); elements.push(Ma);
    const Mb = midpoint(A, C).color("green").label("M_{b}"); elements.push(Mb);
    const Mc = midpoint(A, B).color("green").label("M_{c}"); elements.push(Mc);
    const ka = circle(Ma, B).color("cyan").label("k(M_{a},B)"); elements.push(ka);
    const kb = circle(Mb, C).color("cyan").label("k(M_{b},C)"); elements.push(kb);
    const kc = circle(Mc, A).color("cyan").label("k(M_{c},A)"); elements.push(kc);
    const ba = bisector(B, C).color("blue").label("b_{a}"); elements.push(ba);
    const bb = bisector(A, C).color("blue").label("b_{b}"); elements.push(bb);
    const bc = bisector(A, B).color("blue").label("b_{c}"); elements.push(bc);
    const O = intersectLL(ba, bb).color("blue").label("O"); elements.push(O);
    const o = circle(O, A).color("blue"); elements.push(o);
    const ma = line(A, Ma).color("green").label("m_{a}"); elements.push(ma);
    const mb = line(B, Mb).color("green").label("m_{b}"); elements.push(mb);
    const mc = line(C, Mc).color("green").label("m_{c}"); elements.push(mc);
    const G = intersectLL(ma, mb).color("green").label("G"); elements.push(G);
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
    
    const e = line(O, H).color("purple").label("e").dashed(); elements.push(e);
    const Ea = midpoint(A, H).color("purple").label("E_{a}"); elements.push(Ea);
    const Eb = midpoint(B, H).color("purple").label("E_{b}"); elements.push(Eb);
    const Ec = midpoint(C, H).color("purple").label("E_{c}"); elements.push(Ec);
    const N = circle3_center(Ma, Mb, Mc).color("purple").label("N"); elements.push(N);
    const Ek = circle(N, Ma).color("purple").label("Ec").dashed(); elements.push(Ek);
    
    const Na = intersectLL(ba, ia).label("N_{a}").color("pink"); elements.push(Na);
    const Nb = intersectLL(bb, ib).label("N_{b}").color("pink"); elements.push(Nb);
    const Nc = intersectLL(bc, ic).label("N_{c}").color("pink"); elements.push(Nc);
    elements.map(obj => obj.hide());
    return elements;
}


export {
    point, free,
    line,
    segment,
    circle,
    intersectLL,
    intersectLC,
    intersectLC_other,
    intersectCC,
    intersectCC_other,

    bisector,
    drop_perp,
    foot,
    parallel,

    midpoint,
    reflectP,
    reflectL,
    
    circle_over_segment,
    circle3_center,
    touching_circle,
    tangents,
    other_tangent,
    
    towards,
    angle_bisector,
    angle_divide,
    
    harmonic_conjugate,

    triangle
};
