import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"

function Dashboard() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/jobs",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (data.message === "Please login first") {
          localStorage.removeItem("token")
          navigate("/login")
          return
        }

        setJobs(data.jobs || [])
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [navigate])

  const totalApplications = jobs.length

  const appliedCount = jobs.filter(
    (job) => job.status === "Applied"
  ).length

  const interviewCount = jobs.filter(
    (job) => job.status === "Interview"
  ).length

  const offerCount = jobs.filter(
    (job) => job.status === "Offer"
  ).length

  const recentJobs = jobs.slice(-3).reverse()

  return (
    <div className="min-h-screen bg-slate-100 flex">

      <Sidebar />

      <main className="flex-1 min-w-0 pb-20 md:pb-0">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between gap-4">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Dashboard
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Track and manage your job applications
            </p>
          </div>

          <Link
            to="/add-job"
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            + Add Job
          </Link>

        </header>

        <section className="p-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">
                Total Applications
              </p>

              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {totalApplications}
              </h3>

              <p className="text-xs text-slate-400 mt-2">
                All job applications
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">
                Applied
              </p>

              <h3 className="text-3xl font-bold text-blue-600 mt-2">
                {appliedCount}
              </h3>

              <p className="text-xs text-slate-400 mt-2">
                Waiting for response
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">
                Interviews
              </p>

              <h3 className="text-3xl font-bold text-orange-500 mt-2">
                {interviewCount}
              </h3>

              <p className="text-xs text-slate-400 mt-2">
                Interview scheduled
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">
                Offers
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {offerCount}
              </h3>

              <p className="text-xs text-slate-400 mt-2">
                Offers received
              </p>
            </div>

          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6">

            <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4">

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Recent Applications
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Your latest job applications
                </p>
              </div>

              <Link
                to="/jobs"
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                View All
              </Link>

            </div>

            <div className="overflow-x-auto">

              {loading ? (
                <div className="p-8 text-center text-slate-500">
                  Loading applications...
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="p-8 text-center">

                  <p className="text-slate-500">
                    No job applications yet.
                  </p>

                  <Link
                    to="/add-job"
                    className="inline-block mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold"
                  >
                    Add Your First Job
                  </Link>

                </div>
              ) : (
                <table className="w-full min-w-[700px]">

                  <thead>
                    <tr className="text-left text-sm text-slate-500 border-b border-slate-200">

                      <th className="px-5 py-4">
                        Company
                      </th>

                      <th className="px-5 py-4">
                        Role
                      </th>

                      <th className="px-5 py-4">
                        Location
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Date
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {recentJobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >

                        <td className="px-5 py-4 font-semibold text-slate-700">
                          {job.company}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {job.role}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {job.location || "-"}
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              job.status === "Applied"
                                ? "bg-blue-100 text-blue-700"
                                : job.status === "Interview"
                                ? "bg-orange-100 text-orange-700"
                                : job.status === "Offer"
                                ? "bg-green-100 text-green-700"
                                : job.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {job.status}
                          </span>

                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {job.applied_date || "-"}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>
              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Dashboard