import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import LogoMark from "../components/LogoMark";
import Footer from "../components/Footer";

function NavItem({ to, label }) {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== "/" && pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`group relative px-2 py-1 text-sm font-medium transition
        ${active ? "text-emerald-400" : "text-gray-300 hover:text-emerald-300"}
      `}
    >
      {label}

      {/* underline animation */}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] bg-emerald-400 transition-all duration-300
          ${active ? "w-full" : "w-0 group-hover:w-full"}
        `}
      />
    </Link>
  );
}

function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const [openAccount, setOpenAccount] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const accountRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setOpenAccount(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-[#0f172a]/80 border-b border-white/10">
        <div className="px-6 py-4 flex justify-between items-center">
          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center gap-3">
            <LogoMark size={34} />

            {isAuthPage && (
              <span className="text-xl font-bold tracking-wide text-emerald-400">
                CodeNexus
              </span>
            )}
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            <NavItem to="/" label="Home" />
            <NavItem to="/problems" label="Problems" />

            {user && <NavItem to="/my-submissions" label="My Submissions" />}

            {/* ADMIN ONLY */}
            {user?.role === "admin" && (
              <NavItem to="/admin/create-problem" label="Add Problem" />
            )}

            {/* ACCOUNT MENU (NOT LOGGED IN) */}
            {!user && (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setOpenAccount((v) => !v)}
                  className="bg-[#111827] border border-gray-700 px-4 py-2 rounded-lg text-sm hover:border-emerald-500 transition"
                >
                  Account ▾
                </button>

                {openAccount && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#0f172a] border border-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <Link
                      to="/login"
                      onClick={() => setOpenAccount(false)}
                      className="block px-4 py-2 hover:bg-[#111827]"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setOpenAccount(false)}
                      className="block px-4 py-2 hover:bg-[#111827]"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* PROFILE MENU (LOGGED IN) */}
            {user && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setOpenProfile((v) => !v)}
                  className="flex items-center gap-2 bg-[#111827] border border-gray-700 px-2 py-1.5 rounded-lg hover:border-emerald-500 transition"
                >
                  <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0f172a] border border-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-800 text-sm text-gray-300">
                      {user.name}
                    </div>

                    <button
                      onClick={() => {
                        setOpenProfile(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#111827] text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ PAGE CONTENT grows, footer stays bottom */}
      <main className="flex-1 p-8">{children}</main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default MainLayout;