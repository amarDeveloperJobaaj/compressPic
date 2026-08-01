import type { CalculatorResult, ChartDef, TableDef } from "../types";
import { formatINR, formatNumber } from "./format";

/** Shared helpers */
function seriesOf(values: number[]): ChartDef {
  return {
    type: "area",
    title: "Growth Timeline",
    format: "inr",
    labels: ["Investment", "Wealth"],
    categories: values.map((_, i) => (i === 0 ? "Start" : `Yr ${i}`)),
    datasets: [values],
    colors: ["#2563EB", "#0EA5E9"],
  };
}

function yearTable(headers: string[], rows: number[][]): TableDef {
  return {
    title: "Year-wise Breakdown",
    columns: [
      { key: "year", label: "Year", format: "number" },
      ...headers.map((h) => ({ key: h, label: h, format: "inr" as const })),
    ],
    rows: rows.map((r) => ({ values: r.map((v) => Math.round(v)) })),
  };
}

/* ------------------------------------------------------------------ */
/* SIP                                                                 */
/* ------------------------------------------------------------------ */

export function computeSip(values: Record<string, number>): CalculatorResult {
  const monthly = values.monthly;
  const annualReturn = values.annualReturn / 100;
  const years = values.years;
  const stepUp = (values.stepUp ?? 0) / 100;
  const inflation = (values.inflation ?? 0) / 100;
  const months = years * 12;
  const r = annualReturn / 12;

  // Month-by-month with optional step-up
  const monthlyBalances: number[] = [];
  let invested = 0;
  let balance = 0;
  let contribution = monthly;
  for (let m = 1; m <= months; m++) {
    if (stepUp > 0 && m > 1 && m % 12 === 1) contribution = monthly * Math.pow(1 + stepUp, m / 12 - 1);
    invested += contribution;
    balance = (balance + contribution) * (1 + r);
    monthlyBalances.push(balance);
  }

  // Inflation-adjusted future value
  const realValue = balance / Math.pow(1 + inflation, years);
  const profit = balance - invested;

  const yearly = [] as number[][];
  for (let y = 1; y <= years; y++) {
    const end = monthlyBalances[y * 12 - 1] ?? balance;
    const investedAt = invested * (y / years);
    yearly.push([y, Math.round(investedAt), Math.round(end)]);
  }

  return {
    values: {
      invested,
      profit,
      maturity: balance,
      realValue,
    },
    charts: [seriesOf(yearly.map((r) => r[2]))],
    tables: [yearTable(["Invested", "Value"], yearly)],
    explanation: {
      formula: "FV = P × [((1 + r)^n − 1) / r] × (1 + r), with r = monthly return and n = months",
      steps: [
        `Monthly SIP: ${formatINR(monthly)}`,
        `Expected annual return: ${values.annualReturn}% (monthly ${(annualReturn / 12 * 100).toFixed(2)}%)`,
        `Duration: ${years} years (${months} months)`,
        `Step-up: ${values.stepUp ?? 0}% per year`,
        `Total invested: ${formatINR(invested)}, final value: ${formatINR(balance)}`,
        stepUp > 0 ? `Step-up added ${formatINR(invested - monthly * months)} over a flat SIP.` : "No step-up applied.",
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Compound Interest                                                   */
/* ------------------------------------------------------------------ */

export function computeCompound(values: Record<string, number>): CalculatorResult {
  const p = values.principal;
  const r = values.rate / 100;
  const years = values.years;
  const frequency = values.frequency; // 1,2,4,12
  const n = frequency * years;
  const amount = p * Math.pow(1 + r / frequency, n);
  const interest = amount - p;

  const yearly = [] as number[][];
  for (let y = 1; y <= years; y++) {
    const amt = p * Math.pow(1 + r / frequency, frequency * y);
    yearly.push([y, Math.round(p), Math.round(amt)]);
  }

  return {
    values: { principal: p, interest, maturity: amount },
    charts: [seriesOf(yearly.map((r) => r[2]))],
    tables: [yearTable(["Principal", "Amount"], yearly)],
    explanation: {
      formula: "A = P × (1 + r/n)^(n×t)",
      steps: [
        `Principal: ${formatINR(p)}`,
        `Rate: ${values.rate}% per annum, compounded ${frequency}× per year`,
        `Term: ${years} years (${n} compounding periods)`,
        `Maturity value: ${formatINR(amount)}`,
        `Interest earned: ${formatINR(interest)}`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* EMI                                                                 */
/* ------------------------------------------------------------------ */

export function computeEmi(values: Record<string, number>): CalculatorResult {
  const principal = values.loanAmount;
  const annualRate = values.rate / 100;
  const years = values.years;
  const fee = values.processingFee ?? 0;
  const r = annualRate / 12;
  const n = years * 12;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const interest = totalPayment - principal;
  const feeAmount = (principal * fee) / 100;

  const table = [] as number[][];
  let balance = principal;
  for (let m = 1; m <= n; m++) {
    const interestPart = balance * r;
    const principalPart = emi - interestPart;
    balance = Math.max(0, balance - principalPart);
    if (m % 12 === 0 || m === n) table.push([m, Math.round(principalPart), Math.round(interestPart), Math.round(balance)]);
  }

  return {
    values: { emi, interest, total: totalPayment, principal },
    charts: [
      {
        type: "donut",
        title: "Payment Split",
        format: "inr",
        labels: ["Principal", "Interest"],
        categories: ["Principal", "Interest"],
        datasets: [[principal, interest]],
        colors: ["#2563EB", "#F59E0B"],
      },
    ],
    tables: [
      {
        title: "Amortization Schedule (yearly view)",
        columns: [
          { key: "month", label: "Month", format: "number" },
          { key: "principal", label: "Principal", format: "inr" },
          { key: "interest", label: "Interest", format: "inr" },
          { key: "balance", label: "Balance", format: "inr" },
        ],
        rows: table.map((r) => ({ values: r })),
      },
    ],
    explanation: {
      formula: "EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)",
      steps: [
        `Loan amount: ${formatINR(principal)}, rate: ${values.rate}%, tenure: ${years} years`,
        `Monthly EMI: ${formatINR(emi)}`,
        `Total interest: ${formatINR(interest)}`,
        `Processing fee (${fee}%): ${formatINR(feeAmount)}`,
        `Total cost including fee: ${formatINR(totalPayment + feeAmount)}`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* GST                                                                 */
/* ------------------------------------------------------------------ */

export function computeGst(values: Record<string, number>): CalculatorResult {
  const amount = values.amount;
  const gstRate = values.rate / 100;
  const mode = values.mode; // 1 = add GST, 0 = remove GST

  const gstAmount = mode === 1 ? amount * gstRate : (amount * gstRate) / (1 + gstRate);
  const netAmount = mode === 1 ? amount + gstAmount : amount - gstAmount;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return {
    values: { gstAmount, netAmount, total: mode === 1 ? netAmount : amount, cgst, sgst },
    charts: [
      {
        type: "donut",
        title: "GST Split",
        format: "inr",
        labels: ["Base", "CGST", "SGST"],
        categories: ["Base", "CGST", "SGST"],
        datasets: [[mode === 1 ? amount : netAmount, cgst, sgst]],
        colors: ["#2563EB", "#10B981", "#8B5CF6"],
      },
    ],
    tables: [],
    explanation: {
      formula: mode === 1 ? "GST = Amount × Rate%" : "GST = Amount × Rate% / (1 + Rate%)",
      steps: [
        `Amount: ${formatINR(amount)}, GST rate: ${values.rate}%`,
        mode === 1 ? `GST added: ${formatINR(gstAmount)}, total: ${formatINR(netAmount)}` : `GST removed: ${formatINR(gstAmount)}, net: ${formatINR(netAmount)}`,
        `CGST (half): ${formatINR(cgst)}, SGST (half): ${formatINR(sgst)}`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* FD                                                                  */
/* ------------------------------------------------------------------ */

export function computeFd(values: Record<string, number>): CalculatorResult {
  const p = values.investment;
  const r = values.rate / 100;
  const years = values.years;
  const frequency = values.frequency;
  const amount = p * Math.pow(1 + r / frequency, frequency * years);
  const interest = amount - p;

  const yearly = [] as number[][];
  for (let y = 1; y <= years; y++) {
    const amt = p * Math.pow(1 + r / frequency, frequency * y);
    yearly.push([y, Math.round(p), Math.round(amt)]);
  }

  return {
    values: { principal: p, interest, maturity: amount },
    charts: [seriesOf(yearly.map((r) => r[2]))],
    tables: [yearTable(["Invested", "Value"], yearly)],
    explanation: {
      formula: "A = P × (1 + r/n)^(n×t)",
      steps: [
        `Investment: ${formatINR(p)}, rate: ${values.rate}%, tenure: ${years} years`,
        `Compounding: ${frequency}× per year`,
        `Maturity value: ${formatINR(amount)}`,
        `Interest earned: ${formatINR(interest)}`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* CAGR                                                                */
/* ------------------------------------------------------------------ */

export function computeCagr(values: Record<string, number>): CalculatorResult {
  const initial = values.initialValue;
  const final = values.finalValue;
  const years = values.years;
  const cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;
  const totalReturn = ((final - initial) / initial) * 100;

  const yearly = [] as number[][];
  for (let y = 0; y <= years; y++) {
    const v = initial * Math.pow(1 + cagr / 100, y);
    yearly.push([y, Math.round(v)]);
  }

  return {
    values: { initial, final, profit: final - initial, cagr, totalReturn },
    charts: [seriesOf(yearly.map((r) => r[1]))],
    tables: [yearTable(["Value"], yearly)],
    explanation: {
      formula: "CAGR = (Final / Initial)^(1/years) − 1",
      steps: [
        `Initial value: ${formatINR(initial)}, final value: ${formatINR(final)}`,
        `Holding period: ${years} years`,
        `CAGR: ${cagr.toFixed(2)}% per annum`,
        `Total return: ${totalReturn.toFixed(2)}%`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* ROI                                                                 */
/* ------------------------------------------------------------------ */

export function computeRoi(values: Record<string, number>): CalculatorResult {
  const investment = values.investment;
  const returns = values.returns;
  const years = values.years;
  const profit = returns - investment;
  const roi = (profit / investment) * 100;
  const annualized = (Math.pow(returns / investment, 1 / Math.max(1, years)) - 1) * 100;

  return {
    values: { investment, returns, profit, roi, annualized },
    charts: [
      {
        type: "bar",
        title: "Investment vs Returns",
        format: "inr",
        labels: ["Investment", "Returns"],
        categories: ["Investment", "Returns"],
        datasets: [[investment, returns]],
        colors: ["#2563EB", "#10B981"],
      },
    ],
    tables: [],
    explanation: {
      formula: "ROI = (Returns − Investment) / Investment × 100",
      steps: [
        `Investment: ${formatINR(investment)}, returns: ${formatINR(returns)}`,
        `Profit: ${formatINR(profit)}`,
        `ROI: ${roi.toFixed(2)}%`,
        `Annualized ROI: ${annualized.toFixed(2)}% over ${years} years`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Income Tax (India)                                                  */
/* ------------------------------------------------------------------ */

const OLD_SLABS = [
  { limit: 250000, rate: 0 },
  { limit: 500000, rate: 0.05 },
  { limit: 1000000, rate: 0.2 },
  { limit: Infinity, rate: 0.3 },
];

const NEW_SLABS = [
  { limit: 300000, rate: 0 },
  { limit: 700000, rate: 0.05 },
  { limit: 1000000, rate: 0.1 },
  { limit: 1200000, rate: 0.15 },
  { limit: 1500000, rate: 0.2 },
  { limit: Infinity, rate: 0.3 },
];

function slabTax(income: number, slabs: { limit: number; rate: number }[]): number {
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (income > prev) {
      tax += (Math.min(income, slab.limit) - prev) * slab.rate;
    }
    prev = slab.limit;
    if (income <= slab.limit) break;
  }
  return tax;
}

export function computeTax(values: Record<string, number>): CalculatorResult {
  const income = values.income;
  const regime = values.regime; // 0 old, 1 new
  const slabs = regime === 1 ? NEW_SLABS : OLD_SLABS;
  const standardDeduction = regime === 1 ? 75000 : 50000;
  const taxable = Math.max(0, income - standardDeduction);
  const baseTax = slabTax(taxable, slabs);
  const cess = baseTax * 0.04;
  const totalTax = baseTax + cess;
  const effectiveRate = (totalTax / income) * 100;

  // Slab breakdown
  const breakdown = [] as number[][];
  let prev = 0;
  for (const slab of slabs) {
    const lower = prev;
    const upper = Math.min(taxable, slab.limit);
    if (taxable > lower) {
      breakdown.push([lower, upper, Math.max(0, (upper - lower) * slab.rate)]);
    }
    prev = slab.limit;
    if (taxable <= slab.limit) break;
  }

  return {
    values: { taxable, baseTax, cess, totalTax, effectiveRate },
    charts: [
      {
        type: "donut",
        title: "Tax Breakdown",
        format: "inr",
        labels: ["Base Tax", "Cess", "Take-home"],
        categories: ["Base Tax", "Cess", "Take-home"],
        datasets: [[baseTax, cess, income - totalTax]],
        colors: ["#EF4444", "#F59E0B", "#10B981"],
      },
    ],
    tables: [
      {
        title: `${regime === 1 ? "New" : "Old"} Regime Slab Breakdown`,
        columns: [
          { key: "from", label: "From", format: "inr" },
          { key: "to", label: "To", format: "inr" },
          { key: "tax", label: "Tax", format: "inr" },
        ],
        rows: breakdown.map((r) => ({ values: r })),
      },
    ],
    explanation: {
      formula: "Tax = Σ(slab income × slab rate) + 4% education cess",
      steps: [
        `Annual income: ${formatINR(income)}`,
        `${regime === 1 ? "New" : "Old"} regime with standard deduction of ${formatINR(standardDeduction)}`,
        `Taxable income: ${formatINR(taxable)}`,
        `Base tax: ${formatINR(baseTax)}, education cess (4%): ${formatINR(cess)}`,
        `Total tax: ${formatINR(totalTax)}, effective rate: ${effectiveRate.toFixed(2)}%`,
        `Take-home: ${formatINR(income - totalTax)}`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Retirement                                                          */
/* ------------------------------------------------------------------ */

export function computeRetirement(values: Record<string, number>): CalculatorResult {
  const currentAge = values.currentAge;
  const retirementAge = values.retirementAge;
  const monthly = values.monthlyInvestment;
  const savings = values.currentSavings;
  const inflation = (values.inflation ?? 0) / 100;
  const returnRate = (values.expectedReturn ?? 0) / 100;
  const years = Math.max(1, retirementAge - currentAge);
  const months = years * 12;
  const r = returnRate / 12;

  // Corpus from current savings (lump sum)
  const lumpSumFV = savings * Math.pow(1 + returnRate, years);
  // Corpus from monthly investments (annuity due)
  const sipFV = monthly * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
  const corpus = lumpSumFV + sipFV;

  // 4% rule for monthly withdrawal
  const monthlyWithdrawal = (corpus * 0.04) / 12;
  const todayWithdrawal = monthlyWithdrawal / Math.pow(1 + inflation, years);

  const yearly = [] as number[][];
  for (let y = 1; y <= years; y++) {
    const lf = savings * Math.pow(1 + returnRate, y);
    const sf = monthly * (((Math.pow(1 + r, y * 12) - 1) / r) * (1 + r));
    yearly.push([y, Math.round(lf + sf)]);
  }

  return {
    values: { corpus, monthlyWithdrawal, todayWithdrawal, years },
    charts: [seriesOf(yearly.map((r) => r[1]))],
    tables: [yearTable(["Corpus"], yearly)],
    explanation: {
      formula: "Corpus = Savings×(1+r)^t + SIP×[((1+r)^n−1)/r]×(1+r)",
      steps: [
        `${years} years until retirement (age ${currentAge} → ${retirementAge})`,
        `Monthly investment: ${formatINR(monthly)}, current savings: ${formatINR(savings)}`,
        `Expected return: ${values.expectedReturn}%, inflation: ${values.inflation}%`,
        `Projected corpus: ${formatINR(corpus)}`,
        `Estimated monthly income (4% rule): ${formatINR(monthlyWithdrawal)}`,
        `That's ≈ ${formatINR(todayWithdrawal)} in today's purchasing power.`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Discount                                                            */
/* ------------------------------------------------------------------ */

export function computeDiscount(values: Record<string, number>): CalculatorResult {
  const price = values.price;
  const discountPct = values.discount / 100;
  const discount = price * discountPct;
  const finalPrice = price - discount;

  return {
    values: { price, discount, finalPrice, savings: discount },
    charts: [
      {
        type: "bar",
        title: "Price vs Savings",
        format: "inr",
        labels: ["Original", "You Pay", "You Save"],
        categories: ["Original", "You Pay", "You Save"],
        datasets: [[price, finalPrice, discount]],
        colors: ["#2563EB", "#10B981", "#F59E0B"],
      },
    ],
    tables: [],
    explanation: {
      formula: "Discount = Price × Discount%",
      steps: [
        `Original price: ${formatINR(price)}`,
        `Discount: ${values.discount}% = ${formatINR(discount)}`,
        `Final price: ${formatINR(finalPrice)}`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Profit Margin                                                       */
/* ------------------------------------------------------------------ */

export function computeMargin(values: Record<string, number>): CalculatorResult {
  const cost = values.costPrice;
  const price = values.sellingPrice;
  const profit = price - cost;
  const margin = (profit / price) * 100;
  const markup = (profit / cost) * 100;

  return {
    values: { cost, price, profit, margin, markup },
    charts: [
      {
        type: "donut",
        title: "Cost vs Profit",
        format: "inr",
        labels: ["Cost", "Profit"],
        categories: ["Cost", "Profit"],
        datasets: [[cost, Math.max(0, profit)]],
        colors: ["#2563EB", "#10B981"],
      },
    ],
    tables: [],
    explanation: {
      formula: "Margin = Profit / Selling Price × 100; Markup = Profit / Cost × 100",
      steps: [
        `Cost price: ${formatINR(cost)}, selling price: ${formatINR(price)}`,
        `Profit: ${formatINR(profit)}`,
        `Margin: ${margin.toFixed(2)}%, markup: ${markup.toFixed(2)}%`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Stock Average                                                       */
/* ------------------------------------------------------------------ */

export function computeStockAverage(values: Record<string, number>): CalculatorResult {
  // Values are flat: qty0, price0, qty1, price1, ...
  const entries: { qty: number; price: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const qty = values[`qty${i}`] ?? 0;
    const price = values[`price${i}`] ?? 0;
    if (qty > 0 && price > 0) entries.push({ qty, price });
  }

  const totalQty = entries.reduce((s, e) => s + e.qty, 0);
  const totalCost = entries.reduce((s, e) => s + e.qty * e.price, 0);
  const avgPrice = totalQty > 0 ? totalCost / totalQty : 0;
  const currentPrice = values.currentPrice ?? avgPrice;
  const marketValue = currentPrice * totalQty;
  const profitLoss = marketValue - totalCost;
  const plPct = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

  return {
    values: { totalQty, totalCost, avgPrice, marketValue, profitLoss, plPct },
    charts: [
      {
        type: "bar",
        title: "Invested vs Market Value",
        format: "inr",
        labels: ["Invested", "Market"],
        categories: ["Invested", "Market"],
        datasets: [[totalCost, marketValue]],
        colors: ["#2563EB", profitLoss >= 0 ? "#10B981" : "#EF4444"],
      },
    ],
    tables: [],
    explanation: {
      formula: "Average Price = Σ(Qty × Price) / ΣQty",
      steps: [
        `${entries.length} purchase entries, ${formatNumber(totalQty)} total shares`,
        `Total invested: ${formatINR(totalCost)}`,
        `Average buy price: ${formatINR(avgPrice)}`,
        `At market price ${formatINR(currentPrice)}: value ${formatINR(marketValue)}`,
        `P&L: ${formatINR(profitLoss)} (${plPct.toFixed(2)}%)`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Salary                                                              */
/* ------------------------------------------------------------------ */

export function computeSalary(values: Record<string, number>): CalculatorResult {
  const ctc = values.ctc;
  const bonus = (values.bonus ?? 0) / 100;
  const pfRate = (values.pf ?? 12) / 100;
  const professionalTax = values.professionalTax ?? 2400;
  const pfMonthly = Math.min(ctc / 12 * pfRate, 1800);
  const pfYearly = pfMonthly * 12;
  const bonusAmount = ctc * bonus;
  const grossYearly = ctc - pfYearly - professionalTax;
  // Rough income tax estimate on taxable income (post standard deduction)
  const taxable = Math.max(0, grossYearly - 75000);
  const taxEstimate = slabTax(taxable, NEW_SLABS) * 1.04;
  const netYearly = grossYearly - taxEstimate;
  const netMonthly = netYearly / 12;
  const employerCost = ctc + pfYearly; // employer PF + other costs

  return {
    values: { ctc, grossYearly, taxEstimate, netYearly, netMonthly, pfYearly, employerCost },
    charts: [
      {
        type: "donut",
        title: "Salary Breakdown",
        format: "inr",
        labels: ["Net Salary", "Tax", "PF", "Professional Tax"],
        categories: ["Net", "Tax", "PF", "PT"],
        datasets: [[netYearly, taxEstimate, pfYearly, professionalTax]],
        colors: ["#10B981", "#EF4444", "#F59E0B", "#8B5CF6"],
      },
    ],
    tables: [],
    explanation: {
      formula: "Net = CTC − PF − Professional Tax − Income Tax",
      steps: [
        `CTC: ${formatINR(ctc)}, bonus: ${values.bonus}% (${formatINR(bonusAmount)})`,
        `PF @ ${pfRate * 100}% (capped ₹1,800/mo): ${formatINR(pfYearly)}`,
        `Professional tax: ${formatINR(professionalTax)}`,
        `Estimated income tax: ${formatINR(taxEstimate)}`,
        `Net yearly: ${formatINR(netYearly)}, net monthly: ${formatINR(netMonthly)}`,
        `Employer cost ≈ ${formatINR(employerCost)}`,
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Inflation                                                           */
/* ------------------------------------------------------------------ */

export function computeInflation(values: Record<string, number>): CalculatorResult {
  const amount = values.amount;
  const rate = (values.rate ?? 0) / 100;
  const years = values.years;
  const futureValue = amount * Math.pow(1 + rate, years);
  const purchasingPower = amount / Math.pow(1 + rate, years);
  const loss = amount - purchasingPower;

  const yearly = [] as number[][];
  for (let y = 0; y <= years; y++) {
    yearly.push([y, Math.round(amount / Math.pow(1 + rate, y))]);
  }

  return {
    values: { amount, futureValue, purchasingPower, loss },
    charts: [seriesOf(yearly.map((r) => r[1]))],
    tables: [yearTable(["Today's value"], yearly)],
    explanation: {
      formula: "FV = A × (1 + r)^t; PV = A / (1 + r)^t",
      steps: [
        `Current amount: ${formatINR(amount)}`,
        `Inflation: ${values.rate}% per year over ${years} years`,
        `Future value: ${formatINR(futureValue)}`,
        `Present purchasing power: ${formatINR(purchasingPower)}`,
        `Purchasing power lost: ${formatINR(loss)}`,
      ],
    },
  };
}
