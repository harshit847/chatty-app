import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User } from "lucide-react";
import logo from "../assets/chatty-logo.png";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <img
                src={logo}
                alt="Chatty Logo"
                className="h-10 w-auto object-contain rounded"
              />
              <span className="hidden sm:block font-bold text-lg tracking-tight">Chatty</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={"/settings"}
              className="btn btn-ghost btn-sm gap-2 rounded-full"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-ghost btn-sm gap-2 rounded-full">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="btn btn-ghost btn-sm gap-2 rounded-full hover:bg-error/10 hover:text-error"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
