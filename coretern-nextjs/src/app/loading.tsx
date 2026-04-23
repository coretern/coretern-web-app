export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-[var(--border)]" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-[var(--color-primary)] animate-spin" />
                </div>
                <p className="text-[var(--text-muted)] text-sm font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
}
