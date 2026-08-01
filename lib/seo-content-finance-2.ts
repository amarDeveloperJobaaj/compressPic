import type { ToolSeoContent } from "./seo-content";

/**
 * Finance Tools SEO content — part 2 (7 calculators).
 * Kept server-safe (no React imports) so layouts/metadata can consume it.
 * Every calculator has unique, hand-written content per page.
 */
export const FINANCE_TOOL_SEO_CONTENT_2: Record<string, ToolSeoContent> = {
  "income-tax-calculator": {
    meta: { readTime: "7 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Old & new regimes",
      "Standard deduction",
      "Education cess",
      "Effective tax rate",
      "Free & private",
    ],
    intro: {
      heading: "Income Tax Calculator (India) — Old vs New Regime",
      paragraphs: [
        "The Income Tax Calculator estimates your Indian income tax under both the old and new tax regimes. Enter your annual income, choose a regime, and instantly see your taxable income, base tax, education cess, total tax, and effective tax rate.",
        "Compare both regimes side by side to find the one that leaves more money in your pocket. Everything is calculated locally in your browser — no details are uploaded, and results are estimates for planning only.",
      ],
    },
    benefits: [
      {
        title: "Old vs New Regime",
        description: "Compare the 2024–25 slab structure of both regimes to pick the one with lower tax.",
      },
      {
        title: "Standard Deduction",
        description: "The ₹50,000 standard deduction (and ₹75,000 in the new regime) is applied automatically.",
      },
      {
        title: "Education Cess Included",
        description: "The 4% health and education cess is factored into your final tax.",
      },
      {
        title: "Effective Rate Clarity",
        description: "See what percentage of your total income actually goes to tax.",
      },
    ],
    features: [
      {
        title: "Regime Toggle",
        description: "Switch between old and new regime slab structures with a single control.",
      },
      {
        title: "Automatic Deductions",
        description: "Standard deduction and applicable rebates are computed for you.",
      },
      {
        title: "Tax Breakdown",
        description: "Separate cards show taxable income, base tax, cess, and total tax.",
      },
      {
        title: "Effective Rate",
        description: "Your true average tax rate as a percentage of gross income.",
      },
      {
        title: "Copy, Share & Print",
        description: "Copy the summary, share it, or print a report for your records.",
      },
    ],
    howTo: {
      heading: "How to Use the Income Tax Calculator",
      description: "Estimate your tax in three quick steps.",
      steps: [
        {
          name: "Enter your annual income",
          text: "Type or slide your total taxable income for the year (e.g. ₹12,00,000).",
        },
        {
          name: "Choose a regime",
          text: "Select the new or old regime to see that regime's slab structure applied.",
        },
        {
          name: "Review your tax",
          text: "Check taxable income, cess, total tax, and effective rate — then copy or share.",
        },
      ],
    },
    faqs: [
      {
        question: "How is income tax calculated in India?",
        answer:
          "Taxable income is charged at slab rates for the chosen regime, then a 4% health and education cess is added on top of the tax amount.",
      },
      {
        question: "Which regime is better — old or new?",
        answer:
          "The old regime usually wins if you claim many deductions (80C, HRA, home loan). The new regime has lower rates but few deductions. Use this calculator to compare both.",
      },
      {
        question: "What is the standard deduction?",
        answer:
          "A flat ₹50,000 deduction on salaried income in the old regime, and ₹75,000 in the new regime (2024–25), reducing your taxable income.",
      },
      {
        question: "What is the new regime slab for ₹12 lakh income?",
        answer:
          "For FY 2024–25, income up to ₹12,00,000 is effectively tax-free in the new regime due to the ₹75,000 standard deduction plus the rebate under section 87A.",
      },
      {
        question: "What is education cess?",
        answer:
          "A 4% health and education cess is charged on your total income tax, not on your income itself.",
      },
      {
        question: "How much tax will I pay on ₹15 lakh?",
        answer:
          "Under the new regime, roughly ₹1.07 lakh including cess after the standard deduction and rebate — the calculator shows the exact breakdown for your inputs.",
      },
      {
        question: "What is the rebate under 87A?",
        answer:
          "A tax rebate that makes income up to ₹7 lakh (old regime) and up to ₹12 lakh (new regime, 2024–25) effectively tax-free.",
      },
      {
        question: "Does the calculator include investments and HRA?",
        answer:
          "Not automatically — enter your income after claiming 80C, HRA, home loan, and other deductions for a personalized estimate.",
      },
      {
        question: "What is the effective tax rate?",
        answer:
          "Your total tax divided by your gross income, expressed as a percentage — the average rate you actually pay.",
      },
      {
        question: "Is the income tax calculator free?",
        answer:
          "Yes, completely free with no sign-ups, no watermarks, and no limits.",
      },
      {
        question: "Are the results official?",
        answer:
          "No — results are estimates based on current slab structures and are not tax advice. Confirm with a CA or the income tax department before filing.",
      },
      {
        question: "Can I copy or share my calculation?",
        answer:
          "Yes — copy a clean summary, share it, or print a report from the results toolbar.",
      },
      {
        question: "Is my income data private?",
        answer:
          "Completely — everything runs in your browser and nothing is uploaded or stored.",
      },
      {
        question: "Does the calculator support senior citizens?",
        answer:
          "The current version uses general slabs. Senior and super-senior citizens should verify their special slab thresholds with a tax professional.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly controls on all devices.",
      },
    ],
  },

  "retirement-calculator": {
    meta: { readTime: "7 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Corpus projection",
      "4% withdrawal rule",
      "Inflation-adjusted",
      "Retirement timeline",
      "Free & private",
    ],
    intro: {
      heading: "Retirement Calculator — Build Your Retirement Corpus",
      paragraphs: [
        "The Retirement Calculator projects how much money you'll have when you retire and what monthly income it can support. Enter your current age, target retirement age, monthly investment, current savings, expected return, and inflation to see your projected corpus, monthly retirement income, and what that's worth in today's money.",
        "Retirement planning works best early and with realistic assumptions. This tool makes the numbers clear so you can adjust your savings today. Everything runs privately in your browser.",
      ],
    },
    benefits: [
      {
        title: "Projected Corpus",
        description: "See the total retirement fund your current savings plan will build by retirement age.",
      },
      {
        title: "Monthly Income Estimate",
        description: "Use the 4% rule to estimate a sustainable monthly withdrawal in retirement.",
      },
      {
        title: "Inflation-Adjusted",
        description: "Understand what your future income is actually worth in today's purchasing power.",
      },
      {
        title: "Retirement Timeline",
        description: "Know exactly how many years you have to build your corpus.",
      },
    ],
    features: [
      {
        title: "Full Lifecycle Model",
        description: "Combines current savings growth with monthly contributions until retirement age.",
      },
      {
        title: "4% Withdrawal Rule",
        description: "A widely used guideline for estimating sustainable retirement income.",
      },
      {
        title: "Inflation Adjustment",
        description: "Deflates future income into today's rupees so goals stay realistic.",
      },
      {
        title: "Years-to-Retire",
        description: "A clear countdown from your current age to retirement age.",
      },
      {
        title: "Copy, Share & Print",
        description: "Export your retirement plan summary with one click.",
      },
    ],
    howTo: {
      heading: "How to Use the Retirement Calculator",
      description: "Plan your retirement in three steps.",
      steps: [
        {
          name: "Enter your ages",
          text: "Set your current age and the age you want to retire (e.g. 30 → 60).",
        },
        {
          name: "Add savings and returns",
          text: "Enter monthly investment, current savings, expected return, and inflation.",
        },
        {
          name: "Review your plan",
          text: "See your projected corpus, monthly retirement income, and inflation-adjusted value.",
        },
      ],
    },
    faqs: [
      {
        question: "How much money do I need to retire?",
        answer:
          "A common target is 25–30 times your annual expenses. This calculator projects your corpus and the monthly income it can support.",
      },
      {
        question: "What is the 4% rule?",
        answer:
          "A guideline suggesting you can withdraw 4% of your retirement corpus annually without running out over a 30-year retirement.",
      },
      {
        question: "How much should I save for retirement?",
        answer:
          "Aim to save 15–20% of your income. Start early — this calculator shows how much monthly investing can grow over decades.",
      },
      {
        question: "What is a good expected return for retirement planning?",
        answer:
          "Many planners assume 10–12% on equity-heavy portfolios. Use a lower, conservative figure to stress-test your plan.",
      },
      {
        question: "What is my corpus if I invest ₹20,000/month until 60?",
        answer:
          "At 12% returns, ₹20,000/month from age 30 to 60 grows to roughly ₹7 crore — the calculator shows your exact projection.",
      },
      {
        question: "How does inflation affect retirement?",
        answer:
          "Inflation erodes purchasing power — ₹1 lakh today could be worth far less in 30 years. The tool shows inflation-adjusted values.",
      },
      {
        question: "What is the retirement corpus formula?",
        answer:
          "Corpus = future value of current savings plus the future value of monthly contributions, both compounded at your expected return.",
      },
      {
        question: "Can I include my existing savings?",
        answer:
          "Yes — enter your current savings and they're compounded to retirement age along with your monthly contributions.",
      },
      {
        question: "Is the retirement calculator free?",
        answer:
          "Yes, completely free with no sign-ups and no limits.",
      },
      {
        question: "Are the results guaranteed?",
        answer:
          "No — projections depend on your return assumptions. They're planning estimates, not guarantees.",
      },
      {
        question: "How do I use the monthly income estimate?",
        answer:
          "It's your corpus × 4% ÷ 12 — a sustainable monthly withdrawal. Adjust your inputs to reach the income you want.",
      },
      {
        question: "What happens if I retire early?",
        answer:
          "You'll have fewer years to save and more years to fund — the calculator reflects this through your ages and returns.",
      },
      {
        question: "Can I copy or share my plan?",
        answer:
          "Yes — copy the summary, share it, or print a report of your retirement projection.",
      },
      {
        question: "Is my financial data private?",
        answer:
          "Yes — all calculations run locally in your browser; nothing is uploaded.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly sliders on all devices.",
      },
    ],
  },

  "discount-calculator": {
    meta: { readTime: "4 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Final price",
      "You save in ₹",
      "Discount percentage",
      "Instant update",
      "Free & private",
    ],
    intro: {
      heading: "Discount Calculator — Final Price & Savings in Seconds",
      paragraphs: [
        "The Discount Calculator tells you the final price and exactly how much you save when a discount is applied. Enter the original price and the discount percentage, and instantly see the discount amount, savings, and the price you actually pay.",
        "Perfect for sale shopping, negotiating, or double-checking that '50% off' deal. It runs instantly in your browser — no sign-up, no uploads.",
      ],
    },
    benefits: [
      {
        title: "Know the Real Price",
        description: "See the final price after any discount in an instant.",
      },
      {
        title: "Savings Made Visible",
        description: "The exact rupees you save — great for sale comparisons.",
      },
      {
        title: "Check Store Math",
        description: "Verify whether a sale price really matches the advertised discount.",
      },
      {
        title: "Free & Private",
        description: "No accounts, no uploads — the math happens on your device.",
      },
    ],
    features: [
      {
        title: "Original Price",
        description: "Enter any price in rupees to start.",
      },
      {
        title: "Discount Slider",
        description: "0–90% with instant final-price updates as you drag.",
      },
      {
        title: "You Save Card",
        description: "The exact rupee amount of your savings.",
      },
      {
        title: "Final Price Card",
        description: "The highlighted price you actually pay.",
      },
      {
        title: "Copy & Share",
        description: "Copy the result or share it with one click.",
      },
    ],
    howTo: {
      heading: "How to Use the Discount Calculator",
      description: "Work out any discount in three steps.",
      steps: [
        {
          name: "Enter the original price",
          text: "Type or slide the full price before the discount (e.g. ₹2,000).",
        },
        {
          name: "Set the discount",
          text: "Drag the slider to the discount percentage (e.g. 20%).",
        },
        {
          name: "See your savings",
          text: "Read the discount amount, final price, and total savings instantly.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I calculate a discount?",
        answer:
          "Discount amount = price × discount% ÷ 100. Final price = price − discount amount.",
      },
      {
        question: "How do I calculate 20% off ₹2,000?",
        answer:
          "20% of ₹2,000 is ₹400, so the final price is ₹1,600. The calculator does this instantly.",
      },
      {
        question: "What is the formula for final price?",
        answer:
          "Final Price = Original Price × (1 − discount%/100).",
      },
      {
        question: "How do I find the discount percentage?",
        answer:
          "If you know the sale price, the discount % = (original − sale) ÷ original × 100. The discount calculator helps with the reverse case.",
      },
      {
        question: "Is the discount calculator free?",
        answer:
          "Yes, completely free with no sign-ups and no limits.",
      },
      {
        question: "Can I calculate discounts for any currency?",
        answer:
          "The tool formats results in Indian rupees (₹), but the percentage math works for any currency you enter.",
      },
      {
        question: "What is the difference between discount and savings?",
        answer:
          "They're the same value — the amount subtracted from the original price. The calculator shows it as 'You Save'.",
      },
      {
        question: "Can I verify a store's sale price?",
        answer:
          "Yes — enter the original price and advertised discount to check whether the final price matches what's on the tag.",
      },
      {
        question: "Does it handle stacked discounts?",
        answer:
          "Not stacked automatically — apply one discount at a time, or compute sequential discounts manually using the same tool.",
      },
      {
        question: "Can I copy or share my result?",
        answer:
          "Yes — copy the final price and savings summary with one click.",
      },
      {
        question: "Is my data private?",
        answer:
          "Yes — everything runs locally in your browser and nothing is uploaded.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly controls.",
      },
    ],
  },

  "profit-margin-calculator": {
    meta: { readTime: "4 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Profit in ₹",
      "Margin percentage",
      "Markup percentage",
      "Instant update",
      "Free & private",
    ],
    intro: {
      heading: "Profit Margin Calculator — Price Your Products Correctly",
      paragraphs: [
        "The Profit Margin Calculator computes your profit, profit margin, and markup from just two numbers: cost price and selling price. Enter both and instantly see how much you earn per sale, your margin as a percentage of selling price, and your markup as a percentage of cost.",
        "Whether you run an e-commerce store, a small business, or a freelance service, understanding margin vs markup is essential for profitable pricing. Everything runs privately in your browser.",
      ],
    },
    benefits: [
      {
        title: "Profit Per Sale",
        description: "The exact rupee profit on every unit you sell.",
      },
      {
        title: "Margin vs Markup",
        description: "Understand both pricing metrics — they're different and both matter.",
      },
      {
        title: "Better Pricing Decisions",
        description: "Know whether your prices actually cover costs and deliver target profit.",
      },
      {
        title: "Free & Private",
        description: "No sign-up, no uploads — the math happens on your device.",
      },
    ],
    features: [
      {
        title: "Cost & Selling Price",
        description: "Two inputs are all you need for a full pricing breakdown.",
      },
      {
        title: "Profit Card",
        description: "Absolute profit in rupees per sale.",
      },
      {
        title: "Margin Card",
        description: "Profit as a percentage of the selling price.",
      },
      {
        title: "Markup Card",
        description: "Profit as a percentage of the cost price.",
      },
      {
        title: "Copy & Share",
        description: "Copy the breakdown or share it with one click.",
      },
    ],
    howTo: {
      heading: "How to Use the Profit Margin Calculator",
      description: "Analyze any product's profitability in three steps.",
      steps: [
        {
          name: "Enter the cost price",
          text: "What you pay to acquire or produce the product (e.g. ₹800).",
        },
        {
          name: "Enter the selling price",
          text: "What you charge the customer (e.g. ₹1,200).",
        },
        {
          name: "Review the margins",
          text: "See profit, margin %, and markup % — then copy or share.",
        },
      ],
    },
    faqs: [
      {
        question: "How is profit margin calculated?",
        answer:
          "Margin = (Selling Price − Cost) ÷ Selling Price × 100. Profit = Selling Price − Cost.",
      },
      {
        question: "What is the difference between margin and markup?",
        answer:
          "Margin is profit as a % of the selling price; markup is profit as a % of the cost. A 25% markup equals a 20% margin.",
      },
      {
        question: "What is a good profit margin?",
        answer:
          "It varies by industry — retail often runs 5–20%, services 30–60%. Compare against your industry norms.",
      },
      {
        question: "What is the formula for markup?",
        answer:
          "Markup = (Selling Price − Cost) ÷ Cost × 100.",
      },
      {
        question: "How do I calculate profit on ₹800 cost sold at ₹1,200?",
        answer:
          "Profit is ₹400; margin is 33.3% (400 ÷ 1200); markup is 50% (400 ÷ 800).",
      },
      {
        question: "Is the profit margin calculator free?",
        answer:
          "Yes, completely free with no sign-ups and no limits.",
      },
      {
        question: "Does it include taxes and shipping?",
        answer:
          "Enter your all-in cost (including shipping, fees, taxes) for a true net margin.",
      },
      {
        question: "What is the difference between gross and net margin?",
        answer:
          "Gross margin considers only direct product costs; net margin subtracts all other business expenses too. This tool models gross margin.",
      },
      {
        question: "Can I use it for services?",
        answer:
          "Yes — treat your time and delivery cost as the 'cost price' and your fee as the 'selling price'.",
      },
      {
        question: "Can I copy or share my result?",
        answer:
          "Yes — copy the profit, margin, and markup summary with one click.",
      },
      {
        question: "Is my data private?",
        answer:
          "Yes — all math runs locally in your browser; nothing is uploaded.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly inputs.",
      },
    ],
  },

  "stock-average-calculator": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Unlimited entries",
      "Average buy price",
      "P&L estimate",
      "Total invested",
      "Free & private",
    ],
    intro: {
      heading: "Stock Average Calculator — Lower Your Average Buy Price",
      paragraphs: [
        "The Stock Average Calculator finds your average buy price across multiple purchases of the same stock. Add unlimited buy entries with quantity and price, plus the current market price, and instantly see your total quantity, total invested, average price, and an estimated profit or loss.",
        "Perfect for tracking averaging-down strategies or keeping tabs on a position built up over time. Everything runs privately in your browser.",
      ],
    },
    benefits: [
      {
        title: "True Average Price",
        description: "Weighted average across all your purchases — not a simple mean.",
      },
      {
        title: "Unlimited Entries",
        description: "Add every buy you've made, no matter how many times you've averaged down.",
      },
      {
        title: "Live P&L Estimate",
        description: "Enter the current market price to see unrealized profit or loss instantly.",
      },
      {
        title: "Free & Private",
        description: "No account, no uploads — your trading math stays on your device.",
      },
    ],
    features: [
      {
        title: "Dynamic Rows",
        description: "Add and remove purchase entries freely with quantity and price per row.",
      },
      {
        title: "Average Buy Price",
        description: "The weighted average cost of all your shares.",
      },
      {
        title: "Total Quantity & Invested",
        description: "Summed across every purchase entry.",
      },
      {
        title: "Profit / Loss",
        description: "Estimated P&L in rupees and percentage at the current market price.",
      },
      {
        title: "Copy & Share",
        description: "Copy your position summary or share it with one click.",
      },
    ],
    howTo: {
      heading: "How to Use the Stock Average Calculator",
      description: "Track any stock position in three steps.",
      steps: [
        {
          name: "Add your purchases",
          text: "Enter quantity and price for each buy — add as many entries as you have.",
        },
        {
          name: "Enter the current price",
          text: "Set the current market price to see your estimated P&L.",
        },
        {
          name: "Review your position",
          text: "Check average buy price, total invested, and profit or loss.",
        },
      ],
    },
    faqs: [
      {
        question: "How is the average buy price calculated?",
        answer:
          "It's the weighted average: total cost of all shares ÷ total quantity — not the simple average of your entry prices.",
      },
      {
        question: "What is averaging down?",
        answer:
          "Buying more shares at a lower price to reduce your overall average cost per share — this tool makes the math clear.",
      },
      {
        question: "How do I calculate my average stock price?",
        answer:
          "Add the total money spent on all buys and divide by total shares. Example: 10 @ ₹100 + 10 @ ₹80 = ₹1,800 ÷ 20 = ₹90 average.",
      },
      {
        question: "Does it include brokerage and taxes?",
        answer:
          "Enter prices after adding brokerage and taxes for a true average cost per share.",
      },
      {
        question: "What is the formula for average price?",
        answer:
          "Average = Σ(qty × price) ÷ Σ(qty) across all purchases.",
      },
      {
        question: "How is profit or loss estimated?",
        answer:
          "P&L = (current price − average price) × total quantity. The percentage is relative to your total invested.",
      },
      {
        question: "Is the stock average calculator free?",
        answer:
          "Yes, completely free with no sign-ups and no limits.",
      },
      {
        question: "How many entries can I add?",
        answer:
          "Up to 20 purchase entries — enough for long averaging campaigns.",
      },
      {
        question: "What is the difference between average price and market price?",
        answer:
          "Average price is what you paid on average; market price is what it's worth now. The gap determines your P&L.",
      },
      {
        question: "Does it work for SIPs or recurring buys?",
        answer:
          "Yes — every installment can be entered as its own row, and the tool computes the blended average.",
      },
      {
        question: "Can I copy or share my position?",
        answer:
          "Yes — copy the summary or share it with one click.",
      },
      {
        question: "Is my data private?",
        answer:
          "Yes — everything runs locally in your browser and nothing is uploaded.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly row inputs.",
      },
    ],
  },

  "salary-calculator": {
    meta: { readTime: "6 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "CTC → take-home",
      "PF & professional tax",
      "Income tax estimate",
      "Monthly & yearly",
      "Free & private",
    ],
    intro: {
      heading: "Salary Calculator — From CTC to Take-Home Pay",
      paragraphs: [
        "The Salary Calculator estimates your take-home pay from your annual CTC (Cost to Company). Enter your CTC, bonus percentage, PF contribution, and professional tax, and instantly see your net yearly salary, net monthly salary, estimated income tax, PF deduction, and total employer cost.",
        "Understand exactly what your offer letter really pays you each month. Results are estimates — actual deductions vary by employer and tax structure — and everything runs privately in your browser.",
      ],
    },
    benefits: [
      {
        title: "Decode Your CTC",
        description: "See how your total CTC splits into tax, PF, and actual take-home.",
      },
      {
        title: "Monthly Clarity",
        description: "Know your net monthly salary for budgeting and EMIs.",
      },
      {
        title: "PF & Tax Included",
        description: "Employee PF (capped per rules) and an income tax estimate are deducted automatically.",
      },
      {
        title: "Free & Private",
        description: "No sign-ups, no uploads — the math happens on your device.",
      },
    ],
    features: [
      {
        title: "Net Salary (Year & Month)",
        description: "The headline take-home figures after all deductions.",
      },
      {
        title: "Income Tax Estimate",
        description: "An estimated annual tax based on your taxable components.",
      },
      {
        title: "PF Contribution",
        description: "Employee PF as a % of basic, capped per statutory rules.",
      },
      {
        title: "Employer Cost",
        description: "Total employer cost including employer PF contribution.",
      },
      {
        title: "Copy, Share & Print",
        description: "Export your salary breakdown in one click.",
      },
    ],
    howTo: {
      heading: "How to Use the Salary Calculator",
      description: "Estimate your take-home in three steps.",
      steps: [
        {
          name: "Enter your CTC",
          text: "Your total annual cost to company (e.g. ₹12,00,000).",
        },
        {
          name: "Set bonus, PF and professional tax",
          text: "Adjust the variable bonus %, PF contribution, and annual professional tax.",
        },
        {
          name: "Review take-home",
          text: "See net monthly and yearly salary, tax, and PF — then copy or share.",
        },
      ],
    },
    faqs: [
      {
        question: "How is take-home salary calculated?",
        answer:
          "Take-home = CTC − income tax − employee PF − professional tax − other deductions. This calculator models the main components.",
      },
      {
        question: "What is CTC?",
        answer:
          "Cost to Company — the total annual cost your employer bears, including salary, bonus, PF, gratuity, and benefits.",
      },
      {
        question: "What is the PF contribution rate?",
        answer:
          "Both employee and employer typically contribute 12% of basic salary to EPF, with the employer's portion split into PF and EPS.",
      },
      {
        question: "What is professional tax?",
        answer:
          "A small state-level tax on employment income — commonly ₹2,400/year, varying by state.",
      },
      {
        question: "How much is the take-home on ₹12 lakh CTC?",
        answer:
          "With 10% bonus, 12% PF, and ₹2,400 professional tax, take-home is roughly ₹78,000–80,000/month — the calculator shows your exact figure.",
      },
      {
        question: "What is the salary calculation formula?",
        answer:
          "Net Salary = CTC − (Employee PF + Income Tax + Professional Tax + Other Deductions).",
      },
      {
        question: "Does it include gratuity?",
        answer:
          "The current version focuses on the main cash deductions. Gratuity may appear in your payslip separately — verify with HR.",
      },
      {
        question: "Is the salary calculator free?",
        answer:
          "Yes, completely free with no sign-ups and no limits.",
      },
      {
        question: "Are the results official?",
        answer:
          "No — they're estimates. Actual deductions vary by employer, state, tax regime, and structure. Check your payslip and confirm with HR.",
      },
      {
        question: "What is employer cost?",
        answer:
          "The full cost to your company — your CTC plus the employer's PF contribution.",
      },
      {
        question: "Can I copy or share my breakdown?",
        answer:
          "Yes — copy the summary, share it, or print a report from the toolbar.",
      },
      {
        question: "Is my salary data private?",
        answer:
          "Yes — everything runs locally in your browser and nothing is uploaded.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly controls.",
      },
      {
        question: "Can I compare offers?",
        answer:
          "Yes — run two offers through the calculator and compare the net monthly figures side by side.",
      },
      {
        question: "What is the difference between gross and net salary?",
        answer:
          "Gross is your pay before deductions; net is what actually lands in your bank account after tax, PF, and other deductions.",
      },
    ],
  },

  "inflation-calculator": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Future value",
      "Present purchasing power",
      "Power lost",
      "Time impact",
      "Free & private",
    ],
    intro: {
      heading: "Inflation Calculator — See How Inflation Erodes Your Money",
      paragraphs: [
        "The Inflation Calculator shows how much today's money will be worth in the future — and how much purchasing power you lose to inflation. Enter an amount, an inflation rate, and a time period to see the future value, the present-day purchasing power of that future amount, and the purchasing power lost.",
        "Understanding inflation is essential for saving and investing decisions. This tool makes the erosion visible instantly, right in your browser.",
      ],
    },
    benefits: [
      {
        title: "See the Erosion",
        description: "Understand exactly how inflation shrinks the real value of your savings.",
      },
      {
        title: "Future vs Present",
        description: "Compare what an amount will be worth later vs what it buys today.",
      },
      {
        title: "Plan for Goals",
        description: "Price future goals in today's rupees so you save enough for them.",
      },
      {
        title: "Free & Private",
        description: "No sign-ups, no uploads — the math happens on your device.",
      },
    ],
    features: [
      {
        title: "Future Value",
        description: "The nominal amount needed in the future to match today's purchasing power.",
      },
      {
        title: "Present Purchasing Power",
        description: "What a future sum is actually worth in today's rupees.",
      },
      {
        title: "Power Lost",
        description: "The exact purchasing power inflation takes away over the period.",
      },
      {
        title: "Instant Updates",
        description: "Adjust amount, rate, or years and every result updates immediately.",
      },
      {
        title: "Copy & Share",
        description: "Copy the result or share it with one click.",
      },
    ],
    howTo: {
      heading: "How to Use the Inflation Calculator",
      description: "Measure inflation's impact in three steps.",
      steps: [
        {
          name: "Enter the amount",
          text: "The money you're measuring — say ₹1,00,000 today.",
        },
        {
          name: "Set inflation and years",
          text: "Choose an inflation rate (5–7% is common in India) and the time period.",
        },
        {
          name: "Read the impact",
          text: "See the future value, present purchasing power, and power lost.",
        },
      ],
    },
    faqs: [
      {
        question: "How does an inflation calculator work?",
        answer:
          "It compounds the inflation rate over the period: future value = amount × (1 + rate)^years, and purchasing power = future value ÷ (1 + rate)^years.",
      },
      {
        question: "What is the current inflation rate in India?",
        answer:
          "India's retail (CPI) inflation has generally ranged between 4% and 7% in recent years. Use 6% as a conservative planning assumption.",
      },
      {
        question: "What is purchasing power?",
        answer:
          "The amount of goods and services money can buy. Inflation reduces purchasing power over time.",
      },
      {
        question: "How much will ₹1 lakh be worth in 10 years?",
        answer:
          "At 6% inflation, ₹1,00,000 today will need about ₹1,79,084 in 10 years to buy the same things — and a future ₹1,00,000 will only buy ₹55,839 of today's goods.",
      },
      {
        question: "What is the inflation formula?",
        answer:
          "Future Value = Present × (1 + inflation rate)^years. Purchasing Power = Future ÷ (1 + rate)^years.",
      },
      {
        question: "Why is inflation important for investors?",
        answer:
          "Your investments must outpace inflation to preserve purchasing power — returns below inflation mean you're losing real wealth.",
      },
      {
        question: "Is the inflation calculator free?",
        answer:
          "Yes, completely free with no sign-ups and no limits.",
      },
      {
        question: "Does it adjust for different inflation rates?",
        answer:
          "Yes — the rate slider covers 1% to 20%, so you can stress-test low and high inflation scenarios.",
      },
      {
        question: "What is the difference between future value and purchasing power?",
        answer:
          "Future value is the nominal rupees needed later; purchasing power is what future rupees are worth in today's money.",
      },
      {
        question: "Can I plan a financial goal with it?",
        answer:
          "Yes — price your goal (like a ₹50 lakh retirement plan) in today's rupees to see what you'll actually need later.",
      },
      {
        question: "Are the results exact predictions?",
        answer:
          "No — inflation varies year to year. Results are projections based on your assumed rate.",
      },
      {
        question: "Can I copy or share my result?",
        answer:
          "Yes — copy the summary or share it with one click.",
      },
      {
        question: "Is my data private?",
        answer:
          "Yes — everything runs locally in your browser and nothing is uploaded.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly controls.",
      },
      {
        question: "How does inflation affect SIP returns?",
        answer:
          "Real returns = nominal returns − inflation. The SIP calculator includes an inflation adjustment for this exact reason.",
      },
    ],
  },
};
