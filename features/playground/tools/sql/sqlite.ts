"use client";

/**
 * sql.js (SQLite WASM) service layer.
 *
 * The engine is loaded lazily on first use and cached, so the SQL playground
 * starts instantly and only downloads the WASM when a database is actually
 * needed. Everything runs locally in the browser — no backend.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlJsModule = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Database = any;

let SQL: SqlJsModule | null = null;
let db: Database | null = null;

/** Lazily load sql.js (cached). */
async function getSqlJs(): Promise<SqlJsModule> {
  if (SQL) return SQL;
  try {
    const sqlJsModule = await import("sql.js");
    SQL = await sqlJsModule.default({
      locateFile: (file: string) => `/wasm/${file}`,
    });
    return SQL;
  } catch (err) {
    // Surface a human-readable error instead of Emscripten's cryptic
    // "Aborted(...)" rejection when the WASM fails to load. `SQL` stays
    // null, so a later retry re-attempts the load.
    console.error("sql.js failed to load:", err);
    throw new Error(
      "Couldn't load the SQLite engine (sql.js WASM). Please check your connection and try again."
    );
  }
}

/** Get (or create) the in-memory database. */
export async function getDatabase(): Promise<Database> {
  if (db) return db;
  const sql = await getSqlJs();
  db = new sql.Database();
  return db;
}

export interface QueryResult {
  columns: string[];
  values: (string | number | null | Uint8Array)[][];
  rowsAffected: number;
  statement: string;
  durationMs: number;
}

/** Execute one or more SQL statements, returning each result set. */
export async function executeSql(sqlText: string): Promise<QueryResult[]> {
  const database = await getDatabase();
  const started = performance.now();
  const results: QueryResult[] = [];
  database.exec(sqlText, {
    callback: (result: { columns: string[]; values: unknown[][] } | undefined) => {
      if (!result) return;
      results.push({
        columns: result.columns ?? [],
        values: (result.values ?? []) as QueryResult["values"],
        rowsAffected: 0,
        statement: "",
        durationMs: 0,
      });
    },
  });
  // RowsAffected for the last statement (exec has no direct return for it).
  const totalMs = performance.now() - started;
  for (const r of results) r.durationMs = totalMs;
  try {
    const count = database.getRowsModified();
    if (results.length > 0) results[results.length - 1].rowsAffected = count;
  } catch {
    // ignore
  }
  return results;
}

export interface TableColumn {
  name: string;
  type: string;
  notNull: boolean;
  primaryKey: number; // 0 = not a PK column, 1+ = PK order
  defaultValue: string | null;
}

export interface TableSchema {
  name: string;
  columns: TableColumn[];
  createSql: string;
}

/** Fetch a table/view's schema (columns + CREATE statement). */
export async function getTableSchema(tableName: string): Promise<TableSchema> {
  const database = await getDatabase();
  const info = database.exec(`PRAGMA table_info("${tableName}")`)[0];
  const columns: TableColumn[] = (info?.values ?? []).map((row: unknown[]) => ({
    name: String(row[1] ?? ""),
    type: String(row[2] ?? ""),
    notNull: Number(row[3]) === 1,
    primaryKey: Number(row[5] ?? 0),
    defaultValue: row[4] === null || row[4] === undefined ? null : String(row[4]),
  }));
  let createSql = "";
  try {
    const stmt = database.exec(`SELECT sql FROM sqlite_master WHERE name = '${tableName}'`)[0];
    if (stmt && stmt.values.length > 0) createSql = String(stmt.values[0][0] ?? "");
  } catch {
    // not a user object
  }
  return { name: tableName, columns, createSql };
}

/** List all user tables (excluding sqlite_* internals). */
export async function listTables(): Promise<{ name: string; type: string }[]> {
  const database = await getDatabase();
  const stmt = database.prepare(
    "SELECT name, type FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );
  const tables: { name: string; type: string }[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    tables.push({ name: String(row.name ?? ""), type: String(row.type ?? "table") });
  }
  stmt.free();
  return tables;
}

/** Export the whole database as a Uint8Array (.db file). */
export async function exportDatabase(): Promise<Uint8Array> {
  const database = await getDatabase();
  return database.export();
}

/** Load a .db file into memory (replaces the current database). */
export async function importDatabase(bytes: Uint8Array): Promise<void> {
  const sql = await getSqlJs();
  db?.close();
  db = new sql.Database(bytes);
}

/** Reset to a fresh empty database. */
export async function resetDatabase(): Promise<void> {
  const sql = await getSqlJs();
  db?.close();
  db = new sql.Database();
}

/** Dump the schema + data of every table as SQL statements. */
export async function dumpDatabase(): Promise<string> {
  const database = await getDatabase();
  const tables = await listTables();
  const parts: string[] = [];
  for (const t of tables) {
    try {
      const schema = database.exec(`SELECT sql FROM sqlite_master WHERE name = '${t.name}'`)[0];
      if (schema && schema.values.length > 0) {
        parts.push(String(schema.values[0][0] ?? "") + ";");
      }
    } catch {
      // skip views or objects without SQL
    }
    if (t.type !== "table") continue;
    try {
      const rows = database.exec(`SELECT * FROM "${t.name}"`)[0];
      if (rows && rows.values.length > 0) {
        const cols = rows.columns.map((c: string) => `"${c}"`).join(", ");
        const values = rows.values
          .map((row: unknown[]) => `(${row.map(quoteValue).join(", ")})`)
          .join(",\n");
        parts.push(`INSERT INTO "${t.name}" (${cols}) VALUES\n${values};`);
      }
    } catch {
      // ignore unreadable tables
    }
  }
  return parts.join("\n\n");
}

/** Quote a single value for SQL output. */
function quoteValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  if (value instanceof Uint8Array) return `X'${Array.from(value).map((b) => b.toString(16).padStart(2, "0")).join("")}'`;
  return `'${String(value).replace(/'/g, "''")}'`;
}
