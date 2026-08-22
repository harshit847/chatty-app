import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import logo from "../assets/chatty-logo.png";

const railItem = (isActive) =>
  `tooltip tooltip-right flex size-10 items-center justify-center rounded-xl transition-all duration-150 ${
    isActive
      ? "bg-base-100 text-primary shadow-sm ring-1 ring-base-300"
      : "text-base-content/55 hover:bg-base-100/70 hover:text-base-content"
  }`;

const IconRail = () => {
  const { authUser, logout } = useAuthStore();
  const { pathname } = useLocation();

  return (
    <nav className="hidden h-full w-16 shrink-0 flex-col items-center border-r border-base-300 bg-base-100 py-4 lg:flex">
      <Link
        to="/"
        className="tooltip tooltip-right rounded-2xl bg-primary/10 p-1.5 ring-1 ring-primary/20"
        data-tip="Chatty"
      >
        <img src={logo} alt="Chatty" className="size-8 rounded-xl object-contain" />
      </Link>

      {/* Primary navigation */}
      <div className="mt-7 flex flex-col items-center gap-1 rounded-2xl bg-base-200/60 p-1.5">
        <Link to="/" className={railItem(pathname === "/")} data-tip="Chats">
          <MessageSquare className="size-5" />
        </Link>
        <Link to="/settings" className={railItem(pathname === "/settings")} data-tip="Settings">
          <Settings className="size-5" />
        </Link>
        <Link to="/profile" className={railItem(pathname === "/profile")} data-tip="Profile">
          <User className="size-5" />
        </Link>
      </div>

      <div className="mt-auto flex flex-col items-center gap-2.5">
        <button
          onClick={logout}
          className="tooltip tooltip-right flex size-10 items-center justify-center rounded-xl text-base-content/55 transition-colors duration-150 hover:bg-error/10 hover:text-error"
          data-tip="Logout"
          aria-label="Logout"
        >
          <LogOut className="size-5" />
        </button>

        <div className="h-px w-7 bg-base-content/10"></div>

        <Link
          to="/profile"
          className={`tooltip tooltip-right mt-0.5 ${pathname === "/profile" ? "ring-primary" : ""} inline-block rounded-full ring-offset-2 ring-offset-base-100`}
          data-tip={authUser?.fullName}
        >
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt={authUser?.fullName}
            className="size-9 rounded-full object-cover ring-2 ring-base-300 transition-colors hover:ring-primary/60"
          />
        </Link>
      </div>
    </nav>
  );
};

export default IconRail;
