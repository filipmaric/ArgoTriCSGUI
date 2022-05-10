import { Complex } from './complex.js';
import { CP1 } from './cp1.js';
import { ComplexMatrix2x2 } from './complex_matrix.js';
import { Moebius } from './moebius.js';

class Circline {
    constructor(A, B, C, D) {
        if (arguments.length == 1 && arguments[0] instanceof ComplexMatrix2x2)
            this.H = arguments[0];
        else {
            if (!A.is_zero()) {
                const a = 1 / A.norm();
                A = A.scale(a);
                B = B.scale(a);
                C = C.scale(a);
                D = D.scale(a);
            }
            this.H = new ComplexMatrix2x2(A, B, C, D);
        }
    }

    static mk_circle(a, r) {
        return new Circline(Complex.one, a.uminus(),
                            a.cnj().uminus(), a.mult(a.cnj()).sub(Complex.of_real(r*r)));
    }

    static mk_line(z1, z2) {
        const B = z2.sub(z1).mult(Complex.i);
        return new Circline(Complex.zero, B,
                            B.cnj(), Complex.cnj_mix(B.uminus(), z1));
    }
    
    on_circline(z, eps) {
        if (!eps)
            eps = 1e-2;
        return (z.conjugate().vec_mult(this.H.multCP1(z))).is_zero(eps);
    }

    in_disc(z) {
        const EPS = 1e-12;
        const v = z.conjugate().vec_mult(this.H.multCP1(z));
        return v.re < -EPS;
    }

    is_line() {
        return this.H.A.is_zero();
    }

    is_circle() {
        return !this.is_line();
    }

    circle_center() {
        return this.H.B.uminus().div(this.H.A);
    }

    circle_radius() {
        return Math.sqrt(this.H.B.mult(this.H.C).sub(this.H.A.mult(this.H.D)).div(this.H.A.mult(this.H.A)).re);
    }

    line_points() {
        const z1 = this.H.D.mult(this.H.B).uminus().div(this.H.B.mult(this.H.C).scale(2));
        const z2 = z1.add(Complex.i.mult((this.H.B.arg() > 0 ? this.H.B.uminus() : this.H.B).sgn()));
        return [z1, z2];
    }

    static unit_circle() {
        return new Circline(Complex.one, Complex.zero, Complex.zero, Complex.minus_one);
    }

    static x_axis() {
        return new Circline(Complex.zero, Complex.i, Complex.minus_i, Complex.zero);
    }

    static y_axis() {
        return new Circline(Complex.zero, Complex.one, Complex.one, Complex.zero);
    }

    static circline3(z1, z2, z3) {
        const M = Moebius.moebius_01inf(z1, z2, z3);
        return M.inv().moebius_circline(Circline.x_axis());
    }

    static same_arc(w1, z1, w2, z2) {
        const cr = CP1.cross_ratio(w1, z1, w2, z2);
        return !cr.is_inf() && cr.to_complex().is_real() && cr.to_complex().re >= 0;
    }

    static other_arc(w1, z1, w2, z2) {
        const cr = CP1.cross_ratio(w1, z1, w2, z2);
        return !cr.is_inf() && cr.to_complex().is_real() && cr.to_complex().re < 0;
    }
    
    static same_circle(w1, z1, w2, z2) {
        const cr = CP1.cross_ratio(w1, z1, w2, z2);
        return cr.is_inf() || cr.to_complex().is_real();
    }

    // on a line
    static between(z1, w, z2) {
        return Circline.other_arc(CP1.inf, z1, w, z2);
    }

    // on a line
    static collinear(z1, z2, z3) {
        return Circline.same_circle(z1, z2, z3, CP1.inf);
    }

    // on a line
    static same_side(w1, w2, z1) {
        return Circline.collinear(w1, w2, z1) && !Circline.between(w1, z1, w2);
    }

    // on a poincare line 
    static h_between(z1, w, z2) {
        return Circline.other_arc(w, z1, w.inversion(), z2);
    }

    three_points() {
        if (!this._three_points) {
            if (this.is_line()) {
                const [z1, z2] = this.line_points();
                this._three_points = [z1, z2, z1.add(z2.sub(z1).scale(2))];
            } else {
                const c = this.circle_center();
                const r = this.circle_radius();
                this._three_points = [c.add(Complex.of_real(r)), c.add(Complex.of_real(-r)), c.add(Complex.of_imag(r))];
            }
        }
        return this._three_points;
    }

    random_point() {
        const [z1, z2, z3] = this.three_points().map(p => CP1.of_complex(p));
        const M = Moebius.moebius_01inf(z1, z2, z3);
        const part = Math.floor(Math.random() * 3);
        let x;
        if (part == 0)
            // [0, 1]
            x = Math.random();
        else if (part == 1)
            // [1, infty]
            x = 1 / Math.random();
        else
            // [-infty, 0]
            x = 1 - 1 / Math.random();

        return M.inv().moebius_pt(CP1.of_real(x));
    }

    random_point_in_disc(disc) {
        const [p1, p2] = this.intersect(disc);
        const [z1, z2, z3] = this.three_points().map(p => CP1.of_complex(p));
        const M = Moebius.moebius_01inf(z1, z2, z3);
        const [x1, x2] = [p1, p2].map(p => M.moebius_pt(p).to_complex().re).sort()
        let p;
        const MAX_ITER = 100;
        let iter = 0;
        do {
            let x;
            if (Math.random() < 0.5)
                x = x1 + Math.random() * (x2 - x1);
            else {
                const k = Math.floor(5*Math.random());
                const d = Math.pow(10, k)*Math.random();
                x = Math.random() < 0.5 ? x1 - d : x2 + d;
            }
            p = M.inv().moebius_pt(CP1.of_real(x));
            iter++;
        } while (!disc.in_disc(p) || iter >= MAX_ITER);        
        return p;
    }

    moebius_to_xaxis() {
        if (!this._moebius_to_xaxis) {
            const [z1, z2, z3] = this.three_points().map(p => CP1.of_complex(p));
            this._moebius_to_xaxis = Moebius.moebius_01inf(z1, z2, z3);
        }
        return this._moebius_to_xaxis;
    }

    intersect(other) {
        const M = this.moebius_to_xaxis();
        const cm = M.moebius_circline(other);
        const [A, B, D] = [cm.H.A, cm.H.B, cm.H.D];
        let p1, p2;
        if (A.is_zero()) {
            p1 = CP1.inf;
            if (B.is_imag())
                return [p1, p1];
            p2 = CP1.of_real(- D.re / (2 * B.re));
            return [p1, p2].map(p => M.moebius_inv_pt(p));
        } else {
            const discr = B.re * B.re - A.re * D.re;
            if (discr <= 0) {
                const sqrt = Math.sqrt(-discr);
                const [p1, p2] = [new Complex(-B.re / A.re, +sqrt / A.re),
                                  new Complex(-B.re / A.re, -sqrt / A.re)];
                return [p1, p2].map(p => M.moebius_inv_pt(CP1.of_complex(p)));
            } else {
                const sqrt = Math.sqrt(discr);
                const [p1, p2] = [(-B.re + sqrt) / A.re,
                                  (-B.re - sqrt) / A.re];
                return [p1, p2].map(p => M.moebius_inv_pt(CP1.of_real(p)));
            }
        }
    }


    transform(t) {
        let three_points = this.three_points();
        if (three_points.some(p => isNaN(p.re)))
            return this;
        three_points = three_points.map(p => {
            const [re, im] = t(p.re, p.im);
            return CP1.of_complex(new Complex(re, im));
        });
        return Circline.circline3(...three_points);
    }

    normalize() {
        if (!this.H.A.is_zero()) {
            this.H = this.H.multC(this.H.A.recip());
        } else if (!this.H.D.is_zero()) {
            this.H = this.H.multC(this.H.D.recip());
        } else {
            this.H = this.H.multC(this.H.B.recip());
        }
    }

    eq(other) {
        this.normalize();
        other.normalize();
        return this.H.A.eq(other.H.A) && this.H.B.eq(other.H.B) && this.H.C.eq(other.H.C) && this.H.D.eq(other.H.D);
    }
}

export { Circline };
