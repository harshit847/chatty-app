import { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Filter, MessageSquarePlus, Search } from "lucide-react";
import { formatListTime } from "../lib/utils";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    previews,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = useMemo(() => {
    let list = users;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((user) => user.fullName?.toLowerCase().includes(q));
    }
    if (showOnlineOnly) list = list.filter((user) => onlineUsers.includes(user._id));

    // Most recent conversation first; chats without messages sink to the bottom.
    const lastActivity = (user) => {
      const createdAt = previews[user._id]?.createdAt;
      return createdAt ? new Date(createdAt).getTime() : 0;
    };
    return [...list].sort((a, b) => lastActivity(b) - lastActivity(a));
  }, [users, search, showOnlineOnly, onlineUsers, previews]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full lg:w-80 xl:w-96 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold tracking-tight">My Chats</h2>

          <div className="flex items-center gap-1.5">
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className={`btn btn-ghost btn-sm btn-circle ${
                  showOnlineOnly ? "text-primary bg-primary/10" : "text-base-content/60"
                }`}
                aria-label="Filter conversations"
              >
                <Filter className="size-5" />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content z-30 mt-2 w-52 rounded-xl border border-base-300 bg-base-100 p-2 shadow-lg"
              >
                <li>
                  <label className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-base-200">
                    <span>Online only</span>
                    <input
                      type="checkbox"
                      checked={showOnlineOnly}
                      onChange={(e) => setShowOnlineOnly(e.target.checked)}
                      className="toggle toggle-primary toggle-sm"
                    />
                  </label>
                </li>
                <li>
                  <span className="block px-3 py-1.5 text-xs text-base-content/50">
                    {onlineUsers.length - 1} online now
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="btn btn-primary btn-sm btn-circle shadow-sm"
              aria-label="New chat"
              title="New chat"
            >
              <MessageSquarePlus className="size-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <label className="mt-3 flex items-center gap-2 rounded-xl bg-base-200/70 px-3 py-2 transition-colors focus-within:bg-base-200">
          <Search className="size-4 shrink-0 text-base-content/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats"
            className="w-full bg-transparent text-sm outline-none placeholder:text-base-content/40"
          />
        </label>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {filteredUsers.map((user) => {
          const isActive = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);
          const preview = previews[user._id];

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`relative mb-0.5 flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors duration-150 ${
                isActive ? "bg-primary/10" : "hover:bg-base-200/80"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}

              <div className="relative shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className={`size-11 rounded-full object-cover ring-1 transition-colors ${
                    isActive ? "ring-primary" : "ring-base-300"
                  }`}
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-base-100" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`truncate text-sm ${
                      isActive ? "font-bold text-primary" : "font-semibold"
                    }`}
                  >
                    {user.fullName}
                  </span>
                  {preview?.createdAt && (
                    <span
                      className={`shrink-0 text-[11px] tabular-nums ${
                        isActive ? "font-medium text-primary" : "text-base-content/40"
                      }`}
                    >
                      {formatListTime(preview.createdAt)}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-0.5 truncate text-xs ${
                    preview
                      ? isActive
                        ? "text-primary/75"
                        : "text-base-content/50"
                      : isOnline
                        ? "flex items-center gap-1.5 text-success"
                        : "text-base-content/40"
                  }`}
                >
                  {!preview ? (
                    <>
                      {isOnline && <span className="inline-block size-1.5 rounded-full bg-success" />}
                      {isOnline ? "Online" : "Offline"}
                    </>
                  ) : preview.hasImage && !preview.text ? (
                    "Photo"
                  ) : (
                    preview.text || "Photo"
                  )}
                </p>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-base-content/60">No chats found</p>
            <p className="mt-1 text-xs text-base-content/40">
              {search ? "Try a different search" : "No conversations yet"}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
