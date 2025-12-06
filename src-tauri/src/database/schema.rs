// SQLITE SCHEMA FILE

#[tauri::command]
fn get_table_list(path: String) -> Result<Vec<String>> {

}


pub struct TableInfo;
#[tauri::command]
fn get_table_info(path: String, table: String) -> Result<TableInfo, String> {

}