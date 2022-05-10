/**
 * Complex number
 */
class Complex {
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }

    static of_real(re) {
        return new Complex(re, 0);
    }

    static of_imag(im) {
        return new Complex(0, im);
    }

    static get zero() {
        return zero;
    }

    static get one() {
        return one;
    }

    static get minus_one() {
        return minus_one;
    }

    static get i() {
        return i;
    }
    
    static get minus_i() {
        return minus_i;
    }

    clone() {
        return new Complex(this.re, this.im);
    }

    add(other) {
        return new Complex(this.re + other.re, this.im + other.im);
    }

    mult(other) {
        if (typeof other == "number")
            return this.scale(number);
        return new Complex(this.re * other.re - this.im * other.im,
                           this.re * other.im + this.im * other.re);
    }

    scale(k) {
        return new Complex(k * this.re, k * this.im);
    }

    uminus() {
        return this.scale(-1);
    }

    sub(other) {
        return this.add(other.uminus());
    }

    norm2() {
        return this.re * this.re + this.im * this.im;
    }

    norm() {
        return Math.sqrt(this.norm2());
    }

    arg() {
        return Math.atan2(this.im, this.re);
    }

    sgn() {
        return this.scale(1 / this.norm());
    }

    cnj() {
        return new Complex(this.re, -this.im);
    }
    
    recip() {
        return this.cnj().scale(1 / this.norm2())
    }

    div(other) {
        return this.mult(other.recip());
    }

    // precision for checking zero
    static EPS = 1e-8;
    
    is_zero(eps) {
        if (!eps)
            eps = Complex.EPS;
        return this.norm2() < eps * eps;
    }

    is_real() {
        return Math.abs(this.im) < Complex.EPS;
    }

    is_imag() {
        return Math.abs(this.re) < Complex.EPS;
    }
    
    eq(other) {
        return this.sub(other).is_zero();
    }

    static cnj_mix(z1, z2) {
        return z1.cnj().mult(z2).add(z2.cnj().mult(z1));
    }

    static scalprod(z1, z2) {
        return Complex.cnj_mix(other).scale(1 / 2);
    }

}

const zero      = new Complex( 0,  0);
const one       = new Complex( 1,  0);
const minus_one = new Complex(-1,  0);
const i         = new Complex( 0,  1);
const minus_i   = new Complex( 0, -1);

export { Complex };
