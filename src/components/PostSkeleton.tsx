export default function PostSkeleton() {
  return (
    <div className="card-glass overflow-hidden rounded-2xl">
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full skeleton" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-28 skeleton rounded-lg" />
            <div className="h-2.5 w-20 skeleton rounded-lg" />
          </div>
        </div>
      </div>
      <div className="px-5 pt-3 pb-4 space-y-2.5">
        <div className="h-3 w-full skeleton rounded-lg" />
        <div className="h-3 w-4/5 skeleton rounded-lg" />
        <div className="h-3 w-3/5 skeleton rounded-lg" />
      </div>
      <div className="px-5 py-3 border-t border-border/30 flex gap-4">
        <div className="h-8 w-16 skeleton rounded-xl" />
        <div className="h-8 w-16 skeleton rounded-xl" />
        <div className="h-8 w-8 skeleton rounded-xl ml-auto" />
      </div>
    </div>
  );
}
