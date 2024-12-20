use crate::conjugate::calc_match;
use crate::copy::{copy_complex, copy_complex_ri, copy_rc, copy_scalar, copy_val_unit};
use tauri::Manager;
use tauri_plugin_clipboard_manager::ClipboardExt;

mod conjugate;
mod copy;
mod rf_utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            calc_match,
            copy_complex,
            copy_complex_ri,
            copy_rc,
            copy_scalar,
            copy_val_unit
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
