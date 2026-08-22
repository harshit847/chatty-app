import { ArrowLeft, EllipsisVertical, Moon, Sun, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-base-300 bg-base-100/70 px-3 py-2.5 shadow-sm backdrop-blur-md sm:px-5">
      {/* Back - mobile only */}
      <button
        onClick={() => setSelectedUser(null)}
        className="btn btn-ghost btn-sm btn-circle lg:hidden"
        aria-label="Back to chats"
      >
        <ArrowLeft className="size-5" />
      </button>

      <div className="relative shrink-0">
        <img
          src={selectedUser.profilePic || "/avatar.png"}
          alt={selectedUser.fullName}
          className="size-10 rounded-full object-cover ring-1 ring-base-300"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-base-100" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold tracking-tight">{selectedUser.fullName}</h3>
        <p className={`flex items-center gap-1.5 text-xs ${isOnline ? "text-success" : "text-base-content/50"}`}>
          {isOnline && <span className="inline-block size-1.5 rounded-full bg-success" />}
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>

      {/* Header actions */}
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary"
          aria-label="Toggle theme"
          title="Toggle light/dark theme"
        >
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>

        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
            aria-label="More options"
          >
            <EllipsisVertical className="size-5" />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-30 mt-2 w-48 rounded-xl border border-base-300 bg-base-100 p-1.5 shadow-lg"
          >
            <li>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
              >
                <X className="size-4 text-base-content/50" />
                Close conversation
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
