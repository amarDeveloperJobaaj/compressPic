import type { ToolSeoContent } from "./seo-content";

/**
 * Unique SEO content for the Developer Playground tools. Keyed by the same
 * slug used in lib/tools.ts, so ToolSeoContent resolves them automatically.
 */
export const PLAYGROUND_TOOL_SEO_CONTENT: Record<string, ToolSeoContent> = {
  "html-css-js-playground": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Monaco editor (VS Code engine)",
      "Live preview with console",
      "9 starter templates",
      "Export project as ZIP",
      "100% browser-based",
    ],
    intro: {
      heading: "HTML/CSS/JS Playground — CodePen-Style Editor in Your Browser",
      paragraphs: [
        "The HTML/CSS/JS Playground is a full CodePen-style editor powered by the Monaco engine (the same editor inside VS Code). Write HTML, CSS, and JavaScript in three syntax-highlighted panels and watch the result render live in an instant preview — with a real console that captures your logs, warnings, and errors.",
        "Start from one of nine polished templates — a landing page, portfolio, dashboard, login page, pricing page, and more — or begin from a blank project. Your work autosaves to your browser, can be exported as a ZIP or individual files, and every single byte stays on your device: no uploads, no servers, no accounts.",
      ],
    },
    benefits: [
      { title: "VS Code-Grade Editor", description: "Monaco brings syntax highlighting, auto-completion, bracket matching, code folding, multiple cursors, find & replace, and a minimap to every panel." },
      { title: "Live Preview + Console", description: "Your code renders instantly as you type, and the embedded console captures console.log, warn, error, and runtime errors exactly like DevTools." },
      { title: "Start From 9 Templates", description: "Landing page, portfolio, dashboard, navbar, hero, login, pricing, card layout, or blank — build on a solid starting point instead of an empty file." },
      { title: "100% Private", description: "Everything runs and is stored in your browser. Your code is never uploaded, so even confidential snippets stay yours." },
    ],
    features: [
      { title: "Three-Panel Monaco Editors", description: "Separate HTML, CSS, and JavaScript panels with per-panel language intelligence." },
      { title: "Live Auto-Run", description: "Debounced rendering updates the preview the moment you pause typing — with a manual Run button whenever you want it." },
      { title: "Built-In Console", description: "Captures console.log / warn / error plus uncaught exceptions, with error highlighting." },
      { title: "Responsive Preview", description: "Switch between desktop, tablet, and mobile viewport widths — or open a fullscreen preview." },
      { title: "Templates Library", description: "Nine production-style starting points covering the most common front-end layouts." },
      { title: "Import & Export", description: "Import individual HTML/CSS/JS files, export each file, or download the whole project as a ZIP." },
      { title: "Beautify & Minify", description: "Format your code with one click, or minify it for size-sensitive deployments." },
      { title: "Auto Save & Restore", description: "Your project is saved to local storage automatically and restored when you return." },
    ],
    howTo: {
      heading: "How to Use the HTML/CSS/JS Playground",
      description: "Build and preview a web project in three simple steps.",
      steps: [
        { name: "Choose a template or start blank", text: "Pick one of the nine starter templates, or start from an empty project and write your own code." },
        { name: "Write your code", text: "Edit the HTML, CSS, and JavaScript panels — the preview updates live and the console shows your logs and errors." },
        { name: "Export your project", text: "Download your code as separate files or as a ZIP archive, or copy any panel to your clipboard." },
      ],
    },
    faqs: [
      { question: "What is an HTML/CSS/JS playground?", answer: "It's an online editor where you write HTML, CSS, and JavaScript in separate panels and see the rendered result instantly — like a lightweight CodePen that runs entirely in your browser." },
      { question: "Is the playground free?", answer: "Yes, completely free with no sign-ups, no limits, and no watermarks." },
      { question: "Is my code uploaded anywhere?", answer: "No. All editing, previewing, and storage happens locally in your browser. Your code never leaves your device." },
      { question: "Which editor engine does it use?", answer: "It uses Monaco, the same editor engine that powers VS Code, with syntax highlighting, auto-completion, bracket matching, folding, and a minimap." },
      { question: "Does the preview update live?", answer: "Yes. The preview re-renders automatically a moment after you stop typing (debounced), and you can also hit Run manually." },
      { question: "Does it capture console.log output?", answer: "Yes. The console panel captures console.log, console.warn, console.error, and uncaught runtime errors, formatted like browser DevTools." },
      { question: "Can I start from a template?", answer: "There are nine templates: landing page, portfolio, dashboard, navbar, hero section, login page, pricing page, card layout, and a blank project." },
      { question: "Can I export my project?", answer: "Yes — download the HTML, CSS, and JavaScript as individual files, or export the entire project as a ZIP archive." },
      { question: "Can I import existing files?", answer: "Yes, you can import .html, .css, and .js files, and their contents are loaded into the matching editor panel." },
      { question: "Does it autosave my work?", answer: "Yes. Your project is saved to your browser's local storage as you type and restored automatically the next time you visit." },
      { question: "Can I preview at mobile sizes?", answer: "Yes — switch the preview between desktop, tablet, and mobile viewport widths, or open a fullscreen preview." },
      { question: "Is there a beautify option?", answer: "Yes, one-click Beautify formats the active panel, and Minify produces compact output for size-sensitive projects." },
      { question: "Does it work on mobile?", answer: "The tool is fully responsive and usable on tablets and phones, though the full three-panel layout is most comfortable on larger screens." },
      { question: "Can I use JavaScript libraries?", answer: "You can import libraries with <script src> tags or CDN links inside your HTML — anything the browser can fetch will load in the preview." },
      { question: "Why does my preview show a blank page?", answer: "Check the console panel for errors — a syntax error in JS or an unclosed tag in HTML usually explains a blank preview. Fix the highlighted line and re-run." },
    ],
  },

  "sql-playground": {
    meta: { readTime: "6 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Real SQLite via WASM",
      "5 sample databases",
      "CSV import & export",
      "Query history & explain",
      "100% in your browser",
    ],
    intro: {
      heading: "SQL Playground — Run Real SQLite Queries in Your Browser",
      paragraphs: [
        "The SQL Playground runs a genuine SQLite engine inside your browser using WebAssembly (sql.js) — no backend, no sign-up, no database server. Create tables, insert data, run SELECT, JOIN, GROUP BY, subqueries, transactions, indexes, and views against real SQLite, and see the results in a polished, sortable data grid.",
        "Load one of five ready-made sample databases (Employees, Products, Orders, Students, Customers), import your own CSV or SQL files, or upload an existing .db database. Run EXPLAIN QUERY PLAN to inspect how SQLite executes your queries, track execution time and row counts, and export results to CSV — all locally on your device.",
      ],
    },
    benefits: [
      { title: "Real SQLite, Not a Simulator", description: "Powered by sql.js, a full WebAssembly build of SQLite — every query behaves exactly like your local database." },
      { title: "Five Sample Databases", description: "Employees, Products, Orders, Students, and Customers — populated with realistic data so you can start learning instantly." },
      { title: "CSV & SQL Import/Export", description: "Import CSV to create tables automatically, export any result set to CSV, and download or upload full .db files." },
      { title: "100% Private", description: "The entire database lives in your browser's memory. Nothing is ever uploaded to any server." },
    ],
    features: [
      { title: "Monaco SQL Editor", description: "Syntax highlighting, auto-completion for keywords, and multi-statement execution from one editor." },
      { title: "Full SQLite Support", description: "CREATE, INSERT, UPDATE, DELETE, DROP, ALTER, SELECT with JOIN, GROUP BY, ORDER BY, LIMIT, indexes, views, and transactions." },
      { title: "Sample Databases", description: "Five populated sample schemas to explore joins, aggregations, and subqueries immediately." },
      { title: "Beautiful Data Grid", description: "Results render in a grid with pagination, column sorting, filtering, resizable columns, and copy cell/row actions." },
      { title: "CSV Import & Export", description: "Create a table from any CSV file (with type inference) and export any query result back to CSV." },
      { title: "Query History", description: "Recent queries and saved queries are stored locally, so you can re-run anything instantly." },
      { title: "EXPLAIN QUERY PLAN", description: "See exactly how SQLite executes your query — the index scan, table scan, or join order used under the hood." },
      { title: "Database Files", description: "Download your session as a real .db file and upload any existing SQLite database to keep working with it." },
    ],
    howTo: {
      heading: "How to Use the SQL Playground",
      description: "Start querying real SQLite in three simple steps.",
      steps: [
        { name: "Load a sample or write SQL", text: "Pick a sample database like Employees or Products, type a query in the editor, or import a CSV/SQL/.db file." },
        { name: "Run the query", text: "Press Run (or Ctrl/Cmd+Enter). Results appear in the data grid with execution time and row counts." },
        { name: "Explore & export", text: "Sort and filter results, inspect the query plan with EXPLAIN, and export to CSV or download the database." },
      ],
    },
    faqs: [
      { question: "What is the SQL Playground?", answer: "It's a browser-based tool that runs a real SQLite database engine (via WebAssembly) so you can create tables, insert data, and run queries without installing anything." },
      { question: "Is it free?", answer: "Yes, completely free with no sign-ups, no limits, and no data caps." },
      { question: "Is my data uploaded to a server?", answer: "No. The SQLite engine and your entire database run in your browser's memory. Nothing is ever uploaded." },
      { question: "Which SQL dialect does it support?", answer: "It uses real SQLite, so you get full SQLite SQL: joins, subqueries, window functions, CTEs, indexes, views, triggers, and transactions." },
      { question: "How does it run SQLite in a browser?", answer: "It uses sql.js, an official build of SQLite compiled to WebAssembly, which executes locally in your browser." },
      { question: "Can I run multiple statements at once?", answer: "Yes, the editor runs multiple semicolon-separated statements and shows the result of each one." },
      { question: "Are there sample databases?", answer: "Yes — five populated samples: Employees, Products, Orders, Students, and Customers, each designed to demonstrate joins and aggregations." },
      { question: "Can I import a CSV file?", answer: "Yes. Import a CSV and the tool creates a table automatically, inferring column types from the data." },
      { question: "Can I export query results to CSV?", answer: "Yes, any result set can be exported to a CSV file with one click." },
      { question: "Can I upload my own .db database?", answer: "Yes, upload any SQLite .db file and query it directly — the tool loads it into memory instantly." },
      { question: "Can I download my database?", answer: "Yes, download the current session (including all your changes) as a real SQLite .db file." },
      { question: "What does EXPLAIN QUERY PLAN do?", answer: "It shows how SQLite actually executes your query — which tables are scanned, which indexes are used, and the join order — invaluable for optimizing slow queries." },
      { question: "Does it track query history?", answer: "Yes. Recent queries and queries you explicitly save are stored locally and can be re-run with one click." },
      { question: "Can I sort and filter results?", answer: "Yes, the data grid supports click-to-sort columns, text filtering, pagination, and resizable columns." },
      { question: "Does it work on mobile?", answer: "Yes, the tool is fully responsive — the editor and data grid both work well on tablets and phones." },
    ],
  },
};
