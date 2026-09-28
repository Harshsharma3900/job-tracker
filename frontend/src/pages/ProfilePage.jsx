import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import API_URL from "../api"


function ProfilePage() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      try {
        const response = await fetch(
  `${API_URL}/me`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

        const data = await response.json()

        if (
          data.message === "Please login first" ||
          data.message === "User not found"
        ) {
          localStorage.removeItem("token")
          navigate("/login")
          return
        }

        setUser(data)

      } catch (error) {
        console.error("Profile error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">
            Loading profile...
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">

      <Sidebar />

      <main className="flex-1 min-w-0 pb-20 md:pb-0">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5">
          <h1 className="text-2xl font-bold text-slate-800">
            Profile
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your account information
          </p>
        </header>

        <section className="p-6">

          <div className="max-w-4xl mx-auto space-y-6">

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <div className="flex items-center gap-5 pb-6 border-b border-slate-200">

                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {user?.name}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    {user?.email}
                  </p>

                  <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Active Account
                  </span>
                </div>

              </div>

              {/* Personal Information */}
              <div className="mt-6">

                <h3 className="text-lg font-bold text-slate-800 mb-5">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={user?.name || ""}
                      readOnly
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      placeholder="Enter phone number"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>

                    <input
                      type="text"
                      placeholder="Enter location"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                </div>

              </div>

              <div className="flex justify-end mt-7 pt-5 border-t border-slate-200">

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Save Changes
                </button>

              </div>

            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

              <h3 className="text-lg font-bold text-slate-800">
                Account Settings
              </h3>

              <div className="mt-5 space-y-4">

                <button className="w-full text-left p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                  <p className="font-semibold text-slate-700">
                    Change Password
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Update your account password
                  </p>
                </button>

                <Link
                  to="/login"
                  onClick={() => localStorage.removeItem("token")}
                  className="block w-full p-4 rounded-xl border border-red-200 hover:bg-red-50 transition"
                >
                  <p className="font-semibold text-red-600">
                    Logout
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Sign out from your account
                  </p>
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default ProfilePage