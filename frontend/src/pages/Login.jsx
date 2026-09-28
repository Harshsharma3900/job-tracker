import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setMessage("Please enter email and password")
      return
    }

    try {
      setLoading(true)
      setMessage("")

      const response = await fetch(
        `http://127.0.0.1:8000/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      )

      const data = await response.json()

      if (data.access_token) {
        localStorage.setItem("token", data.access_token)

        setMessage("Login successful ✅")

        setTimeout(() => {
          navigate("/dashboard")
        }, 800)
      } else {
        setMessage(data.message || "Invalid email or password")
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

        <div className="text-center mb-8">

          <div className="w-14 h-14 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white text-2xl font-bold">
            J
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mt-4">
            Welcome Back
          </h1>

          <p className="text-slate-500 mt-2">
            Login to your Job Tracker account
          </p>

        </div>

        <form onSubmit={handleLogin} className="space-y-5">

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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {message && (
            <p className="text-center text-sm font-medium text-slate-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-sm text-slate-500 mt-7">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login