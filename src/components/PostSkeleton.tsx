export default function PostSkeleton() {
  return (
    <div className="card-elevated overflow-hidden animate-pulse">
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full skeleton" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-28 skeleton" />
            <div className="h-2.5 w-20 skeleton" />
          </div>
        </div>
      </div>
      <div className="px-5 pt-3 pb-4 space-y-2">
        <div className="h-3 w-full skeleton" />
        <div className="h-3 w-4/5 skeleton" />
        <div className="h-3 w-3/5 skeleton" />
      </div>
      <div className="px-5 py-3 border-t border-border flex gap-6">
        <div className="h-7 w-14 skeleton rounded-full" />
        <div className="h-7 w-14 skeleton rounded-full" />
      </div>
    </div>
  );
}
