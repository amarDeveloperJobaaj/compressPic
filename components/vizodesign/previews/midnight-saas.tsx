"use client";

import { cn } from "@/lib/utils";

export default function MidnightSaas() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0B1120] font-sans">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r border-white/5 bg-[#0f172a]">
        <div className="flex items-center gap-2 border-b border-white/5 px-5 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500">
            <span className="text-xs font-bold text-white">M</span>
          </div>
          <span className="text-sm font-semibold text-white">Meridian</span>
        </div>
        <nav className="flex-1 px-3 py-4">
          <div className="mb-4">
            <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Main</div>
            {[
              { label: "Dashboard", icon: "⊞", active: true },
              { label: "Analytics", icon: "◐" },
              { label: "Revenue", icon: "◉" },
              { label: "Users", icon: "◎" },
            ].map((item) => (
              <span
                key={item.label}
                className={cn(
                  "mb-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  item.active
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
          <div>
            <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">System</div>
            {["Settings", "Integrations", "Billing"].map((label) => (
              <span
                key={label}
                className="mb-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span className="text-xs opacity-50">○</span>
                {label}
              </span>
            ))}
          </div>
        </nav>
        <div className="border-t border-white/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-bold text-white">
              JD
            </div>
            <div>
              <div className="text-xs font-medium text-white">Jane Doe</div>
              <div className="text-[10px] text-slate-500">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-white/5 bg-[#0f172a]/50 px-6 py-3 backdrop-blur-sm">
          <h1 className="text-sm font-semibold text-white">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5">
              <span className="text-xs text-slate-400">⌘</span>
              <span className="text-xs text-slate-500">Search...</span>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-xs text-slate-400 transition-colors hover:bg-white/10">
              🔔
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Greeting */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Good morning, Jane</h2>
            <p className="mt-0.5 text-sm text-slate-400">Here&apos;s what&apos;s happening with your projects today.</p>
          </div>

          {/* Metric cards */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: "$48,290", change: "+12.5%", up: true },
              { label: "Active Users", value: "2,847", change: "+8.1%", up: true },
              { label: "Conversion Rate", value: "3.24%", change: "-0.4%", up: false },
              { label: "Avg Session", value: "4m 32s", change: "+18s", up: true },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-white/5 bg-[#0f172a] p-4 transition-colors hover:border-white/10"
              >
                <div className="mb-1 text-[11px] font-medium text-slate-400">{metric.label}</div>
                <div className="text-xl font-bold text-white">{metric.value}</div>
                <div className={cn("mt-1 text-[11px] font-medium", metric.up ? "text-emerald-400" : "text-red-400")}>
                  {metric.change}
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-xl border border-white/5 bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
              <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
              <span className="text-[10px] text-blue-400">View all →</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-2.5 font-medium">Customer</th>
                  <th className="px-5 py-2.5 font-medium">Plan</th>
                  <th className="px-5 py-2.5 font-medium">Amount</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Acme Corp", plan: "Enterprise", amount: "$2,400", status: "Paid" },
                  { name: "Globex Inc", plan: "Pro", amount: "$960", status: "Paid" },
                  { name: "Initech", plan: "Starter", amount: "$240", status: "Pending" },
                  { name: "Hooli", plan: "Enterprise", amount: "$3,600", status: "Paid" },
                  { name: "Pied Piper", plan: "Pro", amount: "$960", status: "Paid" },
                ].map((row) => (
                  <tr key={row.name} className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-2.5 font-medium text-white">{row.name}</td>
                    <td className="px-5 py-2.5 text-slate-400">{row.plan}</td>
                    <td className="px-5 py-2.5 text-slate-300">{row.amount}</td>
                    <td className="px-5 py-2.5">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                        row.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      )}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
