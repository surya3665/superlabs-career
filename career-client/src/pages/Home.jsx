import axios from "axios"
import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { MdWorkOutline } from "react-icons/md"
import { Link, useLocation } from "react-router-dom"
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle"
import RoomIcon from "@mui/icons-material/Room"
import CategoryIcon from "@mui/icons-material/Category"
import React from "react"
import LoadingPage from "./LoadingPage"

const jobUrl = import.meta.env.VITE_JOB_URL
const locationUrl = import.meta.env.VITE_LOCATION_URL
const categoryUrl = import.meta.env.VITE_CATEGORY_URL

const Home = () => {
  const [openLeft, setOpenLeft] = useState(false)
  const [openLeft2, setOpenLeft2] = useState(false)
  const openDrawerLeft = () => setOpenLeft(true)
  const closeDrawerLeft = () => setOpenLeft(false)
  const openDrawerLeft2 = () => setOpenLeft2(true)
  const closeDrawerLeft2 = () => setOpenLeft2(false)
  const [jobs, setJobs] = useState([])
  const [location, setLocation] = useState([])
  const [category, setCategory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocations, setSelectedLocations] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [locationSearch, setLocationSearch] = useState("")
  const [categorySearch, setCategorySearch] = useState("")
  const [isLocationOpen, setIsLocationOpen] = useState(true)
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [showAllLocations, setShowAllLocations] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 10

  const jobListRef = useRef(null)
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(jobUrl)
        setJobs(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(locationUrl)
        setLocation(response.data)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchLocation()
  }, [])

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(categoryUrl)
        setCategory(response.data)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchCategory()
  }, [])

  useEffect(() => {
    if (jobListRef.current && currentPage > 1) {
      jobListRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentPage]) // Only trigger on page changes

  const handleLocationChange = (locationTitle) => {
    setSelectedLocations((prev) =>
      prev.includes(locationTitle)
        ? prev.filter((loc) => loc !== locationTitle)
        : [...prev, locationTitle]
    )
  }

  const handleCategoryChange = (categoryTitle) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryTitle)
        ? prev.filter((cat) => cat !== categoryTitle)
        : [...prev, categoryTitle]
    )
  }

  const filteredLocations = location.filter((loc) =>
    loc.location_title?.toLowerCase().includes(locationSearch.toLowerCase())
  )

  const filteredCategories = category.filter((cat) =>
    cat.category_title?.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredJobs.length / jobsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (loading) return <LoadingPage />

  // const activeJobs = jobs.filter((job) => {
  //   const today = new Date()
  //   const jobCloseDate = job.job_close_date
  //     ? new Date(job.job_close_date)
  //     : null
  //   return job.job_status.toLowerCase() === "active" && jobCloseDate
  // })
  const activeJobs = jobs.filter((job) => {
    // Must be Active
    if (job.job_status?.toLowerCase() !== "active") return false
  
    // Must have close date
    if (!job.job_close_date) return false
  
    const today = new Date()
    today.setHours(0, 0, 0, 0)
  
    const jobCloseDate = new Date(job.job_close_date)
    jobCloseDate.setHours(23, 59, 59, 999) // end of day
  
    // Must NOT be expired
    return jobCloseDate >= today
  })
  
  

  const filteredJobs = activeJobs.filter((job) => {
    const matchesSearch =
      job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_technical_skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.includes(job.job_location)

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(job.job_category)

    return matchesSearch && matchesLocation && matchesCategory
  })

  // ✅ 2. Paginate the filtered jobs
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)

  return (
    <main
      className={`sm:px-5 md:px-10 lg:px-32 flex flex-col lg:flex-row gap-4 py-5 h-full `}
    >
      <section className=' sm:hidden md:hidden lg:flex   '>
        <div className='py-2'>
          <h3 className='font-medium text-gray-500'>
            {activeJobs.length || filteredJobs.length} jobs
          </h3>
          <h2 className='text-2xl font-semibold py-2'>Sort & Filter</h2>
          <p className='text-gray-300 w-full bg-gray-300 h-[1px]' />

          <div>
            <h3
              className='font-medium flex gap-2 text-red-500 text-base py-3 items-center cursor-pointer'
              onClick={() => setIsLocationOpen(!isLocationOpen)}
            >
              <p>Location</p>
              <ArrowDropDownCircleIcon 
              className={`transform transition-all duration-300 ease-in-out ${
                isLocationOpen ? "rotate-180" : "rotate-0"
              }`}/>
            </h3>
            {isLocationOpen && (
              <div>
                <input
                  type='text'
                  placeholder='Search Locations'
                  className='w-full border border-gray-200 outline-none tracking-wider text-sm text-gray-700 font-medium py-2 px-4 rounded-lg mb-2'
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                />
                {filteredLocations
                  .slice(0, showAllLocations ? filteredLocations.length : 5)
                  .map((loc, idx) => (
                    <label
                      key={idx}
                      className='flex gap-3 py-1 items-center text-xs text-gray-600 mb-1'
                    >
                      <input
                        type='checkbox'
                        className='accent-red-600 h-5 w-5'
                        checked={selectedLocations.includes(loc.location_title)}
                        onChange={() =>
                          handleLocationChange(loc.location_title)
                        }
                      />
                      <span>{loc.location_title}</span>
                    </label>
                  ))}
                {filteredLocations.length > 5 && (
                  <button
                    className='text-red-500 text-sm mt-2'
                    onClick={() => setShowAllLocations(!showAllLocations)}
                  >
                    {showAllLocations ? "View Less" : "View More"}
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <h3
              className='font-medium flex  gap-2 text-red-500 text-lg py-3 items-center cursor-pointer'
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <p className='text-base'>Job Categories</p>
              <ArrowDropDownCircleIcon
              className={`transform transition-all duration-300 ease-in-out ${
                isCategoryOpen ? "rotate-180" : "rotate-0"
              }`} />
            </h3>
            {isCategoryOpen && (
              <div>
                <input
                  type='text'
                  placeholder='Search Categories'
                  className='w-full border border-gray-200 outline-none tracking-wider text-sm text-gray-700 font-medium py-2 px-4 rounded-lg mb-2'
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
                {filteredCategories
                  .slice(0, showAllCategories ? filteredCategories.length : 5)
                  .map((cat, idx) => (
                    <label
                      key={idx}
                      className='flex gap-3 py-1 items-center text-xs text-gray-600 mb-1'
                    >
                      <input
                        type='checkbox'
                        className='accent-red-600 h-5 w-5'
                        checked={selectedCategories.includes(
                          cat.category_title
                        )}
                        onChange={() =>
                          handleCategoryChange(cat.category_title)
                        }
                      />
                      <span>{cat.category_title}</span>
                    </label>
                  ))}
                {filteredCategories.length > 5 && (
                  <button
                    className='text-red-500 text-sm mt-2'
                    onClick={() => setShowAllCategories(!showAllCategories)}
                  >
                    {showAllCategories ? "View Less" : "View More"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <section className='w-full h-full'>
        {/* 🔹 Loading / Error Handling */}
        {loading ? (
          <p className='text-gray-600 text-center py-4'>Loading Jobs...</p>
        ) : error ? (
          <p className='text-red-500 text-center py-4'>Error: {error}</p>
        ) : (
          <>
            <div className='w-full h-full'>
              <input
                type='text'
                placeholder='Search Keywords: Eg:(Python, HR...)'
                className='w-full border border-gray-200 outline-none tracking-wider text-md text-gray-700 font-medium py-3 my-3 px-4 rounded-lg'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div>
                <div className='flex lg:hidden gap-4 pb-3 w-full h-full'>
                  <div className='flex border p-2 rounded-lg '>
                    {" "}
                    <RoomIcon color='disabled' />{" "}
                    <button className='' onClick={openDrawerLeft}>
                      Location
                    </button>
                  </div>
                  <div className='flex border p-2 rounded-lg'>
                    {" "}
                    <CategoryIcon color='disabled' />{" "}
                    <button className='' onClick={openDrawerLeft2}>
                      Category
                    </button>
                  </div>
                </div>
                {openLeft && (
                  <div className='fixed inset-0 flex items-center justify-center z-50 mx-10'>
                    <div className='fixed inset-0 bg-black opacity-50'></div>
                    <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl z-10 overflow-y-auto max-h-screen'>
                      <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-2xl font-bold'>
                          Select Your Filters
                        </h2>
                        <button
                          className='text-gray-500 hover:text-gray-700'
                          onClick={() => setOpenLeft(false)}
                        >
                          <svg
                            className='h-6 w-6'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M6 18L18 6M6 6l12 12'
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <section className='py-2 px-10'>
                        <div className='py-2'>
                          <div>
                            <h3
                              className='font-medium flex gap-2 text-red-500 text-lg py-3 items-center cursor-pointer'
                              onClick={() => setIsLocationOpen(!isLocationOpen)}
                            >
                              <p>Location</p>
                              <ArrowDropDownCircleIcon
                              className={`transform transition-all duration-300 ease-in-out ${
                                isLocationOpen ? "rotate-180" : "rotate-0"
                              }`} />
                            </h3>
                            {isLocationOpen && (
                              <div>
                                <input
                                  type='text'
                                  placeholder='Search Locations'
                                  className='w-full border border-gray-200 outline-none tracking-wider text-md text-gray-700 font-medium py-2 px-4 rounded-lg mb-2'
                                  value={locationSearch}
                                  onChange={(e) =>
                                    setLocationSearch(e.target.value)
                                  }
                                />
                                {filteredLocations
                                  .slice(
                                    0,
                                    showAllLocations
                                      ? filteredLocations.length
                                      : 5
                                  )
                                  .map((loc, idx) => (
                                    <label
                                      key={idx}
                                      className='flex gap-3 py-1 items-center text-sm text-gray-600 mb-1'
                                    >
                                      <input
                                        type='checkbox'
                                        className='accent-red-600 h-5 w-5'
                                        checked={selectedLocations.includes(
                                          loc.location_title
                                        )}
                                        onChange={() =>
                                          handleLocationChange(
                                            loc.location_title
                                          )
                                        }
                                      />
                                      <span>{loc.location_title}</span>
                                    </label>
                                  ))}
                                {filteredLocations.length > 5 && (
                                  <button
                                    className='text-red-500 text-sm mt-2'
                                    onClick={() =>
                                      setShowAllLocations(!showAllLocations)
                                    }
                                  >
                                    {showAllLocations
                                      ? "View Less"
                                      : "View More"}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
                {openLeft2 && (
                  <div className='fixed inset-0 flex items-center justify-center mx-10 z-50'>
                    <div className='fixed inset-0 bg-black opacity-50'></div>
                    <div className='bg-white rounded-lg shadow-lg px-4 py-6 w-full max-w-3xl z-10 overflow-y-auto max-h-screen'>
                      <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-bold'>
                          Select Your Category
                        </h2>
                        <button
                          className='text-gray-500 hover:text-gray-700'
                          onClick={() => setOpenLeft2(false)}
                        >
                          <svg
                            className='h-6 w-6'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M6 18L18 6M6 6l12 12'
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <section className='py-2 px-5'>
                        <div className='py-2'>
                          <div>
                            <h3
                              className='font-medium flex gap-2 text-red-500 text-lg py-3 items-center cursor-pointer'
                              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            >
                              <p>Job Categories</p>
                              <ArrowDropDownCircleIcon
                              className={`transform transition-all duration-300 ease-in-out ${
                                isCategoryOpen ? "rotate-180" : "rotate-0"
                              }`} />
                            </h3>
                            {isCategoryOpen && (
                              <div>
                                <input
                                  type='text'
                                  placeholder='Search Categories'
                                  className='w-full border border-gray-200 outline-none tracking-wider text-md text-gray-700 font-medium py-2 px-4 rounded-lg mb-2'
                                  value={categorySearch}
                                  onChange={(e) =>
                                    setCategorySearch(e.target.value)
                                  }
                                />
                                {filteredCategories
                                  .slice(
                                    0,
                                    showAllCategories
                                      ? filteredCategories.length
                                      : 5
                                  )
                                  .map((cat, idx) => (
                                    <label
                                      key={idx}
                                      className='flex gap-3 py-1 items-center text-sm text-gray-600 mb-1'
                                    >
                                      <input
                                        type='checkbox'
                                        className='accent-red-600 h-5 w-5'
                                        checked={selectedCategories.includes(
                                          cat.category_title
                                        )}
                                        onChange={() =>
                                          handleCategoryChange(
                                            cat.category_title
                                          )
                                        }
                                      />
                                      <span>{cat.category_title}</span>
                                    </label>
                                  ))}
                                {filteredCategories.length > 5 && (
                                  <button
                                    className='text-red-500 text-sm mt-2'
                                    onClick={() =>
                                      setShowAllCategories(!showAllCategories)
                                    }
                                  >
                                    {showAllCategories
                                      ? "View Less"
                                      : "View More"}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div ref={jobListRef}>
              {currentJobs.length > 0 ? (
                <div className='flex flex-col '>
                  <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 w-full h-full place-content-start place-items-center'>
                    {currentJobs.map((item, index) => (
                      <div
                        key={item.job_id} // Use unique key (job_id) instead of index
                        className='border w-full min-w-[300px] h-[260px] relative border-gray-300 hover:shadow-lg hover:shadow-red-200 rounded-lg py-6 px-6'
                      >
                        {/* <Link to={`/job/${item.job_id}/${item.job_title}`}> */}
                        <Link to={`/job/${item.job_id}/${item.job_title.replace(/\s+/g, "-")}`}>
                          <h1 className='text-red-500 text-xl inline font-semibold py-2 hover:cursor-pointer hover:underline'>
                            {item.job_title}
                          </h1>
                        {/* </Link> */}
                        <h3 className='text-xl text-gray-500 mt-4 mb-2'>
                          {isNaN(item.job_experience_level)
                            ? item.job_experience_level
                            : `${item.job_experience_level}+ years`}
                        </h3>

                        <div className='flex flex-nowrap gap-2 py-4 overflow-x-auto max-w-full'>
                          {item.job_technical_skills.map(
                            (skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className='text-red-500 bg-red-50 font-semibold rounded-full px-3 py-1 text-sm whitespace-nowrap'
                                title={skill}
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                        <hr className='bg-gray-200 min-h-0.5 mt-3'></hr>
                        <div className='flex justify-between pt-6 font-medium text-base'>
                          <p className='flex items-center gap-1'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='18'
                              height='18'
                              fill='#e60000'
                              viewBox='0 0 16 16'
                            >
                              <path d='M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10' />
                              <path d='M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6' />
                            </svg>
                            {item.job_location}
                          </p>
                          <p className='flex items-center gap-1'>
                            <MdWorkOutline className='text-red-500 font-bold text-base' />
                            {item.job_type.join(", ")}
                          </p>
                        </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className='flex items-center w-full h-full justify-center mt-5'>
                    <nav>
                      <ul className='flex list-none'>
                        <li className='mx-1'>
                          <button
                            onClick={prevPage}
                            className={`px-3 py-1 w-24 rounded ${
                              currentPage === 1
                                ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                                : "bg-red-500 text-white"
                            }`}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }).map(
                          (_, index) => (
                            <li key={index} className='mx-1'>
                              <button
                                onClick={() => paginate(index + 1)}
                                className={`px-3 py-1 rounded ${
                                  currentPage === index + 1
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {index + 1}
                              </button>
                            </li>
                          )
                        )}
                        <li className='mx-1'>
                          <button
                            onClick={nextPage}
                            className={`px-3 py-1 w-24 rounded ${
                              currentPage ===
                              Math.ceil(activeJobs.length / jobsPerPage)
                                ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                                : "bg-red-500 text-white"
                            }`}
                            disabled={
                              currentPage ===
                              Math.ceil(activeJobs.length / jobsPerPage)
                            }
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              ) : (
                <p className='text-gray-600 text-center py-4'>
                  No active jobs found.
                </p>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default Home
