import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"

function Jobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  // Edit state
  const [editingJob, setEditingJob] = useState(null)
  const [editStatus, setEditStatus] = useState("")
  const [editSalary, setEditSalary] = useState("")
  const [editLoading, setEditLoading] = useState(false)

  const fetchJobs = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    try {
      setLoading(true)

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
      setMessage("Jobs load nahi ho paayi ❌")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  // Delete
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    )

    if (!confirmDelete) {
      return
    }

    const token = localStorage.getItem("token")

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (data.message === "Job deleted successfully") {
        setJobs((currentJobs) =>
          currentJobs.filter((job) => job.id !== jobId)
        )

        setMessage("Job deleted successfully ✅")

        setTimeout(() => {
          setMessage("")
        }, 2000)
      } else {
        setMessage(data.message || "Delete failed")
      }
    } catch (error) {
      setMessage("Backend se connection nahi ho raha ❌")
    }
  }

  // Open edit modal
  const openEditModal = (job) => {
    setEditingJob(job)
    setEditStatus(job.status)
    setEditSalary(job.salary || "")
    setMessage("")
  }

  // Close edit modal
  const closeEditModal = () => {
    setEditingJob(null)
    setEditStatus("")
    setEditSalary("")
  }

  // Update job
  const handleUpdate = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    try {
      setEditLoading(true)

      const params = new URLSearchParams({
        status: editStatus,
        salary: editSalary,
      })

      const response = await fetch(
        `http://127.0.0.1:8000/jobs/${editingJob.id}?${params.toString()}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (data.message === "Job updated successfully") {

        setJobs((currentJobs) =>
          currentJobs.map((job) =>
            job.id === editingJob.id
              ? {
                  ...job,
                  status: editStatus,
                  salary: editSalary,
                }
              : job
          )
        )

        closeEditModal()

        setMessage("Job updated successfully ✅")

        setTimeout(() => {
          setMessage("")
        }, 2000)

      } else if (data.message === "Please login first") {

        localStorage.removeItem("token")
        navigate("/login")

      } else {
        setMessage(data.message || "Update failed")
      }

    } catch (error) {
      setMessage("Backend se connection nahi ho raha ❌")
    } finally {
      setEditLoading(false)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      job.company.toLowerCase().includes(searchText) ||
      job.role.toLowerCase().includes(searchText)

    const matchesStatus =
      statusFilter === "All Status" ||
      job.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusStyle = (status) => {
    if (status === "Applied") {
      return "bg-blue-100 text-blue-700"
    }

    if (status === "Interview") {
      return "bg-orange-100 text-orange-700"
    }

    if (status === "Offer") {
      return "bg-green-100 text-green-700"
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700"
    }

    if (status === "Shortlisted") {
      return "bg-purple-100 text-purple-700"
    }

    return "bg-slate-100 text-slate-700"
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">

      <Sidebar />

      <main className="flex-1 min-w-0 pb-20 md:pb-0">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Job Applications
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage and track all your applications
              </p>
            </div>

            <Link
              to="/add-job"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              + Add Job
            </Link>

          </div>
        </header>

        <section className="p-6">

          {/* Search & Filter */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">

            <div className="flex flex-col md:flex-row gap-4">

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Search company or job role..."
                className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
              >
                <option>All Status</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Shortlisted</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>

            </div>

          </div>

          {/* Message */}
          {message && (
            <div className="mb-5 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600">
              {message}
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-5 border-b border-slate-200">

              <h2 className="font-bold text-lg text-slate-800">
                All Applications
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {filteredJobs.length} application
                {filteredJobs.length !== 1 ? "s" : ""} found
              </p>

            </div>

            {loading ? (
              <div className="p-10 text-center text-slate-500">
                Loading applications...
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-10 text-center">

                <p className="text-slate-500">
                  No applications found.
                </p>

                <Link
                  to="/add-job"
                  className="inline-block mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  Add Job
                </Link>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                  <thead>
                    <tr className="bg-slate-50 text-left text-sm text-slate-500">

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
                        Salary
                      </th>

                      <th className="px-5 py-4">
                        Applied
                      </th>

                      <th className="px-5 py-4">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {filteredJobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {job.company}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {job.role}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {job.location || "-"}
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>

                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {job.salary || "-"}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {job.applied_date || "-"}
                        </td>

                        <td className="px-5 py-4">

                          <div className="flex gap-2">

                            <button
                              onClick={() => openEditModal(job)}
                              className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(job.id)}
                              className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>

      </main>

      {/* Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Edit Job
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingJob.company} - {editingJob.role}
                </p>
              </div>

              <button
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-700 text-xl"
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleUpdate} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>

                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Salary
                </label>

                <input
                  type="text"
                  value={editSalary}
                  onChange={(e) => setEditSalary(e.target.value)}
                  placeholder="e.g. ₹8 LPA"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold"
                >
                  {editLoading ? "Updating..." : "Update Job"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Jobs