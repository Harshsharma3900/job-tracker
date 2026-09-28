import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import API_URL from "../api"

function AddJob() {
  const navigate = useNavigate()

  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("Applied")
  const [salary, setSalary] = useState("")
  const [appliedDate, setAppliedDate] = useState("")
  const [jobLink, setJobLink] = useState("")

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddJob = async (e) => {
    e.preventDefault()

    if (!company || !role) {
      setMessage("Company name and job role are required")
      return
    }

    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      setMessage("")

      const params = new URLSearchParams({
        company,
        role,
        location,
        status,
        job_link: jobLink,
        salary,
        applied_date: appliedDate,
      })

      const response = await fetch(
  `${API_URL}/jobs?${params.toString()}`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

      const data = await response.json()

      if (data.message === "Job added successfully") {
        setMessage("Job added successfully ✅")

        setTimeout(() => {
          navigate("/jobs")
        }, 800)
      } else if (data.message === "Please login first") {
        localStorage.removeItem("token")
        navigate("/login")
      } else {
        setMessage(data.message || "Failed to add job")
      }
    } catch (error) {
      setMessage("Backend se connection nahi ho raha ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">

      <Sidebar />

      <main className="flex-1 min-w-0 pb-20 md:pb-0">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Add New Job
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Add a new job application to your tracker
            </p>
          </div>

          <Link
            to="/jobs"
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
           
          </Link>
        </header>

        {/* Form */}
        <section className="p-6">

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

            <form onSubmit={handleAddJob}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name *
                  </label>

                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Role *
                  </label>

                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. React Developer"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Noida / Remote"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Application Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Offer">Offer</option>
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Salary
                  </label>

                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. ₹6 LPA"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Applied Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Applied Date
                  </label>

                  <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Job Link */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Link
                  </label>

                  <input
                    type="url"
                    value={jobLink}
                    onChange={(e) => setJobLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* Message */}
              {message && (
                <p className="text-center mt-5 text-sm font-medium text-slate-600">
                  {message}
                </p>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-slate-200">

                <Link
                  to="/jobs"
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold transition"
                >
                  {loading ? "Adding Job..." : "Add Job"}
                </button>

              </div>

            </form>

          </div>

        </section>

      </main>

    </div>
  )
}

export default AddJob