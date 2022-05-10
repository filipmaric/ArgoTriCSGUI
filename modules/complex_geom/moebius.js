import { Complex } from './complex.js';
import { ComplexMatrix2x2 } from './complex_matrix.js';
import { Circline } from './circline.js';

/**
 * Moebius transform (az + b) / (cz + d) acting on points of CP1
 */
class Moebius {
    constructor(A, B, C, D) {
        if (arguments.length == 1 && A instanceof ComplexMatrix2x2) {
            this.construct(A.A, A.B, A.C, A.D);
        } else {
            this.construct(A, B, C, D);
        }
    }

    construct(A, B, C, D) {
        if (!A.is_zero()) {
            B = B.div(A);
            C = C.div(A);
            D = D.div(A);
            A = A.div(A); // must be last
        }
        else {
            const b = B.norm();
            A = A.scale(1 / b);
            B = B.scale(1 / b);
            C = C.scale(1 / b);
            D = D.scale(1 / b);
        }
        this.M = new ComplexMatrix2x2(A, B, C, D);
    }

    moebius_pt(z) {
        if (z instanceof Complex)
            z = CP1.of_complex(z);
        return this.M.multCP1(z);
    }

    moebius_inv_pt(z) {
        if (z instanceof Complex)
            z = CP1.of_complex(z);
        return this.M.multInvCP1(z);
    }

    moebius_circline(c) {
        return new Circline(c.H.congruence(this.M.inv()));
    }

    static id() {
        return new Moebius(ComplexMatrix2x2.eye());
    }

    inv() {
        return new Moebius(this.M.inv());
    }

    comp(other) {
        return new Moebius(this.M.multM(other.M));
    }

    static moebius_01inf(w1, w2, w3) {
        const m23 = w2.z1.mult(w3.z2).sub(w3.z1.mult(w2.z2));
        const m21 = w2.z1.mult(w1.z2).sub(w1.z1.mult(w2.z2));
        const m13 = w1.z1.mult(w3.z2).sub(w3.z1.mult(w1.z2));
        return new Moebius(w1.z2.mult(m23), w1.z1.mult(m23).uminus(),
                           w3.z2.mult(m21), w3.z1.mult(m21).uminus());
    }
}

export { Moebius };
