// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_dialog::init as dialog_init;

// Module declarations
pub mod database;
pub mod models;
pub mod error;

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
            test_database_connection,
            get_table_list,
            get_table_info,
            execute_query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn test_database_connection(path: String) -> Result<serde_json::Value, String> {
    // Try to connect using sqlx - this will test if the database is accessible
    match sqlx::sqlite::SqlitePool::connect(&format!("sqlite:{}", path)).await {
        Ok(_) => Ok(serde_json::json!({ "canOpen": true })),
        Err(_) => Ok(serde_json::json!({ "canOpen": false }))
    }
}

#[tauri::command]
async fn get_table_list(path: String) -> Result<Vec<String>, String> {
    use crate::database::schema::get_table_list_impl;
    get_table_list_impl(path).await
}

#[tauri::command]
async fn get_table_info(path: String, table: String) -> Result<crate::models::database::TableInfo, String> {
    use crate::database::schema::get_table_info_impl;
    get_table_info_impl(path, table).await
}

#[tauri::command]
async fn execute_query(path: String, query: String) -> Result<crate::models::database::QueryResult, String> {
    use crate::database::schema::execute_query_impl;
    execute_query_impl(path, query).await
}

// #[tauri::command]
// pub async fn visualize_data() {

// }


// fn decrypt_db(db_path: Path) {
  
// }
