// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_dialog::init as dialog_init; 

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(dialog_init())
        .invoke_handler(tauri::generate_handler![
            greet,
            test_database_connection])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn test_database_connection(path: String) -> Result<serde_json::Value, String> {
    match rusqlite::Connection::open(&path) {
        Ok(_) => Ok(serde_json::json!({ "canOpen": true })),
        Err(_) => Ok(serde_json::json!({ "canOpen": false }))
    }
}

// #[tauri::command]
// pub async fn visualize_data() {

// }


// fn decrypt_db(db_path: Path) {
  
// }