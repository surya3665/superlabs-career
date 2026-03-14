import {
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import "../index.css"
import toast from "react-hot-toast"

const jobUrl = import.meta.env.VITE_JOB_URL
const categoryUrl = import.meta.env.VITE_CATEGORY_URL
const locationUrl = import.meta.env.VITE_LOCATION_URL

function EditJobPost({
  setOpen,
  handleOpen,
  isEdit,
  editId,
  setIsEdit,
  job,
  setJob,
  onSuccess,
}) {
  // ─── Guard: only fetch once per editId, ignore stale responses ───
  const hasFetched = useRef(false)
  const abortControllerRef = useRef(null)

  const [questions, setQuestions] = useState([
    { question: "", isCompulsory: false },
  ])

  const [screen, setScreen] = useState(1)

  const [category, setCategory] = useState([])
  const [location, setLocation] = useState([])

  // ─── Single source of truth for the entire form ───
  const [editJobPost, setEditJobPost] = useState({
    job_title: "",
    job_location_type: [],        // replaces selectedJobLocationTypeValues
    job_category: "",
    job_type: [],                 // replaces selectedJobTypeValues
    job_location: "",
    job_experience_level: "",
    job_technical_skills: [],     // replaces techSkillsValues
    job_education_qualification: [], // replaces educationalValues
    job_description: "",
    job_vacancy: "",
    job_interview_rounds: "",
    job_budget: "",
    job_create_date: "",          // replaces createDate
    job_close_date: "",           // replaces closeDate
    job_status: "",
  })

  // ─── Temporary input buffers (only for the tag-input fields) ───
  const [jobTechSkills, setJobTechSkills] = useState("")
  const [education, setEducation] = useState("")

  // ─── Fetch single job post (runs ONCE per editId) ───
  useEffect(() => {
    // If editId changes, reset the guard so we fetch the new post
    hasFetched.current = false

    // Cancel any in-flight request from a previous editId
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    const fetchSingleJobPost = async () => {
      if (hasFetched.current) return // already loaded for this editId
      try {
        const res = await axios.get(`${jobUrl}/${editId}`, {
          signal: controller.signal,
        })
        const data = res.data

        // Parse questions safely
        const q = data.job_questions
        const parsed = typeof q === "string" ? JSON.parse(q) : q
        setQuestions(
          Array.isArray(parsed)
            ? parsed
            : [{ question: "", isCompulsory: true }]
        )

        // Set the SINGLE form state with everything at once
        setEditJobPost({
          job_title: data.job_title || "",
          job_location_type: data.job_location_type || [],
          job_category: data.job_category || "",
          job_type: data.job_type || [],
          job_location: data.job_location || "",
          job_experience_level: data.job_experience_level || "",
          job_technical_skills: data.job_technical_skills || [],
          job_education_qualification: data.job_education_qualification || [],
          job_description: data.job_description || "",
          job_vacancy: data.job_vacancy || "",
          job_interview_rounds: data.job_interview_rounds || "",
          job_budget: data.job_budget || "",
          job_create_date: data.job_create_date || "",
          job_close_date: data.job_close_date || "",
          job_status: data.job_status || "",
        })

        hasFetched.current = true // mark as fetched — no more overwrites
      } catch (err) {
        if (err.name !== "CancelError") {
          console.error("Failed to fetch job post", err)
        }
      }
    }

    fetchSingleJobPost()

    // Cleanup: abort on unmount or before next effect run
    return () => controller.abort()
  }, [editId])

  // ─── Fetch categories ───
  useEffect(() => {
    axios.get(categoryUrl).then((response) => {
      setCategory(response.data)
    })
  }, [])

  // ─── Fetch locations ───
  useEffect(() => {
    axios.get(locationUrl).then((response) => {
      setLocation(response.data)
    })
  }, [])

  ///////////////////////////////////////////////////////////////////////

  function handleClose() {
    setIsEdit(false)
  }

  // ─── Generic single-field handler ───
  const handleSingleFieldChange = (e) => {
    const { name, value } = e.target
    setEditJobPost((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ─── Checkbox array handlers (job_type & job_location_type) ───
  const handleCheckboxChange = (fieldName, value, checked) => {
    setEditJobPost((prev) => ({
      ...prev,
      [fieldName]: checked
        ? [...prev[fieldName], value]
        : prev[fieldName].filter((v) => v !== value),
    }))
  }

  // ─── Date handlers (now just use handleSingleFieldChange directly) ───
  // job_create_date and job_close_date are already in editJobPost,
  // so the generic handler works — no separate state needed.

  // ─── Job Description (ReactQuill gives value directly, not an event) ───
  const handleJobDescription = (value) => {
    setEditJobPost((prev) => ({
      ...prev,
      job_description: value,
    }))
  }

  // ─── Education Qualification (tag input) ───
  const handleKeyDownEducation = (e) => {
    if (e.key === "Enter" && education.trim() !== "") {
      setEditJobPost((prev) => ({
        ...prev,
        job_education_qualification: [...prev.job_education_qualification, education.trim()],
      }))
      setEducation("")
    }
  }

  const removeEducation = (index) => {
    setEditJobPost((prev) => ({
      ...prev,
      job_education_qualification: prev.job_education_qualification.filter((_, i) => i !== index),
    }))
  }

  // ─── Technical Skills (tag input) ───
  const handleKeyDownTechSkills = (e) => {
    if (e.key === "Enter" && jobTechSkills.trim() !== "") {
      setEditJobPost((prev) => ({
        ...prev,
        job_technical_skills: [...prev.job_technical_skills, jobTechSkills.trim()],
      }))
      setJobTechSkills("")
    }
  }

  const removeTechnicalSkills = (index) => {
    setEditJobPost((prev) => ({
      ...prev,
      job_technical_skills: prev.job_technical_skills.filter((_, i) => i !== index),
    }))
  }

  // ─── Questions ───
  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addQuestionField = () => {
    setQuestions((prev) => [...prev, { question: "", isCompulsory: "Yes" }])
  }

  const removeQuestionField = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  // ─── Validation (shared between Next and Submit) ───
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!editJobPost.job_title) errs.job_title = "Job title is required."
    if (!editJobPost.job_location_type.length)
      errs.job_location_type = "Select at least one location type."
    if (!editJobPost.job_category) errs.job_category = "Job category is required."
    if (!editJobPost.job_type.length)
      errs.job_type = "Select at least one job type."
    if (!editJobPost.job_location) errs.job_location = "Job location is required."
    if (!editJobPost.job_experience_level)
      errs.job_experience_level = "Experience level is required."
    if (!editJobPost.job_technical_skills.length)
      errs.job_technical_skills = "At least one technical skill is required."
    if (!editJobPost.job_education_qualification.length)
      errs.job_education_qualification = "Education qualification is required."
    if (!editJobPost.job_description) errs.job_description = "Job description is required."
    if (!editJobPost.job_vacancy) errs.job_vacancy = "Vacancy must be specified."
    if (!editJobPost.job_interview_rounds)
      errs.job_interview_rounds = "Interview rounds must be specified."
    if (!editJobPost.job_budget) errs.job_budget = "Budget is required."
    if (!editJobPost.job_create_date) errs.job_create_date = "Created date is required."
    if (!editJobPost.job_close_date) errs.job_close_date = "Closing date is required."
    if (!editJobPost.job_status) errs.job_status = "Job status is required."
    return errs
  }

  // ─── Next (screen 1 → 2) ───
  const handleNext = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setScreen(2)
  }

  // ─── Submit ───
  async function handleSubmit(e) {
  e.preventDefault();

  // Remove empty questions
  const cleanedQuestions = questions.filter(
    (q) => q.question && q.question.trim() !== ""
  );

  // Check if any empty question exists
  if (cleanedQuestions.length !== questions.length) {
    toast.error("Please fill all questions or remove empty ones");
    return;
  }

  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    return;
  }

  try {
    const res = await axios.put(
      `${jobUrl}/${editId}`,
      {
        ...editJobPost,
        questions: cleanedQuestions, // ✅ send cleaned only
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setJob((prev) =>
      prev?.map((j) => (j.job_id === editId ? res.data : j))
    );

    setIsEdit(false);
    onSuccess();
  } catch (err) {
    console.error(err);
    toast.error("Job Update Failed!");
  }
}

  // async function handleSubmit(e) {
  //   e.preventDefault()

  //   const errs = validate()
  //   if (Object.keys(errs).length > 0) {
  //     setErrors(errs)
  //     return
  //   }

  //   try {
  //     const res = await axios.put(
  //       `${jobUrl}/${editId}`,
  //       {
  //         ...editJobPost,   // everything is already in one object
  //         questions,        // questions are still separate (page-2 data)
  //       },
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     )
  //     setJob((prev) => prev?.map((j) => (j.job_id === editId ? res.data : j)))
  //     setIsEdit(false)
  //     onSuccess()
  //   } catch (err) {
  //     console.error(err)
  //     toast.error("Job Update Failed!")
  //   }
  // }

  const handleCancel = () => {
    setIsEdit(false)
  }

  // ─── Render ───
  return (
    <div>
      <Dialog
        size="lg"
        open={isEdit}
        handler={handleClose}
        className="p-4 scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300 h-[600px] overflow-y-scroll"
      >
        <DialogHeader className="relative font-Josefin block space-y-4 pb-6">
          <Typography className="font-Josefin" variant="h4" color="blue-gray">
            Edit your JobPost
          </Typography>
          <Typography className="mt-1 font-Josefin font-medium text-gray-600">
            Complete the form below with your job details.
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleClose}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>

          {/* ══════════════ SCREEN 1 ══════════════ */}
          {screen === 1 && (
            <div>
              {/* Title */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Title
                </Typography>
                <input
                  placeholder="Enter Job Title"
                  name="job_title"
                  className="border-2 w-full text-base p-2 font-Josefin"
                  value={editJobPost.job_title}
                  onChange={handleSingleFieldChange}
                />
                {errors.job_title && <p className="text-red-500 text-sm">{errors.job_title}</p>}
              </div>

              {/* Job Location Type */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Job Location Type
                </Typography>
                <div className="flex gap-5 text-base">
                  {["Onsite", "Remote", "Hybrid"].map((type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        value={type}
                        checked={editJobPost.job_location_type.includes(type)}
                        onChange={(e) =>
                          handleCheckboxChange("job_location_type", type, e.target.checked)
                        }
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                {errors.job_location_type && (
                  <p className="text-red-500 text-sm">{errors.job_location_type}</p>
                )}
              </div>

              {/* Job Category */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Job Category
                </Typography>
                <div className="flex text-base flex-col items-start font-Josefin">
                  <select
                    className="p-2 border border-gray-300"
                    name="job_category"
                    value={editJobPost.job_category}
                    onChange={handleSingleFieldChange}
                  >
                    <option value="">Choose Your Job Category</option>
                    {category.map((cat) => (
                      <option key={cat.category_id} value={cat.category_title}>
                        {cat.category_title}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.job_category && <p className="text-red-500 text-sm">{errors.job_category}</p>}
              </div>

              {/* Job Type */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Job Type
                </Typography>
                <div className="flex gap-5 text-base">
                  {["FullTime", "PartTime", "Intership", "Contract"].map((type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        value={type}
                        checked={editJobPost.job_type.includes(type)}
                        onChange={(e) =>
                          handleCheckboxChange("job_type", type, e.target.checked)
                        }
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                {errors.job_type && <p className="text-red-500 text-sm">{errors.job_type}</p>}
              </div>

              {/* Job Location */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Job Location
                </Typography>
                <div className="flex text-base flex-col items-start font-Josefin">
                  <select
                    className="p-2 border border-gray-300"
                    name="job_location"
                    value={editJobPost.job_location}
                    onChange={handleSingleFieldChange}
                  >
                    <option value="">Choose Your Job Location</option>
                    {location.map((loc) => (
                      <option key={loc.location_id} value={loc.location_title}>
                        {loc.location_title}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.job_location && <p className="text-red-500 text-sm">{errors.job_location}</p>}
              </div>

              {/* Experience Level */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Experience Level
                </Typography>
                <input
                  placeholder="Enter Experience Level"
                  name="job_experience_level"
                  className="border-2 w-full text-base p-2 font-Josefin"
                  value={editJobPost.job_experience_level}
                  onChange={handleSingleFieldChange}
                />
                {errors.job_experience_level && (
                  <p className="text-red-500 text-sm">{errors.job_experience_level}</p>
                )}
              </div>

              {/* Technical Skills */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Mandatory Technical Skills
                </Typography>
                <div className="flex flex-col items-start">
                  <div className="flex flex-wrap border border-gray-300 rounded w-full">
                    {editJobPost.job_technical_skills.map((value, index) => (
                      <div key={index} className="flex text-base items-center bg-gray-200 p-1 m-1 rounded">
                        {value}{" "}
                        <button
                          onClick={() => removeTechnicalSkills(index)}
                          className="bg-red-500 text-white ml-2 px-2 rounded"
                        >
                          x
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={jobTechSkills}
                      onChange={(e) => setJobTechSkills(e.target.value)}
                      onKeyDown={handleKeyDownTechSkills}
                      placeholder="Enter a value and press Enter"
                      className="flex-grow p-2 text-base border-0 focus:ring-0"
                    />
                  </div>
                </div>
                {errors.job_technical_skills && (
                  <p className="text-red-500 text-sm">{errors.job_technical_skills}</p>
                )}
              </div>

              {/* Education Qualification */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Education Qualification
                </Typography>
                <div className="flex flex-col items-start">
                  <div className="flex flex-wrap border border-gray-300 rounded w-full">
                    {editJobPost.job_education_qualification.map((value, index) => (
                      <div key={index} className="flex text-base items-center bg-gray-200 p-1 m-1 rounded">
                        {value}{" "}
                        <button
                          onClick={() => removeEducation(index)}
                          className="bg-red-500 text-white ml-2 px-2 rounded"
                        >
                          x
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      onKeyDown={handleKeyDownEducation}
                      placeholder="Enter a value and press Enter"
                      className="flex-grow p-2 text-base border-0 focus:ring-0"
                    />
                  </div>
                </div>
                {errors.job_education_qualification && (
                  <p className="text-red-500 text-sm">{errors.job_education_qualification}</p>
                )}
              </div>

              {/* Job Description */}
              <div className="font-Josefin">
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium font-Josefin">
                  Job Description
                </Typography>
                <ReactQuill
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline", "strike"],
                      ["link", "image"],
                      [{ align: [] }],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header", "font", "list", "bullet", "bold",
                    "italic", "underline", "strike", "link", "image", "align",
                  ]}
                  className="mb-4"
                  value={editJobPost.job_description}
                  onChange={handleJobDescription}
                />
                {errors.job_description && (
                  <p className="text-red-500 text-sm">{errors.job_description}</p>
                )}
              </div>

              {/* Vacancy */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Vacancy
                </Typography>
                <input
                  placeholder="Enter total no.of vacancies"
                  name="job_vacancy"
                  className="border-2 w-full text-base p-2 font-Josefin"
                  value={editJobPost.job_vacancy}
                  onChange={handleSingleFieldChange}
                />
                {errors.job_vacancy && <p className="text-red-500 text-sm">{errors.job_vacancy}</p>}
              </div>

              {/* Interview Rounds */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Interview Rounds
                </Typography>
                <input
                  placeholder="Enter Interview Rounds"
                  name="job_interview_rounds"
                  className="border-2 w-full text-base p-2 font-Josefin"
                  value={editJobPost.job_interview_rounds}
                  onChange={handleSingleFieldChange}
                />
                {errors.job_interview_rounds && (
                  <p className="text-red-500 text-sm">{errors.job_interview_rounds}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Budget
                </Typography>
                <input
                  placeholder="Enter Job Budget"
                  name="job_budget"
                  className="border-2 w-full text-base p-2 font-Josefin"
                  value={editJobPost.job_budget}
                  onChange={handleSingleFieldChange}
                />
                {errors.job_budget && <p className="text-red-500 text-sm">{errors.job_budget}</p>}
              </div>

              {/* Created Date */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Created Date
                </Typography>
                <input
                  type="date"
                  name="job_create_date"
                  value={editJobPost.job_create_date}
                  className="text-base"
                  onChange={handleSingleFieldChange}
                />
                {errors.job_create_date && (
                  <p className="text-red-500 text-sm">{errors.job_create_date}</p>
                )}
              </div>

              {/* Valid Through */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Valid Through
                </Typography>
                <input
                  type="date"
                  name="job_close_date"
                  value={editJobPost.job_close_date}
                  className="text-base"
                  onChange={handleSingleFieldChange}
                />
                {errors.job_close_date && (
                  <p className="text-red-500 text-sm">{errors.job_close_date}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                  Status
                </Typography>
                <div className="flex text-base flex-col items-start font-Josefin">
                  <select
                    className="p-2 border border-gray-300"
                    name="job_status"
                    value={editJobPost.job_status}
                    onChange={handleSingleFieldChange}
                  >
                    <option value="">Choose Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                {errors.job_status && <p className="text-red-500 text-sm">{errors.job_status}</p>}
              </div>
            </div>
          )}

          {/* ══════════════ SCREEN 2 ══════════════ */}
          {screen === 2 && (
            <div className="mt-6">
              <Typography variant="small" color="blue-gray" className="mb-2 text-left font-Josefin font-medium">
                Questions
              </Typography>
              {questions.map((q, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Enter question"
                    className="flex-1 p-2 border border-gray-300"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                  />
                  <select
                    className="p-2 border border-gray-300"
                    value={q.isCompulsory}
                    onChange={(e) => handleQuestionChange(index, "isCompulsory", e.target.value)}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => removeQuestionField(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded font-Josefin"
                onClick={addQuestionField}
              >
                Add Question
              </button>
            </div>
          )}
        </DialogHeader>

        {/* ─── Footer buttons ─── */}
        {screen === 1 && (
          <DialogFooter>
            <Button onClick={handleNext} className="m-auto">
              Next
            </Button>
          </DialogFooter>
        )}
        {screen === 2 && (
          <DialogFooter>
            <Button onClick={() => setScreen(1)} className="mr-auto">
              Back
            </Button>
            <Button onClick={handleSubmit} className="ml-auto">
              Update
            </Button>
            <Button onClick={handleCancel} className="ml-4">
              Cancel
            </Button>
          </DialogFooter>
        )}
      </Dialog>
    </div>
  )
}

export default EditJobPost