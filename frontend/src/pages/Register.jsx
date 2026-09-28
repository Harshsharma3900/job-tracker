import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      setMessage("Please fill all fields")
      return
    }

    try {
      setLoading(true)
      setMessage("")

      const response = await fetch(
        `http://127.0.0.1:8000/register?name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(
          password
        )}`,
        {
          method: "POST",
        }
      )

      const data = await response.json()

      if (data.message === "Registration successful") {
        setMessage("Registration successful ✅")

        setTimeout(() => {
          navigate("/login")
        }, 1000)
      } else {
        setMessage(data.message || "Registration failed")
      }
    } catch (error) {
      setMessage("Backend se connection nahi ho raha ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="text-center mb-8">

          <div className="w-14 h-14 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white text-2xl font-bold">
            J
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mt-4">
            Create Account
          </h1>

          <p className="text-slate-500 mt-2">
            Start tracking your job applications
          </p>

        </div>

        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Message */}
          {message && (
            <div className="text-center text-sm font-medium text-slate-600">
              {message}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* Login */}
        <p className="text-center text-sm text-slate-500 mt-7">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register