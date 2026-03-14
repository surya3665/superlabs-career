import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"

const candidatesUrl = import.meta.env.VITE_CANDIDATES_URL

function JobApplicationForm() {
  const { id } = useParams()
  const { jobtitle } = useParams()

  const navigate = useNavigate()

  const [jobDetail, setJobDetail] = useState({})

  const jobUrl = import.meta.env.VITE_JOB_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${jobUrl}/${id}`)
        if (
          !response.data ||
          response?.data?.job_status?.toLowerCase() !== "active"
        ) {
          navigate("/expired")
        } else {
          setJobDetail(response.data)
        }
      } catch (error) {
        console.log(error)
        navigate("/expired")
      }
    }
    fetchData()
  }, [id, jobUrl, navigate])

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    linkedin: "",
    website: "",
    resume: null,
    cover: null,

    graduation: "",
    specialization: "",
    year_of_graduation: "",
    location: "",
    willing_to_relocate: "",
    work_experience: "",
    current_salary: "",
    expected_salary: "",
    availability: "",


    job_id: id,
    job_title: jobtitle,
    job_answers: [],
  })

  useEffect(() => {
    if (
      jobDetail?.job_questions &&
      jobDetail.job_questions.length > 0 &&
      formData.job_answers.length === 0
    ) {
      const initializedAnswers = jobDetail.job_questions.map((q) => ({
        question: q.question,
        answer: "",
      }))
      setFormData((prevData) => ({
        ...prevData,
        job_answers: initializedAnswers,
      }))
    }
  }, [jobDetail])

  const [errors, setErrors] = useState({})
  const [fileMessages, setFileMessages] = useState({})

  const fieldRefs = {
    first_name: useRef(null),
    last_name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    linkedin: useRef(null),
    resume: useRef(null),
  }

  const validateLinkedIn = (username) => {
    const regex = /^[a-zA-Z0-9-]+$/
    return regex.test(username)
  }

  const validateName = (value) => {
    const regex = /^[A-Za-z\s]+$/
    return regex.test(value)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if ((name === "first_name" || name === "last_name") && value !== "") {
      if (!validateName(value)) return
    }

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return
    }

    if (name === "linkedin") {
      const username = value
        .replace(/^.*linkedin\.com\/in\//i, "")
        .replace(/\/.*/g, "")
      setFormData({ ...formData, [name]: username })
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    const file = files[0]
    if (file) {
      if (file.type !== "application/pdf") {
        setErrors({ ...errors, [name]: "Only PDF files are allowed" })
        setFileMessages({ ...fileMessages, [name]: "" })
      } else if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, [name]: "File size should be less than 5MB" })
        setFileMessages({ ...fileMessages, [name]: "" })
      } else {
        setErrors({ ...errors, [name]: "" })
        setFormData({ ...formData, [name]: file })
        setFileMessages({ ...fileMessages, [name]: "PDF has been uploaded" })
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.first_name) {
      newErrors.first_name = "First name is required"
    } else if (!validateName(formData.first_name)) {
      newErrors.first_name = "First name should only contain letters"
    }

    if (!formData.last_name) {
      newErrors.last_name = "Last name is required"
    } else if (!validateName(formData.last_name)) {
      newErrors.last_name = "Last name should only contain letters"
    }

    if (!formData.email) newErrors.email = "Email is required"

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits"
    }

    if (!formData.resume) newErrors.resume = "Resume is required"

    // ✅ Validate required job questions
    if (
      Array.isArray(jobDetail?.job_questions) &&
      jobDetail.job_questions.length > 0
    ) {
      jobDetail.job_questions.forEach((question, index) => {
        if (question.isCompulsory == "true" || question.isCompulsory == true) {
          const answer = formData?.job_answers?.[index]?.answer
          if (!answer || answer.trim() === "") {
            newErrors[`job_question_${index}`] = "This Answer is required"
          }
        }
      })
    }

    setErrors(newErrors)

    // Scroll to first error
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0]
      if (firstError.startsWith("job_question_")) {
        document
          .querySelector(`[data-question-index="${firstError.split("_")[2]}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" })
      } else {
        fieldRefs[firstError]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
        fieldRefs[firstError]?.current?.focus()
      }
    }

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const data = new FormData()

    // Filter out empty answers and ensure we have valid data
    const cleanedAnswers = (formData.job_answers || [])
      .filter((ans) => ans && ans.answer && ans.answer.trim() !== "")
      .map((ans) => ({
        question: ans.question,
        answer: ans.answer.trim(),
      }))

    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "resume" || key === "cover") {
        if (value) {
          data.append(key, value)
        }
      } else if (key === "job_answers") {
        // Send job_answers as a JSON string
        data.append(key, JSON.stringify(cleanedAnswers))
      } else {
        data.append(key, value || "")
      }
    })

    try {
      await axios.post(candidatesUrl, data)
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        linkedin: "",
        website: "",
        resume: null,
        cover: null,
        job_id: id,
        job_title: jobtitle,
        job_answers: [],
      })
      navigate("/success")
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setErrors({ ...errors, email: "Email already exists" })
      } else {
        console.error(err)
        setErrors({ ...errors, form: "Failed to submit application" })
      }      
    }
  }

  const handleAnswerChange = (index, question, value) => {
    const updatedAnswers = [...(formData?.job_answers || [])]

    updatedAnswers[index] = {
      question: question.question,
      answer: value,
    }

    setFormData({ ...formData, job_answers: updatedAnswers })
  }

  return (
    <div className='flex flex-col gap-5 p-4 mx-auto items-center justify-center'>
      <NavLink
        to={`/job/${id}/${jobtitle}`}
        className='text-red-600 flex items-center'
      >
        <ArrowBackIosIcon /> <p>Back to Job Description</p>
      </NavLink>
      <h2 className='lg:text-3xl text-2xl text-red-600 font-bold'>
        {jobtitle}
      </h2>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-5 w-full max-w-lg'
      >
        <div className='flex flex-col gap-5'>
          <h3 className='text-2xl font-bold'>Personal Information</h3>

          <div className='flex flex-col md:flex-row items-center gap-5'>
            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                First Name *
              </label>
              <input
                type='text'
                name='first_name'
                value={formData.first_name}
                ref={fieldRefs.first_name}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)] leading-7 text-base font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
              {errors.first_name && (
                <p className='text-red-500 text-sm'>{errors.first_name}</p>
              )}
            </div>
            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Last Name *
              </label>
              <input
                type='text'
                name='last_name'
                value={formData.last_name}
                ref={fieldRefs.last_name}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)] leading-7 text-base font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
              {errors.last_name && (
                <p className='text-red-500 text-sm'>{errors.last_name}</p>
              )}
            </div>
          </div>
          <div className='flex flex-col md:flex-row items-center gap-5'>
            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Email *
              </label>
              <input
                type='email'
                name='email'
                ref={fieldRefs.email}
                value={formData.email}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)] leading-7 text-base font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email}</p>
              )}
            </div>
            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Phone *
              </label>
              <input
                type='tel'
                name='phone'
                ref={fieldRefs.phone}
                value={formData.phone}
                onChange={handleChange}
                maxLength='10'
                placeholder='Enter 10 digit number'
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)] leading-7 text-base font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
              {errors.phone && (
                <p className='text-red-500 text-sm'>{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        <div className='relative mb-6'>
          <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
            Resume/CV *
          </label>
          <input
            type='file'
            name='resume'
            onChange={handleFileChange}
            ref={fieldRefs.resume}
            className='text-gray-500 font-medium w-full text-base file:cursor-pointer cursor-pointer file:text-black file:border-0 file:py-2.5 border file:px-4 file:mr-4 file:bg-gray-200 file:hover:bg-red-500 rounded'
          />
          {errors.resume && (
            <p className='text-red-500 text-sm'>{errors.resume}</p>
          )}
          {fileMessages.resume && (
            <p className='text-green-500 text-sm'>{fileMessages.resume}</p>
          )}
        </div>



          <div className='flex flex-col gap-5'>
          <h3 className='text-2xl font-bold'>Professional Information</h3>

            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Graduation *
              </label>
              <input
                type='text'
                name='graduation'
                value={formData.graduation}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)]
                leading-7 text-base font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
              {errors.graduation && (
                <p className='text-red-500 text-sm'>{errors.graduation}</p>
              )}
            </div>

            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Specialization *
              </label>
              <input
                type='text'
                name='specialization'
                value={formData.specialization}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)]
                leading-7 text-base font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
              {errors.specialization && (
                <p className='text-red-500 text-sm'>{errors.specialization}</p>
              )}
            </div>

            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Year of Graduation *
              </label>
              <input
                type='text'
                name='year_of_graduation'
                placeholder='2022'
                value={formData.year_of_graduation}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)]
                leading-7 text-base font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
              {errors.year_of_graduation && (
                <p className='text-red-500 text-sm'>{errors.year_of_graduation}</p>
              )}
            </div>

            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Current Location *
              </label>
              <input
                type='text'
                name='location'
                placeholder='Coimbatore'
                value={formData.location}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)]
                leading-7 text-base font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
              {errors.location && (
                <p className='text-red-500 text-sm'>{errors.location}</p>
              )}
            </div>

            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Willing to Relocate? *
              </label>

              <select
                name='willing_to_relocate'
                value={formData.willing_to_relocate}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)]
                text-base font-normal text-gray-900 border border-gray-300 rounded-md focus:outline-none'
              >
                <option value=''>Select</option>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </select>

              {errors.willing_to_relocate && (
                <p className='text-red-500 text-sm'>{errors.willing_to_relocate}</p>
              )}
            </div>

            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Work Experience
              </label>
              <input
                type='text'
                name='work_experience'
                placeholder='e.g., Fresher or 1 year'
                value={formData.work_experience}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)]
                text-base font-normal text-gray-900 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
            </div>

            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Current Salary
              </label>
              <input
                type='text'
                name='current_salary'
                placeholder='e.g., 2 LPA'
                value={formData.current_salary}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)]
                text-base font-normal text-gray-900 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
            </div>

            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Expected Salary
              </label>
              <input
                type='text'
                name='expected_salary'
                placeholder='e.g., 3 LPA'
                value={formData.expected_salary}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)]
                text-base font-normal text-gray-900 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
            </div>

            <div className='relative mb-6 w-full'>
              <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                Availability (in days) *
              </label>
              <input
                type='number'
                name='availability'
                placeholder='e.g., 15'
                value={formData.availability}
                onChange={handleChange}
                className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)]
                text-base font-normal text-gray-900 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
              />
              {errors.availability && (
                <p className='text-red-500 text-sm'>{errors.availability}</p>
              )}
            </div>
          </div>



        <div className='flex flex-col gap-5'>
          <h3 className='text-2xl font-bold'>Additional Information</h3>

          <div className='relative mb-6'>
            <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
              Cover Letter
            </label>
            <input
              type='file'
              name='cover'
              onChange={handleFileChange}
              className='text-gray-500 font-medium w-full text-base file:cursor-pointer cursor-pointer file:text-black file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-gray-200 file:hover:bg-red-500 rounded border'
            />
            {errors.cover && (
              <p className='text-red-500 text-sm'>{errors.cover}</p>
            )}
            {fileMessages.cover && (
              <p className='text-green-500 text-sm'>{fileMessages.cover}</p>
            )}
          </div>
          <div className='relative mb-6 w-full'>
            <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
              LinkedIn Profile
            </label>
            <input
              type='text'
              name='linkedin'
              placeholder='Enter your LinkedIn username (e.g. johnsmith)'
              value={formData.linkedin}
              ref={fieldRefs.linkedin}
              onChange={handleChange}
              className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)] leading-7 text-base font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
            />
            {errors.linkedin && (
              <p className='text-red-500 text-sm'>{errors.linkedin}</p>
            )}
          </div>
          <div className='relative mb-6 w-full'>
            <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
              Website
            </label>
            <input
              type='url'
              name='website'
              placeholder='Please mention your website'
              value={formData.website}
              onChange={handleChange}
              className='block w-full h-11 px-5 py-2.5 bg-white shadow-[0_4px_6px_-1px_rgba(254,202,202,0.5),0_2px_4px_-1px_rgba(254,202,202,0.5)] leading-7 text-base font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
            />
            {/* {errors.website && (
              <p className="text-red-500 text-sm">{errors.website}</p>
            )} */}
          </div>
        </div>

        {Array.isArray(jobDetail?.job_questions) &&
          jobDetail?.job_questions?.length > 0 && (
            <div className='flex flex-col gap-5'>
              <h3 className='text-2xl font-bold'>Job Questions</h3>

              {jobDetail.job_questions.map((question, index) => (
                <div key={index} className='relative mb-6 w-full'>
                  <label className='flex items-center mb-2 text-gray-600 text-sm font-medium'>
                    {question.question}
                    {(question.isCompulsory == "true" ||
                      question.isCompulsory == true) && (
                      <span className='text-red-500 ml-1'>*</span>
                    )}
                  </label>
                  <textarea
                    rows={3}
                    className='block w-full px-5 py-2.5 bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none'
                    placeholder='Your answer...'
                    value={formData?.job_answers[index]?.answer || ""}
                    onChange={(e) =>
                      handleAnswerChange(index, question, e.target.value)
                    }
                  />
                  {errors[`job_question_${index}`] && (
                    <p className='text-red-500 text-sm'>
                      {errors[`job_question_${index}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

        <div>
          <button
            type='submit'
            className='md:w-52 w-full h-12 bg-red-600 hover:bg-red-800 transition-all duration-700 rounded-md drop-shadow-lg text-white text-base font-semibold leading-6 mb-6'
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  )
}

export default JobApplicationForm
