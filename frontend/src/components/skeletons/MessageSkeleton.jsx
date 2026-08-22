const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        {skeletonMessages.map((_, idx) => {
          const isSent = idx % 2 === 1;
          return (
            <div key={idx} className={`flex items-end gap-2.5 ${isSent ? "justify-end" : "justify-start"}`}>
              {!isSent && <div className="skeleton size-8 shrink-0 rounded-full" />}
              <div className="flex flex-col gap-2">
                <div
                  className={`skeleton h-12 w-52 rounded-2xl sm:w-60 ${
                    isSent ? "rounded-br-md" : "rounded-bl-md"
                  }`}
                />
                <div className={`skeleton h-2.5 w-14 rounded-full ${isSent ? "self-end" : ""}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageSkeleton;
