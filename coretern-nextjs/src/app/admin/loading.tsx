export default function AdminLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 w-48 bg-[var(--surface-1)] rounded-xl mb-2" />
                    <div className="h-4 w-32 bg-[var(--surface-1)] rounded-lg" />
                </div>
                <div className="h-10 w-28 bg-[var(--surface-1)] rounded-xl" />
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-[var(--border)]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-[var(--surface-1)] rounded-xl" />
                            <div className="w-4 h-4 bg-[var(--surface-1)] rounded" />
                        </div>
                        <div className="h-8 w-16 bg-[var(--surface-1)] rounded-lg mb-2" />
                        <div className="h-4 w-24 bg-[var(--surface-1)] rounded" />
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border)]">
                    <div className="h-6 w-48 bg-[var(--surface-1)] rounded-lg" />
                </div>
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4 items-center py-3">
                            <div className="h-4 w-32 bg-[var(--surface-1)] rounded" />
                            <div className="h-4 w-40 bg-[var(--surface-1)] rounded" />
                            <div className="h-6 w-16 bg-[var(--surface-1)] rounded-full" />
                            <div className="h-6 w-20 bg-[var(--surface-1)] rounded-full" />
                            <div className="h-4 w-24 bg-[var(--surface-1)] rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
