// SQLITE SCHEMA FILE

use sqlx::{sqlite::SqlitePool, Row};
use crate::models::database::{TableInfo, ColumnInfo};

pub async fn get_table_list_impl(path: String) -> Result<Vec<String>, String> {
    // Connect using sqlx SQLite URL format
    let pool = SqlitePool::connect(&format!("sqlite:{}", path))
        .await
        .map_err(|e| format!("Failed to connect to database: {}", e))?;

    // Query using sqlx for table names
    let rows = sqlx::query(
        "SELECT name FROM sqlite_master
         WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| format!("Failed to query tables: {}", e))?;

    // Extract table names from rows
    let table_names: Vec<String> = rows
        .into_iter()
        .filter_map(|row| row.get(0))
        .collect();

    Ok(table_names)
}

pub async fn get_table_info_impl(path: String, table: String) -> Result<TableInfo, String> {
    let pool = SqlitePool::connect(&format!("sqlite:{}", path))
        .await
        .map_err(|e| format!("Failed to connect to database: {}", e))?;

    // Get column information using PRAGMA table_info
    let column_rows = sqlx::query("PRAGMA table_info(?)")
        .bind(&table)
        .fetch_all(&pool)
        .await
        .map_err(|e| format!("Failed to get table info for {}: {}", table, e))?;

    // Map rows to ColumnInfo structs
    let columns: Vec<ColumnInfo> = column_rows
        .into_iter()
        .map(|row| ColumnInfo {
            name: row.get(1),        // name column
            data_type: row.get(2),   // type column
            nullable: row.get::<i32, _>(3) == 0, // notnull (1 = not null, 0 = nullable)
            primary_key: row.get::<i32, _>(5) == 1, // pk (1 = primary key)
            default_value: row.get(4), // dflt_value
        })
        .collect();

    // Get row count (optional)
    let row_count = get_row_count(&pool, &table).await;

    Ok(TableInfo {
        name: table,
        columns,
        row_count,
    })
}

// Helper function to get row count
async fn get_row_count(pool: &SqlitePool, table: &str) -> Option<u64> {
    let result = sqlx::query(&format!("SELECT COUNT(*) as count FROM \"{}\"", table))
        .fetch_one(pool)
        .await;

    match result {
        Ok(row) => {
            let count: i64 = row.get(0);
            Some(count as u64)
        },
        Err(_) => None, // Table might be empty or have issues with row count
    }
}
