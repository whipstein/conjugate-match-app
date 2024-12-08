const { invoke } = window.__TAURI__.core;

function digits(val, sd) {
    return val.toFixed(sd);
}
  
function print_unit(unit) {
    if (unit == "milli") {
        return "m";
    } else if (unit == "micro") {
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
    return "" + val;
}

let sigDigitsEl, modeUnitEl, capUnitEl, freqUnitEl, impUnitEl, z0El, freqEl, s11reLabelEl, s11imLabelEl, s12reLabelEl, s12imLabelEl, s21reLabelEl, s21imLabelEl, s22reLabelEl, s22imLabelEl, s11reEl, s11imEl, s12reEl, s12imEl, s21reEl, s21imEl, s22reEl, s22imEl, calcEl;
let sd, cap_unit, freq_unit, imp_unit, z0, freq, s11re, s11im, s12re, s12im, s21re, s21im, s22re, s22im;
let kEl, b1El, magEl, srcGammaEl, srcZEl, srcREl, srcCEl, loadGammaEl, loadZEl, loadREl, loadCEl;

function calcMatch() {
    invoke("calc_match", { s11re: s11re, s11im: s11im, s12re: s12re, s12im: s12im, s21re: s21re, s21im: s21im, s22re: s22re, s22im: s22im, imp: imp_unit, z0: z0, freq: freq, fscale: freq_unit, cscale: cap_unit })
        .then((result) => {
            kEl.innerHTML = "<div class=\"text_box\">" + print_val(result.k, "", " </div>", sd);
            b1El.innerHTML = "<div class=\"text_box\">" + print_val(result.b1, "", " </div>", sd);
            magEl.innerHTML = "<div class=\"text_box\">" + print_val(result.mag, "", " </div>", sd);

            srcGammaEl.innerHTML = "<div class=\"text_box\">" + print_val(result.src.gamma_mag, "", " &angmsd; ", sd) + print_val(result.src.gamma_ang, "", "&deg; </div>", sd)
            var txt = "<div class=\"text_box\">" + print_val(result.src.z_re, "", "", sd)
            if (result.src.z_im < 0) txt += " - "
            else txt += " + "
            txt += print_val(Math.abs(result.src.z_im), "", "j Ω</div>", sd)
            srcZEl.innerHTML = txt
            srcREl.innerHTML = "<div class=\"text_box\">" + print_val(result.src.r, "", " Ω</div>", sd)
            srcCEl.innerHTML = "<div class=\"text_box\">" + print_val(result.src.c, cap_unit, "F</div>", sd)

            loadGammaEl.innerHTML = "<div class=\"text_box\">" + print_val(result.load.gamma_mag, "", " &angmsd; ", sig_digits) + print_val(result.src.gamma_ang, "", "&deg; </div>", sd)
            var txt = "<div class=\"text_box\">" + print_val(result.load.z_re, "", "", sd)
            if (result.load.z_im < 0) txt += " - "
            else txt += " + "
            txt += print_val(Math.abs(result.load.z_im), "", "j Ω</div>", sd)
            loadZEl.innerHTML = txt
            loadREl.innerHTML = "<div class=\"text_box\">" + print_val(result.load.r, "", " Ω</div>", sd)
            loadCEl.innerHTML = "<div class=\"text_box\">" + print_val(result.load.c, cap_unit, "F</div>", sd)
        })
        .catch((err) => {
            console.log("ERROR: " + err);
            var txt = "<div class=\"text_box\">ERROR";    
            kEl.innerHTML = txt;
            b1El.innerHTML = txt;
            magEl.innerHTML = txt;
            srcGammaEl.innerHTML = txt;
            srcZEl.innerHTML = txt;
            srcREl.innerHTML = txt;
            srcCEl.innerHTML = txt;
            loadGammaEl.innerHTML = txt;
            loadZEl.innerHTML = txt;
            loadREl.innerHTML = txt;
            loadCEl.innerHTML = txt;
        });
}

function updateVals() {
    sd = parseInt(sigDigitsEl.value);
    cap_unit = capUnitEl.value;
    freq_unit = freqUnitEl.value;
    imp_unit = impUnitEl.value;
    z0 = parseFloat(z0El.value);
    freq = parseFloat(freqEl.value);
    s11re = parseFloat(s11reEl.value);
    s11im = parseFloat(s11imEl.value);
    s12re = parseFloat(s12reEl.value);
    s12im = parseFloat(s12imEl.value);
    s21re = parseFloat(s21reEl.value);
    s21im = parseFloat(s21imEl.value);
    s22re = parseFloat(s22reEl.value);
    s22im = parseFloat(s22imEl.value);

    calcMatch();
}

function updateLabels() {
    let reLabel, imLabel;

    if (imp_unit == "ma" || imp_unit == "db") {
        reLabel = "&ang;";
        imLabel = "&deg;";
    } else {
        reLabel = "+";
        imLabel = "j";
    }

    s11reLabelEl.innerHTML = reLabel;
    s12reLabelEl.innerHTML = reLabel;
    s21reLabelEl.innerHTML = reLabel;
    s22reLabelEl.innerHTML = reLabel;

    s11imLabelEl.innerHTML = imLabel;
    s12imLabelEl.innerHTML = imLabel;
    s21imLabelEl.innerHTML = imLabel;
    s22imLabelEl.innerHTML = imLabel;

    updateVals();
}

window.addEventListener("DOMContentLoaded", () => {
    sigDigitsEl = document.getElementById("sig_digits");
    capUnitEl = document.getElementById("cap_unit");
    freqUnitEl = document.getElementById("freq_unit");
    impUnitEl = document.getElementById("imp_unit");
    z0El = document.getElementById("z0");
    freqEl = document.getElementById("freq");
    s11reLabelEl = document.getElementById("s11_re_label");
    s11imLabelEl = document.getElementById("s11_im_label");
    s12reLabelEl = document.getElementById("s12_re_label");
    s12imLabelEl = document.getElementById("s12_im_label");
    s21reLabelEl = document.getElementById("s21_re_label");
    s21imLabelEl = document.getElementById("s21_im_label");
    s22reLabelEl = document.getElementById("s22_re_label");
    s22imLabelEl = document.getElementById("s22_im_label");
    s11reEl = document.getElementById("s11_re");
    s11imEl = document.getElementById("s11_im");
    s12reEl = document.getElementById("s12_re");
    s12imEl = document.getElementById("s12_im");
    s21reEl = document.getElementById("s21_re");
    s21imEl = document.getElementById("s21_im");
    s22reEl = document.getElementById("s22_re");
    s22imEl = document.getElementById("s22_im");
    calcEl = document.getElementById("calc");

    kEl = document.getElementById("k_val");
    b1El = document.getElementById("b1_val");
    magEl = document.getElementById("mag_val");
    srcGammaEl = document.getElementById("src_gamma_val");
    srcZEl = document.getElementById("src_z_val");
    srcREl = document.getElementById("src_r_val");
    srcCEl = document.getElementById("src_c_val");
    loadGammaEl = document.getElementById("load_gamma_val");
    loadZEl = document.getElementById("load_z_val");
    loadREl = document.getElementById("load_r_val");
    loadCEl = document.getElementById("load_c_val");

    updateVals();

    sigDigitsEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    capUnitEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    freqUnitEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    impUnitEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateLabels();
    });

    z0El.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    freqEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    s11reEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    s11imEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    s12reEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    s12imEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    s21reEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    s21imEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    s22reEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    s22imEl.addEventListener("change", (e) => {
        e.preventDefault();
        updateVals();
    });

    calcEl.addEventListener("click", (e) => {
        e.preventDefault();
        updateVals();
    });
});
