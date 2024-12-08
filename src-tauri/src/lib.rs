use num_complex::Complex;
use std::f64::consts::PI;

fn get_mult(scale: &str) -> f64 {
    match scale {
        "tera" | "T" | "THz" | "thz" => 1e-12,
        "giga" | "G" | "GHz" | "ghz" | "GΩ" => 1e-9,
        "mega" | "M" | "MHz" | "mhz" | "MΩ" => 1e-6,
        "kilo" | "k" | "kHz" | "khz" | "kΩ" => 1e-3,
        "milli" | "m" | "mΩ" | "mF" | "mH" => 1e3,
        "micro" | "u" | "μΩ" | "μF" | "μH" => 1e6,
        "nano" | "n" | "nΩ" | "nF" | "nH" => 1e9,
        "pico" | "p" | "pΩ" | "pF" | "pH" => 1e12,
        "femto" | "f" | "fΩ" | "fF" | "fH" => 1e15,
        _ => 1.0,
    }
}

fn scale(val: f64, scale: &str) -> f64 {
    val * get_mult(scale)
}

fn unscale(val: f64, scale: &str) -> f64 {
    val / get_mult(scale)
}

fn calc_gamma(z: Complex<f64>, z0: f64) -> Complex<f64> {
    let z0: f64 = z0;

    (z - z0) / (z + z0)
}

fn calc_z(gamma: Complex<f64>, z0: f64) -> Complex<f64> {
    z0 * (1.0 + gamma) / (1.0 - gamma)
}

fn calc_rc(z: Complex<f64>, freq: f64, fscale: &str, rscale: &str, cscale: &str) -> (f64, f64) {
    let y = 1.0 / z;

    (
        1.0 / scale(y.re, rscale),
        scale(
            y.im / (2.0 * std::f64::consts::PI * unscale(freq, fscale)),
            cscale,
        ),
    )
}

#[derive(serde::Serialize, Default, Debug, PartialEq)]
struct ImpedanceReturn {
    gamma_mag: f64,
    gamma_ang: f64,
    gamma_re: f64,
    gamma_im: f64,
    z_re: f64,
    z_im: f64,
    r: f64,
    c: f64,
}

#[derive(serde::Serialize, Default, Debug, PartialEq)]
struct ResultsReturn {
    k: f64,
    b1: f64,
    b2: f64,
    mag: f64,
    src: ImpedanceReturn,
    load: ImpedanceReturn,
}

fn gen_complex(re: f64, im: f64, imp: &str) -> Result<Complex<f64>, String> {
    match imp {
        "ri" => Ok(Complex::new(re, im)),
        "ma" => Ok(Complex::from_polar(re, im * PI / 180.0)),
        "db" => Ok(Complex::from_polar(10_f64.powf(re / 20.0), im * PI / 180.0)),
        _ => Err("impedance unit(s) not recognized".to_string()),
    }
}

#[tauri::command]
fn calc_match(
    s11re: f64,
    s11im: f64,
    s12re: f64,
    s12im: f64,
    s21re: f64,
    s21im: f64,
    s22re: f64,
    s22im: f64,
    imp: &str,
    z0: f64,
    freq: f64,
    fscale: &str,
    cscale: &str,
) -> Result<ResultsReturn, String> {
    let s11 = gen_complex(s11re, s11im, imp)?;
    let s12 = gen_complex(s12re, s12im, imp)?;
    let s21 = gen_complex(s21re, s21im, imp)?;
    let s22 = gen_complex(s22re, s22im, imp)?;

    let ds = s11 * s22 - s12 * s21;

    let k: f64 = (1.0 + ds.norm().powi(2) - s11.norm().powi(2) - s22.norm().powi(2))
        / (2.0 * s12.norm() * s21.norm());

    let b1: f64 = 1.0 + s11.norm().powi(2) - s22.norm().powi(2) - ds.norm().powi(2);

    let mag: f64 = 10.0 * (s21.norm() / s12.norm()).log10()
        + 10.0 * (k - b1.signum() * (k.powi(2) - 1.0).sqrt()).abs().log10();

    let b2: f64 = 1.0 + s22.norm().powi(2) - s11.norm().powi(2) - ds.norm().powi(2);

    let c2 = s22 - ds * s11.conj();

    let gamma_load_mag =
        (b2 - b2.signum() * (b2.powi(2) - 4.0 * c2.norm().powi(2)).sqrt()) / (2.0 * c2.norm());
    let gamma_load_ang = -1.0 * c2.arg();

    let gamma_load = Complex::from_polar(gamma_load_mag, gamma_load_ang);
    let z_load = calc_z(gamma_load, z0);
    let (rl, cl) = calc_rc(gamma_load, freq, fscale, "", cscale);

    let gamma_src = (s11 + (s12 * s21 * gamma_load / (1.0 - gamma_load * s22))).conj();
    let z_src = calc_z(gamma_src, z0);
    let (rs, cs) = calc_rc(gamma_src, freq, fscale, "", cscale);

    Ok(ResultsReturn {
        k: k,
        b1: b1,
        b2: b2,
        mag: mag,
        src: ImpedanceReturn {
            gamma_mag: gamma_src.norm(),
            gamma_ang: gamma_src.arg() * 180.0 / PI,
            gamma_re: gamma_src.re,
            gamma_im: gamma_src.im,
            z_re: z_src.re,
            z_im: z_src.im,
            r: rs,
            c: cs,
        },
        load: ImpedanceReturn {
            gamma_mag: gamma_load.norm(),
            gamma_ang: gamma_load.arg() * 180.0 / PI,
            gamma_re: gamma_load.re,
            gamma_im: gamma_load.im,
            z_re: z_load.re,
            z_im: z_load.im,
            r: rl,
            c: cl,
        },
    })
}

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![calc_match])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
