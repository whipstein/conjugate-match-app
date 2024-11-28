function digits(val, sd) {
    return val.toFixed(sd)
}

function print_val(val, unit, sd) {
    if (Number.isFinite(val)) {
        return "" + digits(scale(val, unit), sd)
    }
    return "" + val
}

function scale(val, unit) {
    if (unit == "milli") {
        return val * 1e3
    } else if (unit == "micro") {
        return val * 1e6
    } else if (unit == "nano") {
        return val * 1e9
    } else if (unit == "pico") {
        return val * 1e12
    } else if (unit == "femto") {
        return val * 1e15
    } else if (unit == "kilo") {
        return val * 1e-3
    } else if (unit == "mega") {
        return val * 1e-6
    } else if (unit == "giga") {
        return val * 1e-9
    } else if (unit == "tera") {
        return val * 1e-12
    } else {
        return val
    }
}

function unscale(val, unit) {
    if (unit == "milli") {
        return val * 1e-3
    } else if (unit == "micro") {
        return val * 1e-6
    } else if (unit == "nano") {
        return val * 1e-9
    } else if (unit == "pico") {
        return val * 1e-12
    } else if (unit == "femto") {
        return val * 1e-15
    } else if (unit == "kilo") {
        return val * 1e3
    } else if (unit == "mega") {
        return val * 1e6
    } else if (unit == "giga") {
        return val * 1e9
    } else if (unit == "tera") {
        return val * 1e12
    } else {
        return val
    }
}

function deg(val) {
    return val * 180.0 / Math.PI
}

function rad(val) {
    return val * Math.PI / 180.0
}

class Complex {
    constructor(val1 = 0, val2 = 0, unit = "ri") {
        this._re = 0
        this._im = 0
        if (unit == "ma") {
            this.re = val1 * Math.cos(rad(val2))
            this.im = val1 * Math.sin(rad(val2))
        } else if (unit == "db") {
            this.re = 10.0**(val1 / 10.0) * Math.cos(rad(val2))
            this.im = 10.0**(val1 / 10.0) * Math.sin(rad(val2))
        } else {
            this.re = Number(val1)
            this.im = Number(val2)
        }

        return this
    }
    get re() {
        return this._re
    }
    set re(val) {
        this._re = val
    }
    get im() {
        return this._im
    }
    set im(val) {
        this._im = val
    }
    get mag() {
        return Math.sqrt(this.re**2 + this.im**2)
    }
    get ang() {
        return deg(Math.atan2(this.im, this.re))
    }
    get arg() {
        return Math.atan2(this.im, this.re)
    }
    add(val) {
        return new Complex(this.re + val.re, this.im + val.im)
    }
    conj() {
        return new Complex(this.re, -this.im)
    }
    divide(val) {
        var d = val.re**2 + val.im**2
        return new Complex((this.re * val.re + this.im * val.im) / d, (this.im * val.re - this.re * val.im) / d)
    }
    inv() {
        var d = this.re**2 + this.im**2
        return new Complex(this.re / d, -this.im / d)
    }
    multiply(val) {
        return new Complex(this.re * val.re - this.im * val.im, this.re * val.im + this.im * val.re)
    }
    scale(val) {
        return new Complex(this.re * val, this.im * val)
    }
    subtract(val) {
        return new Complex(this.re - val.re, this.im - val.im)
    }
}


function calcStability(s11, s12, s21, s22, ds) {
    const k = (1 + ds.mag**2 - s11.mag**2 - s22.mag**2) / (2 * s12.mag * s21.mag)

    const b1 = 1 + s11.mag**2 - s22.mag**2 - ds.mag**2

    return [k, b1]
}

function calcMAG(s11, s12, s21, s22, ds, k, b1) {
    const mag = 10 * Math.log10(s21.mag / s12.mag) + 10 * Math.log10(Math.abs(k - Math.sign(b1) * Math.sqrt(k**2 - 1)))

    const c2 = s22.subtract(ds.multiply(s11.conj()))
    const b2 = 1 + s22.mag**2 - s11.mag**2 - ds.mag**2

    return [mag, c2, b2]
}

function calcGammaL(b2, c2) {
    const gammaL_mag = (b2 - Math.sign(b2) * Math.sqrt(b2**2 - 4 * c2.mag**2)) / (2 * c2.mag)
    const gammaL_ang = -1 * c2.arg

    const gammaL = new Complex(gammaL_mag * Math.cos(gammaL_ang), gammaL_mag * Math.sin(gammaL_ang))

    return gammaL
}

function calcGammaS(s11, s12, s21, s22, gammaL) {
    const one = new Complex(1, 0)
    const gammaS = s11.add(s12.multiply(s21).multiply(gammaL).divide(one.subtract(gammaL.multiply(s22)))).conj()

    return gammaS
}

function calcZ(gamma, zo, omega) {
    const one = new Complex(1, 0)
    const z = one.add(gamma).divide(one.subtract(gamma)).scale(zo)
    const y = z.inv()
    const rp = 1 / y.re
    const cp = scale(y.im / omega, "femto")

    console.log(y)

    return [z, rp, cp]
}

function calcMatch() {
    const num_format = document.getElementById("num_format").value
    const sig_digits = parseInt(document.getElementById("sig_digits").value, 10)
    const zo = document.getElementById("zo").value
    const freq = unscale(document.getElementById("freq").value, "giga")
    const omega = 2 * Math.PI * freq

    const s11 = new Complex(document.getElementById("s11_re").value, document.getElementById("s11_im").value, num_format)
    const s12 = new Complex(document.getElementById("s12_re").value, document.getElementById("s12_im").value, num_format)
    const s21 = new Complex(document.getElementById("s21_re").value, document.getElementById("s21_im").value, num_format)
    const s22 = new Complex(document.getElementById("s22_re").value, document.getElementById("s22_im").value, num_format)

    const ds = s11.multiply(s22).subtract(s21.multiply(s12))

    var k
    var b1
    [k, b1] = calcStability(s11, s12, s21, s22, ds)
    document.getElementById("kval").value = print_val(k, "", sig_digits)
    document.getElementById("b1val").value = print_val(b1, "", sig_digits)

    var mag
    var c2
    var b2
    [mag, c2, b2] = calcMAG(s11, s12, s21, s22, ds, k, b1)
    document.getElementById("magval").value = print_val(mag, "", sig_digits)

    var gl
    gl = calcGammaL(b2, c2)
    document.getElementById("load_gamma_mag_val").value = print_val(gl.mag, "", 4)
    document.getElementById("load_gamma_ang_val").value = print_val(gl.ang, "", 1)

    var zl
    var rl
    var cl
    [zl, rl, cl] = calcZ(gl, zo, omega)
    document.getElementById("load_z_re_val").value = print_val(zl.re, "", sig_digits)
    document.getElementById("load_z_im_val").value = print_val(zl.im, "", sig_digits)
    document.getElementById("load_r_val").value = print_val(rl, "", sig_digits)
    document.getElementById("load_c_val").value = print_val(cl, "", sig_digits)

    var gs
    gs = calcGammaS(s11, s12, s21, s22, gl)
    document.getElementById("src_gamma_mag_val").value = print_val(gs.mag, "", 4)
    document.getElementById("src_gamma_ang_val").value = print_val(gs.ang, "", 1)

    var zs
    var rs
    var cs
    [zs, rs, cs] = calcZ(gs, zo, omega)
    document.getElementById("src_z_re_val").value = print_val(zs.re, "", sig_digits)
    document.getElementById("src_z_im_val").value = print_val(zs.im, "", sig_digits)
    document.getElementById("src_r_val").value = print_val(rs, "", sig_digits)
    document.getElementById("src_c_val").value = print_val(cs, "", sig_digits)
}

function change_imp() {
    const num_format = document.getElementById("num_format").value

    if (num_format == "ma") {
        document.getElementById("s11_re_label").textContent = "S11 Magnitude";
        document.getElementById("s11_im_label").textContent = "S11 Angle (deg)";
        document.getElementById("s12_re_label").textContent = "S12 Magnitude";
        document.getElementById("s12_im_label").textContent = "S12 Angle (deg)";
        document.getElementById("s21_re_label").textContent = "S21 Magnitude";
        document.getElementById("s21_im_label").textContent = "S21 Angle (deg)";
        document.getElementById("s22_re_label").textContent = "S22 Magnitude";
        document.getElementById("s22_im_label").textContent = "S22 Angle (deg)";
    } else if (num_format == "db") {
        document.getElementById("s11_re_label").textContent = "S11 Magnitude (dB)";
        document.getElementById("s11_im_label").textContent = "S11 Angle (deg)";
        document.getElementById("s12_re_label").textContent = "S12 Magnitude (dB)";
        document.getElementById("s12_im_label").textContent = "S12 Angle (deg)";
        document.getElementById("s21_re_label").textContent = "S21 Magnitude (dB)";
        document.getElementById("s21_im_label").textContent = "S21 Angle (deg)";
        document.getElementById("s22_re_label").textContent = "S22 Magnitude (dB)";
        document.getElementById("s22_im_label").textContent = "S22 Angle (deg)";
    } else {
        document.getElementById("s11_re_label").textContent = "S11 Real";
        document.getElementById("s11_im_label").textContent = "S11 Imaginary";
        document.getElementById("s12_re_label").textContent = "S12 Real";
        document.getElementById("s12_im_label").textContent = "S12 Imaginary";
        document.getElementById("s21_re_label").textContent = "S21 Real";
        document.getElementById("s21_im_label").textContent = "S21 Imaginary";
        document.getElementById("s22_re_label").textContent = "S22 Real";
        document.getElementById("s22_im_label").textContent = "S22 Imaginary";
        }

    calcMatch()
}

window.calcMatch = calcMatch
window.change_imp = change_imp