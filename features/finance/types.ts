/** Shared types for the config-driven finance calculator system. */

export interface FieldDef {
  /** Discriminant for the InputField union (FieldDef vs RowSetDef). */
  type?: "field";
  key: string;
  label: string;
  /** Minimum valid value */
  min: number;
  /** Maximum valid value */
  max: number;
  /** Slider/input step */
  step: number;
  /** Default value */
  defaultValue: number;
  /** Currency prefix (e.g. ₹) */
  prefix?: string;
  /** Suffix (e.g. %, yrs, months) */
  suffix?: string;
  /** Tooltip / helper text */
  hint?: string;
}

export interface RowFieldDef {
  key: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

/** Dynamic row input (used by Stock Average Calculator). */
export interface RowSetDef {
  type: "rows";
  key: string;
  label: string;
  /** Fields per row (e.g. quantity + price) */
  fields: RowFieldDef[];
  addLabel: string;
  maxRows: number;
}

export type InputField = FieldDef | RowSetDef;

export type FormatKind = "inr" | "number" | "percent";

export interface ResultCardDef {
  key: string;
  label: string;
  format: FormatKind;
  /** Highlighted primary card (gradient) */
  primary?: boolean;
  suffix?: string;
}

export interface ChartDef {
  /** Chart type */
  type: "line" | "bar" | "donut" | "area";
  title: string;
  format: FormatKind;
  /** Series label(s) */
  labels: string[];
  /** X-axis / slice labels */
  categories: string[];
  /** Data series (multiple series supported for line/bar) */
  datasets: number[][];
  colors?: string[];
}

export interface TableColumnDef {
  key: string;
  label: string;
  format: FormatKind;
}

export interface TableDef {
  title: string;
  columns: TableColumnDef[];
  rows: { values: (string | number)[] }[];
}

export interface ExplanationDef {
  formula: string;
  /** human-readable walkthrough with numbers */
  steps: string[];
}

export interface CalculatorResult {
  /** Headline values keyed by result-card key */
  values: Record<string, number>;
  /** Optional second set of headline values */
  secondary?: Record<string, number>;
  charts: ChartDef[];
  tables: TableDef[];
  explanation: ExplanationDef;
}

export interface CalculatorConfig {
  slug: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  fields: InputField[];
  results: ResultCardDef[];
  /** Pure compute function: inputs → result */
  compute: (values: Record<string, number>) => CalculatorResult;
  /** Human-friendly summary line for copy/share */
  summarize: (values: Record<string, number>, result: CalculatorResult) => string;
  /** Example input values for the "Try an example" button */
  example?: Record<string, number>;
}

export const DEFAULT_DISCLAIMER =
  "Results are estimates for educational purposes only and are not financial, investment, tax, accounting, or legal advice. Always consult a qualified professional before making financial decisions.";
