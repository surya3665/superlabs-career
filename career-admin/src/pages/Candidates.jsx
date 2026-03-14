import { useState, useEffect } from "react"
import axios from "axios"
import { Eye } from "lucide-react"
import ViewCandidate from "../components/ViewCandidate"
import DataTable from "react-data-table-component"

const candidatesUrl = import.meta.env.VITE_CANDIDATES_URL

export default function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [viewId, setViewId] = useState()
  const [query, setQuery] = useState("")

  useEffect(() => {
    fetchCandidates()
  }, [setCandidates])

  const fetchCandidates = async () => {
    const response = await axios.get(candidatesUrl)
    setCandidates(response.data)
  }

  console.log(candidates)
  const filteredCandidates = candidates.filter((c) => {
    return (
      c?.first_name?.toLowerCase().includes(query?.toLowerCase()) ||
      c?.last_name?.toLowerCase().includes(query?.toLowerCase()) ||
      c?.email?.toLowerCase().includes(query?.toLowerCase()) ||
      c?.job_title?.toLowerCase().includes(query?.toLowerCase()) ||
      c?.graduation?.toLowerCase().includes(q) ||
      c?.specialization?.toLowerCase().includes(q) ||
      c?.location?.toLowerCase().includes(q) ||
      c?.year_of_graduation?.toLowerCase().includes(q)
    )
  })

  const handleDelete = async (id) => {
    await axios.delete(`${candidatesUrl}/${id}`)
    fetchCandidates()
  }

  const columns = [
    {
      name: "Job Applied",
      selector: (row) => row.job_title,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) =>
        new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      sortable: true,
    },

    {
      name: "Graduation",
      selector: (row) => row.graduation || "-",
    },
    {
      name: "Specialization",
      selector: (row) => row.specialization || "-",
    },
    {
      name: "Year of Graduation",
      selector: (row) => row.year_of_graduation || "-",
    },
    {
      name: "Location",
      selector: (row) => row.location || "-",
    },
    {
      name: "Willing to Relocate",
      selector: (row) => row.willing_to_relocate || "-",
    },
    {
      name: "Experience",
      selector: (row) => row.work_experience || "-",
    },
    {
      name: "Current Salary",
      selector: (row) => row.current_salary || "-",
    },
    {
      name: "Expected Salary",
      selector: (row) => row.expected_salary || "-",
    },
    {
      name: "Availability",
      selector: (row) => row.availability || "-",
    },



    {
      name: "Job Location",
      selector: (row) => row.job_location,
    },
    {
      name: "View",
      cell: (row) => (
        <Eye className='cursor-pointer' onClick={() => setViewId(row.id)} />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Delete",
      cell: (row) => (
        <button
          className='border-red-500 text-red-500 border-2 p-[3px] rounded-md'
          onClick={() => handleDelete(row.id)}
        >
          Delete
        </button>
      ),
    },
  ]

  if (viewId) return <ViewCandidate id={viewId} setViewId={setViewId} />

  return (
    <div className='p-6 mx-auto flex flex-col gap-5'>
      <h2 className='text-2xl font-bold mt-6'>Candidates</h2>
      <input
        type='text'
        placeholder='Search...'
        className='input w-full mt-4 p-4 rounded-3xl'
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className='relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border'>
        <DataTable
          columns={columns}
          data={filteredCandidates}
          pagination
          paginationPerPage={10}
          highlightOnHover
          pointerOnHover
          responsive
          customStyles={{
            headCells: {
              style: {
                fontWeight: "bold",
                fontSize: "16px",
              },
            },
            cells: {
              style: {
                fontSize: "14px",
              },
            },
          }}
        />
      </div>
    </div>
  )
}
