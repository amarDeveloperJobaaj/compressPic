"use client";

/** Parse CSV text into rows of strings (handles quotes, commas, newlines). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

/** Serialize rows to CSV text. */
export function stringifyCsv(rows: (string | number | null)[][]): string {
  const escape = (value: string | number | null): string => {
    const s = value === null || value === undefined ? "" : String(value);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map((row) => row.map(escape).join(",")).join("\n");
}

/** Infer a SQLite column type from sample values. */
export function inferSqlType(values: string[]): string {
  let hasNumber = false;
  let hasFloat = false;
  let hasInt = false;
  for (const v of values) {
    const trimmed = v.trim();
    if (trimmed === "") continue;
    if (/^[+-]?\d+$/.test(trimmed)) hasInt = true;
    else if (/^[+-]?\d*\.\d+([eE][+-]?\d+)?$/.test(trimmed)) hasFloat = true;
    else hasNumber = false;
    if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(trimmed)) hasNumber = true;
  }
  if (hasNumber) return "TEXT";
  if (hasFloat) return "REAL";
  if (hasInt) return "INTEGER";
  return "TEXT";
}

/** Convert parsed CSV rows into a CREATE TABLE + INSERT statement. */
export function csvToSql(tableName: string, rows: string[][]): string {
  const header = rows[0]?.map((h, i) => h.trim() || `column_${i + 1}`) ?? [];
  const data = rows.slice(1).filter((r) => r.some((c) => c.trim() !== ""));
  const columns = header.map((name) => `"${sanitizeIdentifier(name)}"`).join(", ");

  // Infer types per column from the data.
  const types = header.map((_, colIndex) => {
    const values = data.map((r) => r[colIndex] ?? "");
    return inferSqlType(values);
  });

  const create = `CREATE TABLE IF NOT EXISTS "${sanitizeIdentifier(tableName)}" (\n  ${header
    .map((name, i) => `"${sanitizeIdentifier(name)}" ${types[i]}`)
    .join(",\n  ")}\n);`;

  if (data.length === 0) return create;

  const values = data
    .map((row) => {
      const vals = header.map((_, i) => {
        const raw = row[i]?.trim() ?? "";
        if (raw === "") return "NULL";
        if (types[i] !== "TEXT") return raw;
        return `'${raw.replace(/'/g, "''")}'`;
      });
      return `(${vals.join(", ")})`;
    })
    .join(",\n");
  return `${create}\n\nINSERT INTO "${sanitizeIdentifier(tableName)}" (${columns}) VALUES\n${values};`;
}

/** Make a string safe to use as a SQLite identifier. */
function sanitizeIdentifier(name: string): string {
  const cleaned = name.replace(/"/g, "").trim();
  return cleaned || "table";
}
