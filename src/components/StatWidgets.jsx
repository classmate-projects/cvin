"use client";

const PALETTE = ["#00845a", "#0ea5e9", "#f59e0b", "#a855f7", "#ef4444", "#14b8a6", "#6366f1", "#ec4899"];

export function WidgetCard({ title, icon, action, children, className = "" }) {
    return (
        <div className={`card-glass p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2.5">
                    {icon && <span className="text-[#00845a] dark:text-[#00b37a] text-base">{icon}</span>}
                    {title}
                </h3>
                {action}
            </div>
            {children}
        </div>
    );
}

export function BarListWidget({ title, icon, items = [], emptyLabel = "No data yet" }) {
    const max = Math.max(1, ...items.map((i) => i.count));
    return (
        <WidgetCard title={title} icon={icon}>
            {items.length === 0 ? (
                <EmptyState label={emptyLabel} />
            ) : (
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={item.label} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-600 dark:text-gray-300 truncate pr-2">{item.label}</span>
                                <span className="font-black text-slate-800 dark:text-white shrink-0">{item.count}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${(item.count / max) * 100}%`,
                                        backgroundColor: PALETTE[idx % PALETTE.length],
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </WidgetCard>
    );
}

export function DonutWidget({ title, icon, items = [], emptyLabel = "No data yet" }) {
    const total = items.reduce((sum, i) => sum + i.count, 0);
    let cumulative = 0;
    const segments = items.map((item, idx) => {
        const pct = total > 0 ? (item.count / total) * 100 : 0;
        const start = cumulative;
        cumulative += pct;
        return { ...item, pct, start, end: cumulative, color: PALETTE[idx % PALETTE.length] };
    });

    const gradient = segments.length
        ? `conic-gradient(${segments.map((s) => `${s.color} ${s.start}% ${s.end}%`).join(", ")})`
        : "conic-gradient(#e2e8f0 0% 100%)";

    return (
        <WidgetCard title={title} icon={icon}>
            {total === 0 ? (
                <EmptyState label={emptyLabel} />
            ) : (
                <div className="flex items-center gap-6">
                    <div
                        className="w-24 h-24 rounded-full shrink-0 shadow-inner relative"
                        style={{ background: gradient }}
                    >
                        <div className="absolute inset-[6px] rounded-full bg-white dark:bg-[#151515] flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-slate-800 dark:text-white leading-none">{total}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2.5 min-w-0">
                        {segments.map((s) => (
                            <div key={s.label} className="flex items-center gap-2 text-xs">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                                <span className="font-bold text-slate-600 dark:text-gray-300 truncate flex-1">{s.label}</span>
                                <span className="font-black text-slate-800 dark:text-white shrink-0">{s.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </WidgetCard>
    );
}

export function TrendChartWidget({ title, icon, items = [], emptyLabel = "No activity yet", className = "" }) {
    const max = Math.max(1, ...items.map((i) => i.count));
    const total = items.reduce((sum, i) => sum + i.count, 0);
    return (
        <WidgetCard
            title={title}
            icon={icon}
            className={className}
            action={<span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">{total} this week</span>}
        >
            {total === 0 ? (
                <EmptyState label={emptyLabel} />
            ) : (
                <div className="flex items-end justify-between gap-2 h-32">
                    {items.map((item) => (
                        <div key={item.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                            <span className="text-[10px] font-black text-slate-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.count}
                            </span>
                            <div className="w-full rounded-t-lg rounded-b-sm bg-slate-100 dark:bg-white/5 flex items-end overflow-hidden" style={{ height: "100%" }}>
                                <div
                                    className="w-full bg-gradient-to-t from-[#00845a] to-emerald-400 dark:from-[#00b37a] dark:to-emerald-300 rounded-t-lg transition-all duration-700"
                                    style={{ height: `${(item.count / max) * 100}%`, minHeight: item.count > 0 ? "6px" : "0px" }}
                                ></div>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 dark:text-gray-500 uppercase">{item.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </WidgetCard>
    );
}

export function PipelineWidget({ title, icon, statusCounts = {} }) {
    const order = ["Approved", "Pending", "Rejected"];
    const colors = { Approved: "#00845a", Pending: "#f59e0b", Rejected: "#ef4444" };
    const keys = Object.keys(statusCounts).sort((a, b) => {
        const ai = order.indexOf(a), bi = order.indexOf(b);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    const total = keys.reduce((sum, k) => sum + statusCounts[k], 0);

    return (
        <WidgetCard title={title} icon={icon}>
            {total === 0 ? (
                <EmptyState label="No candidates in the pipeline yet" />
            ) : (
                <div className="space-y-5">
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-white/5">
                        {keys.map((k) => (
                            <div
                                key={k}
                                style={{ width: `${(statusCounts[k] / total) * 100}%`, backgroundColor: colors[k] || "#64748b" }}
                                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-700"
                            ></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {keys.map((k) => (
                            <div key={k} className="text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[k] || "#64748b" }}></span>
                                    <span className="text-[9px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">{k}</span>
                                </div>
                                <span className="text-xl font-black text-slate-800 dark:text-white">{statusCounts[k]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </WidgetCard>
    );
}

function EmptyState({ label }) {
    return (
        <div className="h-24 flex items-center justify-center text-center">
            <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">{label}</p>
        </div>
    );
}
