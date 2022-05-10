import { Complex } from './complex.js';
import { CP1 } from './cp1.js';

class ComplexMatrix2x2 {
    constructor(A, B, C, D) {
        this.A = A;
        this.B = B;
        this.C = C;
        this.D = D;
    }

    static zero() {
        return new ComplexMatrix2x2(Complex.zero, Complex.zero,
                                    Complex.zero, Complex.zero);
    }

    static eye() {
        return new ComplexMatrix2x2(Complex.one, Complex.zero,
                                    Complex.zero, Complex.one);
    }

    cnj() {
        return new ComplexMatrix2x2(this.A.cnj(), this.B.cnj(),
                                    this.C.cnj(), this.D.cnj());
    }

    transpose() {
        return new ComplexMatrix2x2(this.A, this.C,
                                    this.B, this.D);
    }

    adj() {
        return this.cnj().transpose();
    }

    det() {
        return this.A.mult(this.D).sub(this.B.mult(this.C));
    }

    inv() {
        if (!this._inv)
            this._inv = new ComplexMatrix2x2(this.D, this.B.uminus(),
                                             this.C.uminus(), this.A).multC(this.det().recip());
        return this._inv;
    }

    qr() {
        if (this._Q == undefined || this._R == undefined) {
            const s0 = this.C.cnj();
            const c0 = this.A.cnj();
            const n = Math.sqrt(s0.norm2() + c0.norm2());
            const c = c0.scale(1 / n);
            const s = s0.scale(1 / n);
            const Qa = new ComplexMatrix2x2(c, s,
                                            s.cnj().uminus(), c.cnj());
            this._Q = Qa.adj();
            this._R = Qa.multM(this);
        }
        return [this._Q, this._R];
    }
    
    eq(other) {
        return this.A.eq(other.A) && this.B.eq(other.B) &&
               this.C.eq(other.C) && this.D.eq(other.D);
    }

    is_hermitean() {
        return this.eq(this.adj());
    }

    is_zero() {
        return this.eq(ComplexMatrix2x2.zero());
    }

    multC(obj) {
        return new ComplexMatrix2x2(this.A.mult(obj), this.B.mult(obj),
                                    this.C.mult(obj), this.D.mult(obj));
    }

    multCP1(obj) {
        return new CP1(this.A.mult(obj.z1).add(this.B.mult(obj.z2)),
                       this.C.mult(obj.z1).add(this.D.mult(obj.z2)));
    }

    multInvCP1(obj) {
        const [Q, R] = this.qr();
        const rhs = Q.adj().multCP1(obj);
        const z2 = rhs.z2.div(R.D);
        const z1  = rhs.z1.sub(R.B.mult(z2)).div(R.A);
        return new CP1(z1, z2);
    }

    multM(obj) {
        return new ComplexMatrix2x2(this.A.mult(obj.A).add(this.B.mult(obj.C)),
                                    this.A.mult(obj.B).add(this.B.mult(obj.D)),
                                    this.C.mult(obj.A).add(this.D.mult(obj.C)),
                                    this.C.mult(obj.B).add(this.D.mult(obj.D)));
    }

    congruence(P) {
        return P.adj().multM(this.multM(P));
    }
}

export { ComplexMatrix2x2 };

/*
class Matrix3x3 {
    constructor() {
        if (arguments.length == 1)
            this.M = arguments[0];
        else if (arguments.length == 9)
            this.M = [[arguments[0], arguments[1], arguments[2]],
                      [arguments[3], arguments[4], arguments[5]],
                      [arguments[6], arguments[7], arguments[8]]];
    }


    static zero() {
        return new Matrix3x3([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    }

    static eye() {
        return new Matrix3x3([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    }

    transpose() {
        const M = Matrix3x3.zero();
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                M[i][j] = this.M[j][i];
        return M;
    }

    det() {
        const M = this.M;
        return  M[0][0]*M[1][1]*M[2][2] + M[0][1]*M[1][2]*M[2][0] + M[0][2]*M[1][0]*M[2][1]
              - M[2][0]*M[1][1]*M[0][2] - M[2][1]*M[1][2]*M[0][0] - M[2][2]*M[1][0]*M[0][1];
    }

    mult() {
        if (arguments.length == 1 && typeof arguments[0] == "number") {
            const M = this.M;
            const MM = new Matrix3x3(M[0][0], M[0][1], M[0][2], M[1][0], M[1][1], M[1][2], M[2][0], M[2][1], M[2][2]);
            for (let i = 0; i < 3; i++)
                for (let j = 0; j < 3; j++)
                    MM.M[i][j] *= arguments[0];
            return MM;
        }

        if (arguments.length == 1 && arguments[0] instanceof Matrix3x3) {
            const M = Matrix3x3.zero();
            for (let i = 0; i < 3; i++)
                for (let j = 0; j < 3; j++)
                    for (let k = 0; k < 3; k++)
                        M.M[i][j] += this.M[i][k] * arguments[0].M[k][j];
            return M.M;
        }
            
        throw "Not supported";
    }

    inv() {
        function d(a, b, c, d) {
            return a*d - b*c;
        }
        const M = this.M;
        return new Matrix3x3(d(M[1][1], M[1][2], M[2][1], M[2][2]), d(M[0][2], M[0][1], M[2][2], M[2][1]), d(M[0][1], M[0][2], M[1][1], M[1][2]),
                             d(M[1][2], M[1][0], M[2][2], M[2][0]), d(M[0][0], M[0][2], M[2][0], M[2][2]), d(M[0][2], M[0][0], M[1][2], M[1][0]),
                             d(M[1][0], M[1][1], M[2][0], M[2][1]), d(M[0][1], M[0][0], M[2][1], M[2][0]), d(M[0][0], M[0][1], M[1][0], M[1][1])).mult(1 / this.det());
    }
    
}
*/
