import React, { Fragment } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

export default function Navbar() {
  const { signOut, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex justify-between items-center h-full">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
          >
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="size-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Chatty</h1>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <Settings className="size-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <Fragment>
                <Link
                  to="/profile"
                  className={`btn btn-sm gap-2 transition-colors`}
                >
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button onClick={signOut} className="flex gap-2 items-center">
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
