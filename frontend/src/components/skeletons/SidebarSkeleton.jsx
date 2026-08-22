const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="flex h-full w-full flex-col lg:w-80 xl:w-96">
      {/* Header */}
      <div className="shrink-0 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-24" />
          <div className="flex items-center gap-1.5">
            <div className="skeleton size-8 rounded-full" />
            <div className="skeleton size-8 rounded-full" />
          </div>
        </div>

        {/* Search bar skeleton */}
        <div className="mt-3">
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* Skeleton conversations */}
      <div className="w-full flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="flex w-full items-center gap-3 rounded-xl p-2.5">
            {/* Avatar skeleton */}
            <div className="relative shrink-0">
              <div className="skeleton size-11 rounded-full" />
            </div>

            {/* Info skeleton */}
            <div className="hidden min-w-0 flex-1 flex-col gap-2 sm:flex">
              <div className="skeleton h-3.5 w-3/4 rounded-full" />
              <div className="skeleton h-3 w-1/2 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
