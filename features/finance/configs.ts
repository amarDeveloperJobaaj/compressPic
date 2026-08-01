import type { CalculatorConfig } from "./types";
import {
  computeCagr,
  computeCompound,
  computeDiscount,
  computeEmi,
  computeFd,
  computeGst,
  computeInflation,
  computeMargin,
  computeRetirement,
  computeRoi,
  computeSalary,
  computeSip,
  computeStockAverage,
  computeTax,
} from "./utils/engine";

export const FINANCE_CONFIGS: Record<string, CalculatorConfig> = {
  "sip-calculator": {
    slug: "sip-calculator",
    name: "SIP Calculator",
    title: "SIP Calculator",
    description: "Estimate the future value of your monthly SIP investments.",
    icon: "trending-up",
    fields: [
      { key: "monthly", label: "Monthly Investment", min: 100, max: 1000000, step: 100, defaultValue: 10000, prefix: "₹" },
      { key: "annualReturn", label: "Expected Annual Return", min: 1, max: 30, step: 0.5, defaultValue: 12, suffix: "%" },
      { key: "years", label: "Investment Duration", min: 1, max: 40, step: 1, defaultValue: 10, suffix: "yrs" },
      { key: "stepUp", label: "Annual Step-up", min: 0, max: 30, step: 1, defaultValue: 0, suffix: "%", hint: "Increase SIP by this % every year" },
      { key: "inflation", label: "Inflation Rate", min: 0, max: 15, step: 0.5, defaultValue: 6, suffix: "%" },
    ],
    results: [
      { key: "invested", label: "Total Invested", format: "inr" },
      { key: "profit", label: "Total Profit", format: "inr" },
      { key: "maturity", label: "Future Value", format: "inr", primary: true },
      { key: "realValue", label: "Real Value (infl. adj.)", format: "inr" },
    ],
    compute: computeSip,
    summarize: (v, r) =>
      `Investing ₹${v.monthly}/month for ${v.years} years at ${v.annualReturn}% p.a. grows to ${r.values.maturity.toLocaleString("en-IN")} (invested: ${r.values.invested.toLocaleString("en-IN")}).`,
    example: { monthly: 10000, annualReturn: 12, years: 15, stepUp: 10, inflation: 6 },
  },

  "compound-interest-calculator": {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    title: "Compound Interest Calculator",
    description: "See how your principal grows with compound interest.",
    icon: "layers",
    fields: [
      { key: "principal", label: "Principal Amount", min: 1000, max: 100000000, step: 1000, defaultValue: 100000, prefix: "₹" },
      { key: "rate", label: "Annual Interest Rate", min: 1, max: 20, step: 0.5, defaultValue: 8, suffix: "%" },
      { key: "years", label: "Time Period", min: 1, max: 40, step: 1, defaultValue: 10, suffix: "yrs" },
      { key: "frequency", label: "Compounding Frequency", min: 1, max: 12, step: 1, defaultValue: 4, suffix: "×/yr", hint: "1=yearly, 2=half-yearly, 4=quarterly, 12=monthly" },
    ],
    results: [
      { key: "principal", label: "Principal", format: "inr" },
      { key: "interest", label: "Interest Earned", format: "inr" },
      { key: "maturity", label: "Maturity Value", format: "inr", primary: true },
    ],
    compute: computeCompound,
    summarize: (v, r) =>
      `₹${v.principal.toLocaleString("en-IN")} at ${v.rate}% compounded ${v.frequency}×/yr for ${v.years} years grows to ${r.values.maturity.toLocaleString("en-IN")}.`,
    example: { principal: 100000, rate: 8, years: 10, frequency: 4 },
  },

  "emi-calculator": {
    slug: "emi-calculator",
    name: "EMI Calculator",
    title: "EMI Calculator",
    description: "Calculate monthly EMI, interest and full amortization.",
    icon: "home",
    fields: [
      { key: "loanAmount", label: "Loan Amount", min: 10000, max: 100000000, step: 10000, defaultValue: 2000000, prefix: "₹" },
      { key: "rate", label: "Interest Rate", min: 5, max: 25, step: 0.25, defaultValue: 8.5, suffix: "%" },
      { key: "years", label: "Loan Tenure", min: 1, max: 30, step: 1, defaultValue: 20, suffix: "yrs" },
      { key: "processingFee", label: "Processing Fee", min: 0, max: 5, step: 0.1, defaultValue: 1, suffix: "%" },
    ],
    results: [
      { key: "emi", label: "Monthly EMI", format: "inr", primary: true },
      { key: "interest", label: "Total Interest", format: "inr" },
      { key: "total", label: "Total Payment", format: "inr" },
      { key: "principal", label: "Loan Amount", format: "inr" },
    ],
    compute: computeEmi,
    summarize: (v, r) =>
      `EMI for a ₹${v.loanAmount.toLocaleString("en-IN")} loan at ${v.rate}% for ${v.years} years is ${r.values.emi.toLocaleString("en-IN")}/month (total interest: ${r.values.interest.toLocaleString("en-IN")}).`,
    example: { loanAmount: 2000000, rate: 8.5, years: 20, processingFee: 1 },
  },

  "gst-calculator": {
    slug: "gst-calculator",
    name: "GST Calculator",
    title: "GST Calculator",
    description: "Add or remove GST with CGST/SGST split and invoice preview.",
    icon: "percent",
    fields: [
      { key: "amount", label: "Amount", min: 1, max: 10000000, step: 100, defaultValue: 10000, prefix: "₹" },
      { key: "rate", label: "GST Rate", min: 0, max: 28, step: 0.5, defaultValue: 18, suffix: "%" },
      { key: "mode", label: "Mode", min: 0, max: 1, step: 1, defaultValue: 1, suffix: "", hint: "1 = Add GST, 0 = Remove GST" },
    ],
    results: [
      { key: "gstAmount", label: "GST Amount", format: "inr" },
      { key: "cgst", label: "CGST", format: "inr" },
      { key: "sgst", label: "SGST", format: "inr" },
      { key: "netAmount", label: "Net / Total", format: "inr", primary: true },
    ],
    compute: computeGst,
    summarize: (v, r) =>
      `On ₹${v.amount.toLocaleString("en-IN")} at ${v.rate}% GST, the GST is ${r.values.gstAmount.toLocaleString("en-IN")} (CGST ${r.values.cgst.toLocaleString("en-IN")} + SGST ${r.values.sgst.toLocaleString("en-IN")}).`,
    example: { amount: 10000, rate: 18, mode: 1 },
  },

  "fd-calculator": {
    slug: "fd-calculator",
    name: "FD Calculator",
    title: "Fixed Deposit Calculator",
    description: "Estimate FD maturity value and interest earned.",
    icon: "landmark",
    fields: [
      { key: "investment", label: "Deposit Amount", min: 1000, max: 100000000, step: 1000, defaultValue: 500000, prefix: "₹" },
      { key: "rate", label: "Interest Rate", min: 1, max: 15, step: 0.25, defaultValue: 7.1, suffix: "%" },
      { key: "years", label: "Tenure", min: 1, max: 20, step: 1, defaultValue: 5, suffix: "yrs" },
      { key: "frequency", label: "Compounding", min: 1, max: 12, step: 1, defaultValue: 4, suffix: "×/yr", hint: "Banks typically compound quarterly (4×)" },
    ],
    results: [
      { key: "principal", label: "Deposit", format: "inr" },
      { key: "interest", label: "Interest Earned", format: "inr" },
      { key: "maturity", label: "Maturity Amount", format: "inr", primary: true },
    ],
    compute: computeFd,
    summarize: (v, r) =>
      `A ₹${v.investment.toLocaleString("en-IN")} FD at ${v.rate}% for ${v.years} years matures at ${r.values.maturity.toLocaleString("en-IN")} (interest: ${r.values.interest.toLocaleString("en-IN")}).`,
    example: { investment: 500000, rate: 7.1, years: 5, frequency: 4 },
  },

  "cagr-calculator": {
    slug: "cagr-calculator",
    name: "CAGR Calculator",
    title: "CAGR Calculator",
    description: "Find the annualized growth rate of your investment.",
    icon: "chart-line",
    fields: [
      { key: "initialValue", label: "Initial Value", min: 1000, max: 100000000, step: 1000, defaultValue: 100000, prefix: "₹" },
      { key: "finalValue", label: "Final Value", min: 1000, max: 1000000000, step: 1000, defaultValue: 250000, prefix: "₹" },
      { key: "years", label: "Holding Period", min: 1, max: 40, step: 1, defaultValue: 5, suffix: "yrs" },
    ],
    results: [
      { key: "cagr", label: "CAGR", format: "percent", primary: true },
      { key: "totalReturn", label: "Total Return", format: "percent" },
      { key: "profit", label: "Absolute Gain", format: "inr" },
    ],
    compute: computeCagr,
    summarize: (v, r) =>
      `₹${v.initialValue.toLocaleString("en-IN")} → ₹${v.finalValue.toLocaleString("en-IN")} over ${v.years} years is a CAGR of ${r.values.cagr.toFixed(2)}%.`,
    example: { initialValue: 100000, finalValue: 250000, years: 5 },
  },

  "roi-calculator": {
    slug: "roi-calculator",
    name: "ROI Calculator",
    title: "ROI Calculator",
    description: "Calculate return on investment and annualized ROI.",
    icon: "target",
    fields: [
      { key: "investment", label: "Total Investment", min: 1000, max: 100000000, step: 1000, defaultValue: 50000, prefix: "₹" },
      { key: "returns", label: "Final Returns", min: 1000, max: 1000000000, step: 1000, defaultValue: 75000, prefix: "₹" },
      { key: "years", label: "Holding Period", min: 1, max: 40, step: 1, defaultValue: 3, suffix: "yrs" },
    ],
    results: [
      { key: "profit", label: "Profit", format: "inr" },
      { key: "roi", label: "ROI", format: "percent", primary: true },
      { key: "annualized", label: "Annualized ROI", format: "percent" },
    ],
    compute: computeRoi,
    summarize: (v, r) =>
      `Investing ₹${v.investment.toLocaleString("en-IN")} returning ₹${v.returns.toLocaleString("en-IN")} gives a ${r.values.roi.toFixed(2)}% ROI (${r.values.annualized.toFixed(2)}% annualized).`,
    example: { investment: 50000, returns: 75000, years: 3 },
  },

  "income-tax-calculator": {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    title: "Income Tax Calculator (India)",
    description: "Estimate Indian income tax under old and new regimes.",
    icon: "receipt",
    fields: [
      { key: "income", label: "Annual Income", min: 100000, max: 100000000, step: 10000, defaultValue: 1000000, prefix: "₹" },
      { key: "regime", label: "Regime", min: 0, max: 1, step: 1, defaultValue: 1, suffix: "", hint: "1 = New Regime, 0 = Old Regime" },
    ],
    results: [
      { key: "taxable", label: "Taxable Income", format: "inr" },
      { key: "baseTax", label: "Base Tax", format: "inr" },
      { key: "cess", label: "Education Cess", format: "inr" },
      { key: "totalTax", label: "Total Tax", format: "inr", primary: true },
      { key: "effectiveRate", label: "Effective Rate", format: "percent" },
    ],
    compute: computeTax,
    summarize: (v, r) =>
      `On ₹${v.income.toLocaleString("en-IN")} under the ${v.regime === 1 ? "new" : "old"} regime, estimated tax is ${r.values.totalTax.toLocaleString("en-IN")} (effective ${r.values.effectiveRate.toFixed(2)}%).`,
    example: { income: 1000000, regime: 1 },
  },

  "retirement-calculator": {
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    title: "Retirement Calculator",
    description: "Project your retirement corpus and monthly income.",
    icon: "sun",
    fields: [
      { key: "currentAge", label: "Current Age", min: 18, max: 65, step: 1, defaultValue: 30, suffix: "yrs" },
      { key: "retirementAge", label: "Retirement Age", min: 40, max: 70, step: 1, defaultValue: 60, suffix: "yrs" },
      { key: "monthlyInvestment", label: "Monthly Investment", min: 500, max: 500000, step: 500, defaultValue: 20000, prefix: "₹" },
      { key: "currentSavings", label: "Current Savings", min: 0, max: 100000000, step: 10000, defaultValue: 500000, prefix: "₹" },
      { key: "expectedReturn", label: "Expected Return", min: 4, max: 20, step: 0.5, defaultValue: 12, suffix: "%" },
      { key: "inflation", label: "Inflation", min: 0, max: 15, step: 0.5, defaultValue: 6, suffix: "%" },
    ],
    results: [
      { key: "corpus", label: "Projected Corpus", format: "inr", primary: true },
      { key: "monthlyWithdrawal", label: "Monthly Income (4% rule)", format: "inr" },
      { key: "todayWithdrawal", label: "In Today's Money", format: "inr" },
      { key: "years", label: "Years to Retire", format: "number" },
    ],
    compute: computeRetirement,
    summarize: (v, r) =>
      `Saving ₹${v.monthlyInvestment}/month until age ${v.retirementAge} builds a corpus of ${r.values.corpus.toLocaleString("en-IN")} — ≈ ${r.values.monthlyWithdrawal.toLocaleString("en-IN")}/month in retirement.`,
    example: { currentAge: 30, retirementAge: 60, monthlyInvestment: 20000, currentSavings: 500000, expectedReturn: 12, inflation: 6 },
  },

  "discount-calculator": {
    slug: "discount-calculator",
    name: "Discount Calculator",
    title: "Discount Calculator",
    description: "Find the final price and savings after a discount.",
    icon: "badge-percent",
    fields: [
      { key: "price", label: "Original Price", min: 1, max: 10000000, step: 10, defaultValue: 2000, prefix: "₹" },
      { key: "discount", label: "Discount", min: 0, max: 90, step: 1, defaultValue: 20, suffix: "%" },
    ],
    results: [
      { key: "price", label: "Original Price", format: "inr" },
      { key: "discount", label: "You Save", format: "inr" },
      { key: "finalPrice", label: "Final Price", format: "inr", primary: true },
    ],
    compute: computeDiscount,
    summarize: (v, r) =>
      `${v.discount}% off ₹${v.price.toLocaleString("en-IN")} = ₹${r.values.finalPrice.toLocaleString("en-IN")} (save ${r.values.discount.toLocaleString("en-IN")}).`,
    example: { price: 2000, discount: 20 },
  },

  "profit-margin-calculator": {
    slug: "profit-margin-calculator",
    name: "Profit Margin Calculator",
    title: "Profit Margin Calculator",
    description: "Compute profit, margin and markup from cost and selling price.",
    icon: "coins",
    fields: [
      { key: "costPrice", label: "Cost Price", min: 1, max: 10000000, step: 10, defaultValue: 800, prefix: "₹" },
      { key: "sellingPrice", label: "Selling Price", min: 1, max: 10000000, step: 10, defaultValue: 1200, prefix: "₹" },
    ],
    results: [
      { key: "profit", label: "Profit", format: "inr" },
      { key: "margin", label: "Profit Margin", format: "percent", primary: true },
      { key: "markup", label: "Markup", format: "percent" },
    ],
    compute: computeMargin,
    summarize: (v, r) =>
      `Selling at ₹${v.sellingPrice} with cost ₹${v.costPrice} gives ₹${r.values.profit.toLocaleString("en-IN")} profit (margin ${r.values.margin.toFixed(2)}%).`,
    example: { costPrice: 800, sellingPrice: 1200 },
  },

  "stock-average-calculator": {
    slug: "stock-average-calculator",
    name: "Stock Average Calculator",
    title: "Stock Average Calculator",
    description: "Calculate average buy price across multiple purchases.",
    icon: "candlestick-chart",
    fields: [
      { key: "currentPrice", label: "Current Market Price", min: 0, max: 100000, step: 1, defaultValue: 100, prefix: "₹" },
      { type: "rows", key: "entries", label: "Purchase Entries", addLabel: "Add Entry", maxRows: 20, fields: [
        { key: "qty", label: "Qty", prefix: "" },
        { key: "price", label: "Price", prefix: "₹" },
      ] },
    ],
    results: [
      { key: "totalQty", label: "Total Quantity", format: "number" },
      { key: "totalCost", label: "Total Invested", format: "inr" },
      { key: "avgPrice", label: "Average Buy Price", format: "inr", primary: true },
      { key: "profitLoss", label: "Profit / Loss", format: "inr" },
      { key: "plPct", label: "P&L %", format: "percent" },
    ],
    compute: computeStockAverage,
    summarize: (v, r) =>
      `Average buy price across ${r.values.totalQty} shares is ${r.values.avgPrice.toLocaleString("en-IN")}; at market ${v.currentPrice} your P&L is ${r.values.profitLoss.toLocaleString("en-IN")} (${r.values.plPct.toFixed(2)}%).`,
  },

  "salary-calculator": {
    slug: "salary-calculator",
    name: "Salary Calculator",
    title: "Salary Calculator",
    description: "Estimate take-home salary from CTC after PF and tax.",
    icon: "wallet",
    fields: [
      { key: "ctc", label: "Annual CTC", min: 100000, max: 100000000, step: 10000, defaultValue: 1200000, prefix: "₹" },
      { key: "bonus", label: "Bonus / Variable", min: 0, max: 100, step: 1, defaultValue: 10, suffix: "%" },
      { key: "pf", label: "PF Contribution", min: 0, max: 20, step: 0.5, defaultValue: 12, suffix: "%", hint: "Employee PF; capped at ₹1,800/month" },
      { key: "professionalTax", label: "Professional Tax (yr)", min: 0, max: 50000, step: 100, defaultValue: 2400, prefix: "₹" },
    ],
    results: [
      { key: "netYearly", label: "Net Salary (year)", format: "inr", primary: true },
      { key: "netMonthly", label: "Net Salary (month)", format: "inr" },
      { key: "taxEstimate", label: "Income Tax (est.)", format: "inr" },
      { key: "pfYearly", label: "PF (year)", format: "inr" },
      { key: "employerCost", label: "Employer Cost", format: "inr" },
    ],
    compute: computeSalary,
    summarize: (v, r) =>
      `From a ₹${v.ctc.toLocaleString("en-IN")} CTC, estimated take-home is ${r.values.netMonthly.toLocaleString("en-IN")}/month (${r.values.netYearly.toLocaleString("en-IN")}/year).`,
    example: { ctc: 1200000, bonus: 10, pf: 12, professionalTax: 2400 },
  },

  "inflation-calculator": {
    slug: "inflation-calculator",
    name: "Inflation Calculator",
    title: "Inflation Calculator",
    description: "See how inflation erodes the purchasing power of money.",
    icon: "trending-down",
    fields: [
      { key: "amount", label: "Current Amount", min: 1000, max: 100000000, step: 1000, defaultValue: 100000, prefix: "₹" },
      { key: "rate", label: "Inflation Rate", min: 1, max: 20, step: 0.5, defaultValue: 6, suffix: "%" },
      { key: "years", label: "Time Period", min: 1, max: 40, step: 1, defaultValue: 10, suffix: "yrs" },
    ],
    results: [
      { key: "futureValue", label: "Future Value", format: "inr" },
      { key: "purchasingPower", label: "Present Purchasing Power", format: "inr", primary: true },
      { key: "loss", label: "Purchasing Power Lost", format: "inr" },
    ],
    compute: computeInflation,
    summarize: (v, r) =>
      `₹${v.amount.toLocaleString("en-IN")} today will be worth only ${r.values.purchasingPower.toLocaleString("en-IN")} in ${v.years} years at ${v.rate}% inflation.`,
    example: { amount: 100000, rate: 6, years: 10 },
  },
};

export const FINANCE_SLUGS = Object.keys(FINANCE_CONFIGS);

export function getFinanceConfig(slug: string): CalculatorConfig | undefined {
  return FINANCE_CONFIGS[slug];
}
