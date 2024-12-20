use crate::rf_utils::Unit;
use num_complex::Complex;
use std::str::FromStr;
use tauri::AppHandle;
use tauri_plugin_clipboard_manager::ClipboardExt;

#[tauri::command(rename_all = "snake_case")]
pub fn copy_rc(app: AppHandle, r: &str, c: &str, unit: &str) {
    let cunit = Unit::from_str(unit).unwrap();
    let val = format!("{}, {}{}", r, c, cunit.to_string());
    app.clipboard().write_text(val.to_string()).unwrap();
}

#[tauri::command(rename_all = "snake_case")]
pub fn copy_val_unit(app: AppHandle, x: &str, unit: &str) {
    let val = format!("{}{}", x, unit.to_string());
    app.clipboard().write_text(val.to_string()).unwrap();
}

#[tauri::command(rename_all = "snake_case")]
pub fn copy_scalar(app: AppHandle, x: &str) {
    let val = format!("{}", x);
    app.clipboard().write_text(val.to_string()).unwrap();
}

#[tauri::command(rename_all = "snake_case")]
pub fn copy_complex(app: AppHandle, re: &str, im: &str) {
    let val = format!("{}, {}", re, im);
    app.clipboard().write_text(val.to_string()).unwrap();
}

#[tauri::command(rename_all = "snake_case")]
pub fn copy_complex_ri(app: AppHandle, re: &str, im: &str) {
    let mut val = "".to_string();
    let im_val: String = im.to_string();

    if &im[0..0] == "-" {
        val = format!("{} - {}", re, &im[1..]);
    } else {
        val = format!("{} + {}", re, &im);
    }
    app.clipboard().write_text(val.to_string()).unwrap();
}
