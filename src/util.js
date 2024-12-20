const { invoke } = window.__TAURI__.core;

function digits(val, sd = 2) {
    return val.toFixed(sd);
}

function precision(val, sd = 2) {
    return val.toPrecision(2);
}

function print_unit(unit, parse = false) {
    if (unit == "milli") {
        return "m";
    } else if (unit == "micro") {
        if (parse) {
            return "u";
        }
        return "μ";
    } else if (unit == "nano") {
        return "n";
    } else if (unit == "pico") {
        return "p";
    } else if (unit == "femto") {
        return "f";
    } else {
        return "";
    }
}

function print_val(val, unit, suffix, sd) {
    if (Number.isFinite(val)) {
        return "" + digits(val, sd) + " " + print_unit(unit) + suffix;
    }
    return "" + Number.NaN;
}

function print_cval(val, unit, suffix, sd, form = "ri") {
    if (Number.isFinite(val.re)) {
        if (form == "ri") {
            if (val.im < 0) {
                return "" + digits(val.re, sd) + " - " + Math.abs(digits(val.im, sd)) + print_unit(unit) + suffix;
            }
            return "" + digits(val.re, sd) + " + " + digits(val.im, sd) + print_unit(unit) + suffix;
        } else if (form == "ma") {
            return "" + digits(val.mag, sd) + " &angmsd; " + digits(val.ang, sd) + print_unit(unit) + suffix;
        }
        return "" + Number.NaN;
    }
    return "" + Number.NaN;
}

function scalarCopy(el, val) {
    if (Number.isFinite(val)) {
        invoke("copy_scalar", {x: digits(val, sd)});

        el.innerText = "Copied";
    
        setTimeout(()=> {
            el.innerText = "Copy";
        },700);
    }
}

function complexCopy(el, val1, val2, sd = 2) {
    if (Number.isFinite(val1) && Number.isFinite(val2)) {
        invoke("copy_complex", { re: digits(val1, sd), im: digits(val2, sd) });

        el.innerText = "Copied";
    
        setTimeout(()=> {
            el.innerText = "Copy";
        },700);
    }
}

function rcCopy(el, val1, val2, unit, sd = 2) {
    if (Number.isFinite(val1) && Number.isFinite(val2)) {
        invoke("copy_rc", {r: digits(val1, sd), c: digits(val2, sd), unit: unit});

        el.innerText = "Copied";
    
        setTimeout(()=> {
            el.innerText = "Copy";
        },700);
    }
}

export {digits, precision, print_unit, print_val, print_cval, scalarCopy, complexCopy, rcCopy};
