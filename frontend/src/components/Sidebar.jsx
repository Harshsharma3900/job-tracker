import { NavLink, Link } from "react-router-dom"

function Sidebar() {
  const navClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 min-h-screen bg-slate-900 text-white flex-col">

        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <Link to="/dashboard" className="flex items-center gap-3">

            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
              J
            </div>

            <div>
              <h1 className="font-bold text-lg">
                Job Tracker
              </h1>

              <p className="text-xs text-slate-400">
                Career Dashboard
              </p>
            </div>

          </Link>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">

          <NavLink to="/dashboard" className={navClass}>
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/jobs" className={navClass}>
            <span>📋</span>
            <span>Applications</span>
          </NavLink>

          <NavLink to="/add-job" className={navClass}>
            <span>➕</span>
            <span>Add Job</span>
          </NavLink>

          <NavLink to="/profile" className={navClass}>
            <span>👤</span>
            <span>Profile</span>
          </NavLink>

        </nav>

        {/* Logout */}
        <div className="mt-auto p-4">
          <Link
            to="/login"
            onClick={() => localStorage.removeItem("token")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800"
          >
            <span>🚪</span>
            <span>Logout</span>
          </Link>
        </div>

      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 px-2 py-2 flex justify-around">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs ${
              isActive
                ? "text-white bg-blue-600"
                : "text-slate-300"
            }`
          }
        >
          <span>📊</span>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs ${
              isActive
                ? "text-white bg-blue-600"
                : "text-slate-300"
            }`
          }
        >
          <span>📋</span>
          <span>Jobs</span>
        </NavLink>

        <NavLink
          to="/add-job"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs ${
              isActive
                ? "text-white bg-blue-600"
                : "text-slate-300"
            }`
          }
        >
          <span>➕</span>
          <span>Add</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs ${
              isActive
                ? "text-white bg-blue-600"
                : "text-slate-300"
            }`
          }
        >
          <span>👤</span>
          <span>Profile</span>
        </NavLink>

        <Link
          to="/login"
          onClick={() => localStorage.removeItem("token")}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs text-slate-300"
        >
          <span>🚪</span>
          <span>Logout</span>
        </Link>

      </nav>
    </>
  )
}

export default Sidebar