import type { ToolSeoContent } from "./seo-content";

/**
 * Finance Tools SEO content — part 1 (7 calculators).
 * Kept server-safe (no React imports) so layouts/metadata can consume it.
 * Every calculator has unique, hand-written content per page.
 */
export const FINANCE_TOOL_SEO_CONTENT: Record<string, ToolSeoContent> = {
  "sip-calculator": {
    meta: { readTime: "6 min read", updated: "August 2026", author: "Vizo Tool" },
    highlights: [
      "Step-up SIP",
      "Inflation-adjusted",
      "Year-wise table",
      "Monthly projection",
      "Free & private",
    ],
    intro: {
      heading: "SIP Calculator — Estimate Your Monthly Investment Growth",
      paragraphs: [
        "The SIP (Systematic Investment Plan) Calculator estimates how much your monthly mutual fund investments could grow to over time. Enter your monthly investment, expected annual return, and duration, and the calculator projects your future value — including optional annual step-up growth and inflation-adjusted purchasing power.",
        "Everything runs instantly in your browser. No sign-up, no uploads, and no data leaves your device, so you can experiment freely with different amounts and return assumptions to plan your investment journey.",
      ],
    },
    benefits: [
      {
        title: "Plan Your Wealth Goal",
        description: "See whether a ₹10,000 monthly SIP can realistically fund a ₹1 crore goal — and adjust instantly.",
      },
      {
        title: "Step-Up SIP Support",
        description: "Model an annual 10% increase in your SIP to reflect salary hikes and rising income over time.",
      },
      {
        title: "Inflation-Aware",
        description: "See the real, inflation-adjusted value of your corpus so your future spending power isn't a surprise.",
      },
      {
        title: "Year-by-Year Breakdown",
        description: "A detailed table shows investment, returns, and corpus growth for every single year.",
      },
    ],
    features: [
      {
        title: "Live Calculation",
        description: "Every slider move recomputes your future value, total invested, profit, and real value instantly.",
      },
      {
        title: "Annual Step-Up",
        description: "Increase your monthly investment by a fixed percentage each year to model disciplined escalation.",
      },
      {
        title: "Inflation Adjustment",
        description: "Deflate the future corpus back to today's rupees so you can compare goals fairly.",
      },
      {
        title: "Year-wise Table",
        description: "Scroll through a full yearly breakdown of invested amount, growth, and corpus.",
      },
      {
        title: "Copy, Share & Print",
        description: "Copy a summary, share it, or export a print-ready report of your calculation.",
      },
    ],
    howTo: {
      heading: "How to Use the SIP Calculator",
      description: "Plan your monthly investment journey in three quick steps.",
      steps: [
        {
          name: "Enter your monthly investment",
          text: "Type or slide the monthly amount you plan to invest (e.g. ₹10,000).",
        },
        {
          name: "Set return and duration",
          text: "Choose your expected annual return and the number of years, plus optional step-up and inflation.",
        },
        {
          name: "Review the projection",
          text: "Check your future value, total invested, and the year-wise table, then copy or print the result.",
        },
      ],
    },
    faqs: [
      {
        question: "How does a SIP calculator work?",
        answer:
          "It compounds your monthly investment at the expected annual return using the standard SIP future-value formula, converting the annual rate to a monthly rate and applying it to each contribution.",
      },
      {
        question: "What is a good expected return for SIP?",
        answer:
          "Historically, equity mutual funds have returned 10–14% annually over long periods. Use 12% as a moderate assumption and try 10% and 15% to see a range.",
      },
      {
        question: "What is a step-up SIP?",
        answer:
          "A step-up SIP increases your monthly investment by a fixed percentage every year — e.g. 10% — so your contributions grow with your income and build a larger corpus.",
      },
      {
        question: "Is the SIP calculator free?",
        answer:
          "Yes, it's completely free with no sign-ups, no limits, and no watermarks. Everything runs privately in your browser.",
      },
      {
        question: "Does the calculator include inflation?",
        answer:
          "Yes — you can enter an inflation rate to see the corpus expressed in today's purchasing power, so you know what the future amount is really worth.",
      },
      {
        question: "What is the formula for SIP returns?",
        answer:
          "FV = P × [((1 + i)^n − 1) / i] × (1 + i), where P is the monthly investment, i is the monthly rate (annual ÷ 12), and n is the total number of months.",
      },
      {
        question: "Can I calculate the future value for 20 or 30 years?",
        answer:
          "Yes, the duration slider goes up to 40 years, with a full year-wise table for any tenure you choose.",
      },
      {
        question: "How much should I invest monthly for ₹1 crore?",
        answer:
          "At a 12% return, roughly ₹4,300/month for 25 years or ₹10,000/month for about 15 years. Use the calculator to find the exact number for your goal.",
      },
      {
        question: "Are SIP returns guaranteed?",
        answer:
          "No. Mutual fund returns depend on market performance and are never guaranteed. The calculator shows estimates based on the return you assume.",
      },
      {
        question: "Does the tool show a yearly breakdown?",
        answer:
          "Yes, a year-wise table lists invested amount, returns, and corpus at the end of every year for the full duration.",
      },
      {
        question: "Can I model an increase in my SIP every year?",
        answer:
          "Absolutely — set an annual step-up percentage and the calculator escalates your monthly investment each year automatically.",
      },
      {
        question: "Is my data sent to a server?",
        answer:
          "No. All calculations run locally in your browser, so your financial inputs never leave your device.",
      },
      {
        question: "What is the difference between SIP and lump sum?",
        answer:
          "SIP invests fixed amounts monthly, averaging your purchase price over time, while lump sum invests everything at once. Both are supported by different calculators on this site.",
      },
      {
        question: "How accurate is the inflation-adjusted value?",
        answer:
          "It applies your chosen inflation rate to deflate the nominal corpus into today's rupees — a useful planning estimate, not a precise prediction of future prices.",
      },
      {
        question: "Can I download or share my SIP calculation?",
        answer:
          "Yes — copy a clean summary to your clipboard, share it, or print a report with one click.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, the calculator is fully responsive with touch-friendly sliders and works on phones, tablets, and desktops.",
      },
    ],
  },

  "compound-interest-calculator": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "Vizo Tool" },
    highlights: [
      "Any compounding frequency",
      "Interest earned",
      "Growth graph",
      "Year-wise table",
      "Free & private",
    ],
    intro: {
      heading: "Compound Interest Calculator — Watch Your Money Multiply",
      paragraphs: [
        "The Compound Interest Calculator shows exactly how your principal grows when interest earns interest. Enter your principal, annual rate, time period, and compounding frequency — yearly, half-yearly, quarterly, or monthly — and instantly see the maturity value, total interest earned, and a year-by-year growth table.",
        "Compound interest is one of the most powerful forces in personal finance. This tool makes it visible, so you can compare frequencies and tenures and see why starting early matters so much. Everything runs privately in your browser.",
      ],
    },
    benefits: [
      {
        title: "Compare Frequencies",
        description: "See how quarterly vs monthly compounding changes your final amount — the difference adds up.",
      },
      {
        title: "Interest Earned at a Glance",
        description: "Separate the interest from the principal so you know exactly what your money earned.",
      },
      {
        title: "Year-wise Growth",
        description: "Watch the snowball effect with a table of balance and interest for every year.",
      },
      {
        title: "Zero Cost, Zero Uploads",
        description: "Free to use, no sign-up, and every calculation happens locally on your device.",
      },
    ],
    features: [
      {
        title: "Flexible Compounding",
        description: "Choose yearly, half-yearly, quarterly, monthly, or any frequency from 1 to 12 times per year.",
      },
      {
        title: "Growth Graph",
        description: "A clean line chart plots your principal and maturity value over time.",
      },
      {
        title: "Year-wise Table",
        description: "A detailed table shows opening balance, interest, and closing balance each year.",
      },
      {
        title: "Instant Updates",
        description: "Drag any slider and the results, chart, and table update in real time.",
      },
      {
        title: "Export & Share",
        description: "Copy the result summary, share it, or print a report of your calculation.",
      },
    ],
    howTo: {
      heading: "How to Use the Compound Interest Calculator",
      description: "See the power of compounding in three steps.",
      steps: [
        {
          name: "Enter your principal",
          text: "Type or slide the amount you're investing or depositing (e.g. ₹1,00,000).",
        },
        {
          name: "Set rate, tenure and frequency",
          text: "Choose the annual interest rate, number of years, and how often interest compounds.",
        },
        {
          name: "Read the results",
          text: "Review the maturity value, interest earned, growth chart, and year-wise table.",
        },
      ],
    },
    faqs: [
      {
        question: "How is compound interest calculated?",
        answer:
          "A = P × (1 + r/n)^(n×t), where P is principal, r is the annual rate, n is compounding periods per year, and t is years.",
      },
      {
        question: "What does compounding frequency mean?",
        answer:
          "It's how often interest is added to your balance — yearly, half-yearly, quarterly, monthly. More frequent compounding earns slightly more interest.",
      },
      {
        question: "Is monthly or quarterly compounding better?",
        answer:
          "Monthly compounding earns marginally more than quarterly because interest is added to the balance 12 times a year instead of 4.",
      },
      {
        question: "What is the rule of 72?",
        answer:
          "Divide 72 by your annual rate to estimate how many years it takes to double your money — e.g. 72 ÷ 8% ≈ 9 years.",
      },
      {
        question: "Does the calculator show the interest earned separately?",
        answer:
          "Yes — the Interest Earned card shows your total return, separate from the principal, and the maturity card shows the final amount.",
      },
      {
        question: "What is the formula for compound interest?",
        answer:
          "A = P(1 + r/n)^(nt) is the standard formula; the calculator also shows it in the 'How this is calculated' panel.",
      },
      {
        question: "Can I use it for FD, savings, or loans?",
        answer:
          "Yes — the same formula powers fixed deposits and investments. For loans, use the dedicated EMI calculator instead.",
      },
      {
        question: "How much will ₹1 lakh grow in 10 years at 8%?",
        answer:
          "At 8% compounded annually, ₹1,00,000 grows to about ₹2,15,892 in 10 years — nearly ₹1.16 lakh of pure interest.",
      },
      {
        question: "Is compound interest better than simple interest?",
        answer:
          "Yes — compounding earns interest on interest, producing a higher return over time. The growth chart makes the difference visible.",
      },
      {
        question: "Does this calculator support long tenures?",
        answer:
          "Yes, the time slider goes up to 40 years with a complete year-wise breakdown.",
      },
      {
        question: "Are results guaranteed returns?",
        answer:
          "No — the tool projects mathematical growth at the rate you enter. Actual investment returns vary with markets and products.",
      },
      {
        question: "Can I copy or share my calculation?",
        answer:
          "Yes — copy a summary, share it, or print a report directly from the results toolbar.",
      },
      {
        question: "Is my data private?",
        answer:
          "Completely. All math runs in your browser and nothing is uploaded or stored.",
      },
      {
        question: "Why does more frequent compounding earn more?",
        answer:
          "Interest starts earning its own interest sooner, so the balance grows slightly faster the more often it's compounded.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes — the calculator is fully responsive with sliders designed for touch screens.",
      },
      {
        question: "Can I compare different rates side by side?",
        answer:
          "Use the sliders to check different scenarios quickly — the results update instantly each time you change a value.",
      },
    ],
  },

  "emi-calculator": {
    meta: { readTime: "6 min read", updated: "August 2026", author: "Vizo Tool" },
    highlights: [
      "Monthly EMI",
      "Full amortization table",
      "Processing fee",
      "Interest vs principal",
      "Free & private",
    ],
    intro: {
      heading: "EMI Calculator — Know Your Monthly Loan Payment",
      paragraphs: [
        "The EMI Calculator computes your monthly loan installment from the loan amount, interest rate, and tenure — plus the total interest you'll pay and a complete amortization schedule for the entire loan. Add a processing fee to see the true upfront cost of borrowing.",
        "Whether you're planning a home, car, or personal loan, knowing your EMI before you borrow helps you choose a loan you can comfortably afford. All calculations run privately in your browser.",
      ],
    },
    benefits: [
      {
        title: "Know Your Exact EMI",
        description: "Instantly see the fixed monthly payment for any loan amount, rate, and tenure.",
      },
      {
        title: "Full Amortization Schedule",
        description: "Follow every payment: how much goes to interest vs principal each month, until the loan ends.",
      },
      {
        title: "Processing Fee Included",
        description: "Add the lender's processing fee percentage to see its real impact on your borrowing cost.",
      },
      {
        title: "Free & Private",
        description: "No sign-up, no uploads — the calculation runs entirely in your browser.",
      },
    ],
    features: [
      {
        title: "Instant EMI",
        description: "The monthly EMI is calculated live as you adjust amount, rate, and tenure.",
      },
      {
        title: "Amortization Table",
        description: "A scrollable month-by-month table of EMI, interest, principal, and outstanding balance.",
      },
      {
        title: "Interest & Principal Split",
        description: "Charts show how the interest vs principal split shifts over the life of the loan.",
      },
      {
        title: "Processing Fee",
        description: "Optional fee percentage is factored into your total cost of the loan.",
      },
      {
        title: "Copy, Share & Print",
        description: "Export a summary, share it, or print a report of your loan plan.",
      },
    ],
    howTo: {
      heading: "How to Use the EMI Calculator",
      description: "Plan any loan in three simple steps.",
      steps: [
        {
          name: "Enter loan details",
          text: "Type or slide the loan amount, interest rate, and tenure in years.",
        },
        {
          name: "Add a processing fee (optional)",
          text: "If your lender charges one, enter the fee percentage to include it in the total cost.",
        },
        {
          name: "Review the payment plan",
          text: "Check your monthly EMI, total interest, and the full amortization schedule.",
        },
      ],
    },
    faqs: [
      {
        question: "How is EMI calculated?",
        answer:
          "EMI = P × r × (1 + r)^n / ((1 + r)^n − 1), where P is the loan amount, r the monthly interest rate, and n the number of monthly payments.",
      },
      {
        question: "What is an amortization schedule?",
        answer:
          "A table showing each monthly payment split into interest and principal, with the outstanding balance reducing until the loan is fully repaid.",
      },
      {
        question: "What is a good EMI-to-income ratio?",
        answer:
          "Most lenders cap EMIs at 40–50% of your monthly income. A lower ratio leaves more room for savings and emergencies.",
      },
      {
        question: "Does a longer tenure mean less EMI?",
        answer:
          "Yes, the EMI falls as tenure rises — but total interest paid increases, so a shorter tenure usually costs less overall.",
      },
      {
        question: "How much interest will I pay on a ₹20 lakh loan?",
        answer:
          "A ₹20,00,000 loan at 8.5% for 20 years costs about ₹20.8 lakh in interest — the calculator shows your exact figure.",
      },
      {
        question: "What is the processing fee?",
        answer:
          "A one-time fee charged by the lender, usually 0.5–1% of the loan amount, added to your total cost of borrowing.",
      },
      {
        question: "What is the formula for EMI?",
        answer:
          "EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), with r = annual rate ÷ 12 and n = tenure in months.",
      },
      {
        question: "Can I prepay my loan with this calculator?",
        answer:
          "The current tool models the standard monthly EMI schedule. Prepayment modeling is a great next step — check the other calculators for related tools.",
      },
      {
        question: "Is the EMI calculator free?",
        answer:
          "Yes, completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "How accurate is the result?",
        answer:
          "The math is exact for the inputs you provide. Actual payments may differ slightly due to lender rounding, fees, and interest calculation methods.",
      },
      {
        question: "Can I use it for home, car, and personal loans?",
        answer:
          "Yes — the same EMI formula applies to all loans. Just enter your amount, rate, and tenure.",
      },
      {
        question: "What happens to the interest-to-principal ratio over time?",
        answer:
          "Early payments are mostly interest; later payments are mostly principal. The charts show this split changing month by month.",
      },
      {
        question: "Does the calculator work in INR?",
        answer:
          "Yes, amounts are formatted in Indian rupees (₹) with lakh/crore-style Indian number formatting.",
      },
      {
        question: "Can I copy or share my EMI plan?",
        answer:
          "Yes — copy a clean summary, share it, or print a report from the results toolbar.",
      },
      {
        question: "Is my loan data uploaded anywhere?",
        answer:
          "No. Everything is calculated locally in your browser and nothing is stored.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly sliders for phones, tablets, and desktops.",
      },
    ],
  },

  "gst-calculator": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "Vizo Tool" },
    highlights: [
      "Add or remove GST",
      "CGST / SGST / IGST split",
      "All GST slabs",
      "Invoice preview",
      "Free & private",
    ],
    intro: {
      heading: "GST Calculator — Add or Remove GST in Seconds",
      paragraphs: [
        "The GST Calculator makes Goods and Services Tax simple. Choose whether you're adding GST to a price or removing GST from an inclusive amount, pick any rate from 0.25% to 28%, and instantly see the GST amount split into CGST and SGST — or IGST for inter-state transactions.",
        "Perfect for freelancers, small businesses, and shopkeepers preparing invoices or checking supplier quotes. It runs entirely in your browser, so no financial data ever leaves your device.",
      ],
    },
    benefits: [
      {
        title: "Add or Remove GST",
        description: "Switch between adding tax to a base price and extracting tax from an inclusive amount.",
      },
      {
        title: "CGST / SGST / IGST Split",
        description: "See the full intra-state split (half CGST, half SGST) or inter-state IGST automatically.",
      },
      {
        title: "All Standard Slabs",
        description: "0.25%, 3%, 5%, 12%, 18%, and 28% — every slab used in India's GST system.",
      },
      {
        title: "Invoice-Ready Results",
        description: "Copy the tax breakdown straight into your invoices or quotes.",
      },
    ],
    features: [
      {
        title: "Dual Modes",
        description: "Add GST to a net price or remove GST from a gross price with a single toggle.",
      },
      {
        title: "Tax Split Cards",
        description: "Dedicated cards show GST amount, CGST, SGST, and the net or total value.",
      },
      {
        title: "All Slabs",
        description: "A rate slider covers every standard slab including 0.25%, 3%, 5%, 12%, 18%, and 28%.",
      },
      {
        title: "Copy Results",
        description: "Copy the full breakdown as a neat summary for invoices or records.",
      },
      {
        title: "Private by Design",
        description: "All math happens locally — no account, no uploads, no tracking.",
      },
    ],
    howTo: {
      heading: "How to Use the GST Calculator",
      description: "Work out GST in three quick steps.",
      steps: [
        {
          name: "Enter the amount",
          text: "Type or slide the base price (to add GST) or the inclusive price (to remove GST).",
        },
        {
          name: "Choose the GST rate",
          text: "Pick the applicable slab — 0.25% to 28% — and set the mode to add or remove.",
        },
        {
          name: "Read the breakdown",
          text: "See the GST amount, CGST, SGST, and final net or total value, then copy it.",
        },
      ],
    },
    faqs: [
      {
        question: "How do I calculate GST?",
        answer:
          "To add GST: net × (1 + rate/100). To remove it: gross ÷ (1 + rate/100). The calculator does both instantly.",
      },
      {
        question: "What is CGST and SGST?",
        answer:
          "For intra-state sales, GST is split equally — half as CGST (Central) and half as SGST (State). Inter-state sales attract full IGST instead.",
      },
      {
        question: "What is IGST?",
        answer:
          "Integrated GST — the full tax collected on inter-state supplies. This calculator models the common intra-state case with a CGST/SGST split; for inter-state invoices, IGST is simply the full GST amount charged instead.",
      },
      {
        question: "What are the GST slabs in India?",
        answer:
          "The main slabs are 0%, 0.25%, 3%, 5%, 12%, 18%, and 28%, depending on the goods or service.",
      },
      {
        question: "How do I remove GST from an inclusive price?",
        answer:
          "Switch the mode to 'Remove GST' and enter the total you paid — the calculator extracts the tax and shows the base price.",
      },
      {
        question: "What is the formula for adding GST?",
        answer:
          "Gross = Net × (1 + rate/100). For example, ₹10,000 at 18% GST becomes ₹11,800.",
      },
      {
        question: "What is the formula for removing GST?",
        answer:
          "Net = Gross ÷ (1 + rate/100). For example, ₹11,800 inclusive of 18% has a base of ₹10,000.",
      },
      {
        question: "Is the GST calculator free?",
        answer:
          "Yes, completely free with no sign-ups, no watermarks, and no limits.",
      },
      {
        question: "Who should use this calculator?",
        answer:
          "Freelancers, small business owners, retailers, and accountants preparing invoices, quotes, or GST returns.",
      },
      {
        question: "Does it handle 28% slab and lower slabs?",
        answer:
          "Yes — the rate slider covers every standard slab from 0.25% up to 28%, including decimals if needed.",
      },
      {
        question: "Can I copy the results for an invoice?",
        answer:
          "Yes — one click copies the amount, GST, CGST, SGST, and total in a clean, invoice-friendly format.",
      },
      {
        question: "Is GST the same in every country?",
        answer:
          "No — GST/VAT rates differ by country. This calculator follows India's GST structure with CGST/SGST/IGST splitting.",
      },
      {
        question: "Are my amounts stored anywhere?",
        answer:
          "No. Everything is computed locally in your browser and never uploaded or saved.",
      },
      {
        question: "What is the difference between GST inclusive and exclusive?",
        answer:
          "Inclusive means the price already contains tax; exclusive means tax is added on top. The mode toggle handles both.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly controls for all devices.",
      },
    ],
  },

  "fd-calculator": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "Vizo Tool" },
    highlights: [
      "Quarterly compounding",
      "Maturity amount",
      "Interest earned",
      "Growth chart",
      "Free & private",
    ],
    intro: {
      heading: "Fixed Deposit Calculator — Plan Your FD Maturity",
      paragraphs: [
        "The Fixed Deposit (FD) Calculator tells you exactly how much your deposit will be worth at maturity. Enter the deposit amount, interest rate, tenure, and compounding frequency — most Indian banks compound quarterly — and instantly see your maturity amount and total interest earned.",
        "Use it to compare banks, tenures, and compounding policies before locking in your money, or to check what an existing FD will be worth. Everything runs privately in your browser.",
      ],
    },
    benefits: [
      {
        title: "Compare FD Options",
        description: "Quickly compare rates and tenures across banks to find the best return on your deposit.",
      },
      {
        title: "Quarterly Compounding",
        description: "Model the standard Indian bank practice of quarterly compounding — or any other frequency.",
      },
      {
        title: "Interest Earned Clarity",
        description: "See your interest separate from principal so you know exactly what the deposit earns.",
      },
      {
        title: "Free & Private",
        description: "No sign-ups, no uploads — your deposit math stays on your device.",
      },
    ],
    features: [
      {
        title: "Maturity Amount",
        description: "The headline number — what your deposit grows to at the end of the tenure.",
      },
      {
        title: "Flexible Compounding",
        description: "Yearly, half-yearly, quarterly, monthly, or any frequency from 1 to 12 times a year.",
      },
      {
        title: "Growth Chart",
        description: "A line chart shows your deposit value climbing over the full tenure.",
      },
      {
        title: "Instant Updates",
        description: "Adjust amount, rate, or tenure and every result updates immediately.",
      },
      {
        title: "Copy, Share & Print",
        description: "Copy the summary, share it, or print a report of your FD plan.",
      },
    ],
    howTo: {
      heading: "How to Use the FD Calculator",
      description: "Project your fixed deposit in three steps.",
      steps: [
        {
          name: "Enter the deposit amount",
          text: "Type or slide the amount you plan to deposit (e.g. ₹5,00,000).",
        },
        {
          name: "Set rate, tenure and compounding",
          text: "Choose the interest rate, years, and how often the bank compounds interest (quarterly is the norm).",
        },
        {
          name: "Check the maturity value",
          text: "Review your maturity amount, total interest, and growth chart.",
        },
      ],
    },
    faqs: [
      {
        question: "How is FD interest calculated?",
        answer:
          "Banks compound interest quarterly: A = P × (1 + r/4)^(4×t). The calculator applies your chosen frequency automatically.",
      },
      {
        question: "What is the current FD interest rate?",
        answer:
          "Rates vary by bank and tenure — generally 5.5% to 7.5% for most tenures. Use the slider to test your bank's rate.",
      },
      {
        question: "How often do Indian banks compound FD interest?",
        answer:
          "Most banks compound quarterly. Senior citizens often receive a 0.25–0.5% higher rate.",
      },
      {
        question: "What is the maturity amount?",
        answer:
          "The total you receive at the end of the tenure — your deposit plus all the interest earned on it.",
      },
      {
        question: "How much will ₹5 lakh FD earn in 5 years?",
        answer:
          "At 7.1% compounded quarterly, ₹5,00,000 grows to about ₹7,11,000 — roughly ₹2.11 lakh of interest.",
      },
      {
        question: "Is FD interest taxable?",
        answer:
          "Yes — FD interest is taxed at your income tax slab rate, and TDS is deducted above ₹40,000 (₹50,000 for senior citizens). Use the income tax calculator for details.",
      },
      {
        question: "What is the formula for FD maturity?",
        answer:
          "M = P × (1 + r/n)^(n×t), where n is the compounding frequency per year. The tool shows this in its explanation panel.",
      },
      {
        question: "Can I compare quarterly vs monthly compounding?",
        answer:
          "Yes — change the frequency slider and watch the maturity amount update. Quarterly is standard, monthly earns slightly more.",
      },
      {
        question: "Is FD safer than mutual funds?",
        answer:
          "FDs are generally low-risk with guaranteed (subject to bank) returns, while mutual funds carry market risk but higher long-term potential.",
      },
      {
        question: "Does the calculator support long tenures?",
        answer:
          "Yes — up to 20 years with a growth chart covering the full tenure.",
      },
      {
        question: "Are FD returns guaranteed?",
        answer:
          "Fixed deposits offer assured returns at the contracted rate (bank permitting). The calculator uses the rate you enter.",
      },
      {
        question: "Can I copy or share my FD projection?",
        answer:
          "Yes — copy a clean summary, share it, or print a report from the results toolbar.",
      },
      {
        question: "Is my deposit data private?",
        answer:
          "Completely — everything runs in your browser and nothing is uploaded.",
      },
      {
        question: "What is the difference between FD and RD?",
        answer:
          "An FD is a one-time lump-sum deposit; an RD (recurring deposit) is monthly. This site also has SIP and compound interest tools for similar planning.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly sliders on all devices.",
      },
    ],
  },

  "cagr-calculator": {
    meta: { readTime: "4 min read", updated: "August 2026", author: "Vizo Tool" },
    highlights: [
      "Annualized growth",
      "Total return",
      "Absolute gain",
      "Growth curve",
      "Free & private",
    ],
    intro: {
      heading: "CAGR Calculator — Measure True Annual Growth",
      paragraphs: [
        "The CAGR (Compound Annual Growth Rate) Calculator reveals the smooth annual growth rate of any investment — the number that removes the year-to-year noise and tells you how fast your money really grew. Enter the initial value, final value, and holding period to get your CAGR, total return, and absolute gain.",
        "CAGR is the standard way to compare investments held for different periods. This calculator makes it instant and runs completely in your browser.",
      ],
    },
    benefits: [
      {
        title: "Compare Any Investments",
        description: "Annualized growth lets you fairly compare a 2-year and a 10-year investment side by side.",
      },
      {
        title: "See Total Return Too",
        description: "Get both the annualized CAGR and the simple total return percentage for the full period.",
      },
      {
        title: "Absolute Gain Clarity",
        description: "Know the exact rupee profit behind the percentage.",
      },
      {
        title: "Free & Private",
        description: "No sign-ups, no uploads — everything runs locally in your browser.",
      },
    ],
    features: [
      {
        title: "Instant CAGR",
        description: "Compute the annualized growth rate live as you adjust the three inputs.",
      },
      {
        title: "Total Return",
        description: "The simple overall return over the entire holding period, in percentage.",
      },
      {
        title: "Absolute Gain",
        description: "The rupee profit between your initial and final value.",
      },
      {
        title: "Growth Curve",
        description: "A chart visualizes value climbing at your CAGR over the period.",
      },
      {
        title: "Copy & Share",
        description: "Copy the result, share it, or print a report with one click.",
      },
    ],
    howTo: {
      heading: "How to Use the CAGR Calculator",
      description: "Find the true annual growth of any investment in three steps.",
      steps: [
        {
          name: "Enter initial value",
          text: "The amount you originally invested (e.g. ₹1,00,000).",
        },
        {
          name: "Enter final value and years",
          text: "The current or maturity value and the number of years you held the investment.",
        },
        {
          name: "Read your CAGR",
          text: "See the annualized growth rate, total return, and absolute gain — then copy or share.",
        },
      ],
    },
    faqs: [
      {
        question: "What is CAGR?",
        answer:
          "Compound Annual Growth Rate — the average annual growth rate that would take your initial value to your final value over the period, as if growth were smooth.",
      },
      {
        question: "How is CAGR calculated?",
        answer:
          "CAGR = (Final/Initial)^(1/years) − 1, expressed as a percentage.",
      },
      {
        question: "What is a good CAGR for mutual funds?",
        answer:
          "Equity mutual funds have historically delivered 10–14% CAGR over long periods. A 12% CAGR over 5+ years is generally considered good.",
      },
      {
        question: "What is the formula for CAGR?",
        answer:
          "CAGR = ((Ending Value ÷ Beginning Value)^(1/n)) − 1, where n is the number of years.",
      },
      {
        question: "Why use CAGR instead of total return?",
        answer:
          "CAGR annualizes growth, letting you compare investments held over different timeframes on equal footing.",
      },
      {
        question: "Can CAGR be negative?",
        answer:
          "Yes — if the final value is less than the initial value, CAGR is negative, meaning the investment lost money on average per year.",
      },
      {
        question: "How do I calculate CAGR for 5 years?",
        answer:
          "Enter the initial value, final value, and 5 years — the calculator returns the annualized rate, e.g. ₹1 lakh to ₹2 lakh in 5 years is 14.87%.",
      },
      {
        question: "Is CAGR the same as average annual return?",
        answer:
          "No — simple average ignores compounding; CAGR is the geometric average, which is the correct measure of growth.",
      },
      {
        question: "Does this calculator include SIP contributions?",
        answer:
          "This tool assumes a single lump-sum investment. For monthly SIP growth, use the SIP calculator.",
      },
      {
        question: "What does total return mean?",
        answer:
          "The overall percentage gain across the whole period, without annualizing — e.g. 100% growth over 5 years.",
      },
      {
        question: "Is the CAGR calculator free?",
        answer:
          "Yes, completely free with no sign-ups and no limits.",
      },
      {
        question: "Are the results guaranteed?",
        answer:
          "No — CAGR is a mathematical measure of past or assumed growth. Future returns are never guaranteed.",
      },
      {
        question: "Can I copy or share my result?",
        answer:
          "Yes — copy the summary, share it, or print a report from the toolbar.",
      },
      {
        question: "Is my data private?",
        answer:
          "Yes — all computation happens locally in your browser; nothing is uploaded.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive on phones, tablets, and desktops.",
      },
    ],
  },

  "roi-calculator": {
    meta: { readTime: "4 min read", updated: "August 2026", author: "Vizo Tool" },
    highlights: [
      "Profit in rupees",
      "ROI percentage",
      "Annualized ROI",
      "Profit chart",
      "Free & private",
    ],
    intro: {
      heading: "ROI Calculator — Measure Return on Investment",
      paragraphs: [
        "The ROI Calculator shows how profitable any investment really is. Enter your total investment and final returns, and instantly see your profit, ROI percentage, and annualized ROI — the per-year rate that makes results from different timeframes comparable.",
        "Use it for stocks, business projects, marketing campaigns, or any money you've put to work. Everything runs privately in your browser with no sign-up needed.",
      ],
    },
    benefits: [
      {
        title: "See Profit Clearly",
        description: "The exact rupee profit between what you invested and what you got back.",
      },
      {
        title: "Annualized Comparison",
        description: "Compare returns from investments held over different periods with a per-year rate.",
      },
      {
        title: "Business & Personal Use",
        description: "Evaluate stock trades, business projects, or campaigns with the same simple math.",
      },
      {
        title: "Free & Private",
        description: "No accounts, no uploads — the calculation happens entirely on your device.",
      },
    ],
    features: [
      {
        title: "Instant ROI",
        description: "ROI percentage updates live as you adjust investment and returns.",
      },
      {
        title: "Annualized ROI",
        description: "A per-year rate that smooths the result for easy comparison across timeframes.",
      },
      {
        title: "Profit in Rupees",
        description: "The absolute gain separate from the percentage.",
      },
      {
        title: "Profit Chart",
        description: "A visual chart shows investment vs returns and the profit gap.",
      },
      {
        title: "Copy & Share",
        description: "Copy the result, share it, or print a report in one click.",
      },
    ],
    howTo: {
      heading: "How to Use the ROI Calculator",
      description: "Measure any investment's return in three steps.",
      steps: [
        {
          name: "Enter your investment",
          text: "The total amount of money you put in (e.g. ₹50,000).",
        },
        {
          name: "Enter final returns and years",
          text: "What you received back, and how many years you held the investment.",
        },
        {
          name: "Read your ROI",
          text: "See profit, ROI percentage, and annualized ROI — then copy or share.",
        },
      ],
    },
    faqs: [
      {
        question: "How is ROI calculated?",
        answer:
          "ROI = (Final Returns − Investment) ÷ Investment × 100. Profit is the difference; annualized ROI smooths it per year.",
      },
      {
        question: "What is a good ROI?",
        answer:
          "For investments, an annualized ROI of 10–15% is generally strong. It depends on the asset and the time period — always compare annualized figures.",
      },
      {
        question: "What is the ROI formula?",
        answer:
          "ROI (%) = (Net Profit ÷ Total Investment) × 100.",
      },
      {
        question: "What is annualized ROI?",
        answer:
          "The average per-year return, calculated as ((1 + total ROI)^(1/years) − 1), so you can compare investments held for different lengths.",
      },
      {
        question: "How do I calculate ROI for 3 years?",
        answer:
          "Enter investment, returns, and 3 years. For example, ₹50,000 to ₹75,000 in 3 years is a 50% ROI or about 14.5% annualized.",
      },
      {
        question: "Can ROI be negative?",
        answer:
          "Yes — if your returns are less than your investment, you have a negative ROI, meaning a loss.",
      },
      {
        question: "Does ROI include costs and taxes?",
        answer:
          "It uses the net numbers you enter — include brokerage, fees, and taxes in your 'investment' for a true net ROI.",
      },
      {
        question: "Is ROI the same as CAGR?",
        answer:
          "Not quite — ROI is total return; CAGR is the annualized rate. This tool shows both ROI and annualized ROI, while the CAGR calculator is a dedicated version.",
      },
      {
        question: "Is the ROI calculator free?",
        answer:
          "Yes, completely free with no sign-ups and no limits.",
      },
      {
        question: "Can I use it for business projects?",
        answer:
          "Absolutely — compare a project's cost against its returns the same way you would for stocks.",
      },
      {
        question: "What is the difference between ROI and profit?",
        answer:
          "Profit is the absolute rupee gain; ROI expresses that gain as a percentage of the money invested.",
      },
      {
        question: "Are results guaranteed?",
        answer:
          "No — the tool computes the math of the numbers you enter. Actual investment outcomes vary.",
      },
      {
        question: "Can I copy or share my ROI?",
        answer:
          "Yes — copy the summary, share it, or print a report from the results toolbar.",
      },
      {
        question: "Is my data private?",
        answer:
          "Yes — all math runs in your browser and nothing is uploaded.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes, fully responsive with touch-friendly controls on all devices.",
      },
    ],
  },
};
