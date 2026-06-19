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
      className={`group relative px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200
        ${active ? "text-emerald-400" : "text-gray-400 hover:text-white"}
      `}
    >
      {label}

      {/* underline active animation */}
      <span
        className={`absolute left-3 bottom-0 h-[2px] bg-emerald-400 transition-all duration-300
          ${active ? "w-[calc(100%-24px)]" : "w-0 group-hover:w-[calc(100%-24px)]"}
        `}
      />
    </Link>
  );
}

function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

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
      
      {/* GLOWING HEADER NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-white/5 shadow-[0_1px_20px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 group-hover:border-emerald-500/25 transition duration-300">
              <LogoMark size={28} />
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition duration-300">
              Code<span className="text-emerald-400 group-hover:text-white transition duration-300 font-extrabold">Nexus</span>
            </span>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <NavItem to="/" label="Home" />
              <NavItem to="/problems" label="Problems" />
              {user && <NavItem to="/my-submissions" label="Submissions" />}
              {user?.role === "admin" && <NavItem to="/admin/create-problem" label="Add Problem" />}
            </div>

            <span className="hidden sm:inline text-white/5">|</span>

            {/* ACCOUNT MENU (NOT LOGGED IN) */}
            {!user && (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg shadow-md shadow-emerald-500/5 hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* PROFILE MENU (LOGGED IN) */}
            {user && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setOpenProfile((v) => !v)}
                  className="flex items-center gap-2 bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 p-1 rounded-full hover:scale-105 transition duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-md shadow-emerald-500/10">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                    <div className="px-4 py-3 border-b border-white/5 bg-slate-900/20">
                      <div className="text-xs text-gray-400">Signed in as</div>
                      <div className="text-sm font-semibold text-white truncate mt-0.5">{user.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link
                        to="/problems"
                        onClick={() => setOpenProfile(false)}
                        className="block px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
                      >
                        All Problems
                      </Link>
                      <Link
                        to="/my-submissions"
                        onClick={() => setOpenProfile(false)}
                        className="block px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
                      >
                        My Submissions
                      </Link>
                      
                      <div className="h-[1px] bg-white/5 my-1" />

                      <button
                        onClick={() => {
                          setOpenProfile(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 animate-fadeIn">{children}</main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default MainLayout;