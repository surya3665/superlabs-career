import axios from "axios"
import { useEffect, useState } from "react"
import { FaChevronLeft } from "react-icons/fa6"
import { useNavigate, useParams } from "react-router-dom"

const JobDetail = () => {
  const { id } = useParams()
  const jobUrl = import.meta.env.VITE_JOB_URL
  const navigate = useNavigate()
  const [jobDetail, setJobDetail] = useState({})

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

  //job expired
  const isJobExpired = () => {
    if (!jobDetail.job_close_date) return false
  
    const closeDate = new Date(jobDetail.job_close_date)
    closeDate.setHours(23, 59, 59, 999) // end of the day
  
    return Date.now() > closeDate.getTime()
  }
  


  return (
    <main className='sm:px-10 md:px-20 py-10'>
      <p
        onClick={() => navigate("/")}
        className='text-red-500 flex items-center text-lg font-semibold cursor-pointer'
      >
        <FaChevronLeft /> Back to Careers Page
      </p>

      <div className='py-7'>
        <h1 className='text-3xl font-semibold'>{jobDetail.job_title}</h1>
        <div className='py-4 pb-6 gap-5'>
          <ul className='list-none text-red-500 font-bold  space-y-3 '>
            <div className='flex sm:flex-col lg:flex-row gap-3 lg:space-x-5'>
              <li className=' gap-1 w-auto'>
                Job Type:{" "}
                <span className='text-black font-normal'>
                  {jobDetail.job_type?.join(", ")}
                </span>
              </li>
              <li className=' gap-1 w-auto'>
                Job Location Type:{" "}
                <span className='text-black font-normal'>
                  {jobDetail.job_location_type?.join(", ")}
                </span>
              </li>
              <li className=' gap-1 w-auto'>
                Qualifications:{" "}
                <span className='text-black font-normal'>
                  {jobDetail.job_education_qualification?.join(", ")}
                </span>
              </li>
            </div>
            <div className='flex sm:flex-col lg:flex-row gap-3 lg:space-x-5'>
              <li className=' gap-1 w-auto'>
                Experience Level:{" "}
                <span className='text-black font-normal'>
                  {isNaN(jobDetail.job_experience_level)
                    ? jobDetail.job_experience_level
                    : `${jobDetail.job_experience_level} Years`}
                </span>
              </li>
              <li className=' gap-1 w-auto'>
                Interview Rounds:{" "}
                <span className='text-black font-normal'>
                  {jobDetail.job_interview_rounds} Rounds
                </span>
              </li>
              <li className=' gap-1 w-auto'>
                Location:{" "}
                <span className='text-black font-normal'>
                  {jobDetail.job_location}
                </span>
              </li>
              <li className=' gap-1 w-auto'>
                Salary:{" "}
                <span className='text-black font-normal'>
                  {jobDetail.job_budget}
                </span>
              </li>
            </div>
            <div className='flex sm:flex-col lg:flex-row gap-3 lg:space-x-5'>
              <li className=' gap-1 w-auto'>
                Total Vacancies:{" "}
                <span className='text-black font-normal'>
                  {jobDetail.job_vacancy} Vacancies
                </span>
              </li>
              <li className=' gap-1 w-auto'>
                Date Posted:{" "}
                <span className='text-black font-normal'>
                  {jobDetail.job_create_date}
                </span>
              </li>
              <li className=' gap-1 w-auto'>
                Valid Till:{" "}
                <span className='text-black font-normal'>
                  {jobDetail.job_close_date}
                </span>
              </li>
            </div>
          </ul>
        </div>
        {jobDetail.job_technical_skills?.length > 0 && (
          <div className='-mt-6 py-4'>
            <h3 className='text-xl font-semibold'>
              Mandatory Technical Skills:
            </h3>
            <div className='flex flex-wrap gap-2 mt-2'>
              {jobDetail.job_technical_skills.map((skill, index) => (
                <span
                  key={index}
                  className='text-red-500 bg-red-100 font-semibold rounded-full px-3 py-2 text-sm text-ellipsis overflow-hidden whitespace-nowrap min-w-[50px] '
                  title={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* {Date.now() > new Date(jobDetail.job_close_date).getTime() ? ( */}
        {isJobExpired() ? (
          <button
            disabled
            className='mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700'
          >
            Closed
          </button>
        ) : (
          <button
            onClick={() =>
              navigate(
                // `/job/${jobDetail.job_id}/${jobDetail.job_title}/apply`,
                `/job/${jobDetail.job_id}/${jobDetail.job_title.replace(/\s+/g, "-")}/apply`,
                {
                  state: { questions: jobDetail.job_questions },
                }
              )
            }
            className=' font-bold bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700'
          >
            Apply Now
          </button>
        )}
      </div>

      <div>
        <p>
          <b>About SuperLabs</b>
        </p>
        <br />
        <p>
          SuperLabs is an engineering & IT consulting firm. To know more about
          SuperLabs & the work we do visit Featured Work
        </p>
        <br />

        <ul>
          <p
            dangerouslySetInnerHTML={{ __html: jobDetail.job_description }}
          ></p>
        </ul>
        <div className='mt-6'>
          {/* {Date.now() > new Date(jobDetail.job_close_date).getTime() ? ( */}
          {isJobExpired() ? (

            <button
              disabled
              className='mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700'
            >
              Closed
            </button>
          ) : (
            <button
              onClick={() =>
                navigate(
                  `/job/${jobDetail.job_id}/${jobDetail.job_title}/apply`,
                  {
                    state: { questions: jobDetail.job_questions },
                  }
                )
              }
              className='font-bold bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700'
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

export default JobDetail
