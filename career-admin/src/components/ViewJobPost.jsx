import {
  Dialog,
  IconButton,
  Typography,
  DialogHeader,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "../index.css";

const jobUrl = import.meta.env.VITE_JOB_URL;
const categoryUrl = import.meta.env.VITE_CATEGORY_URL;
const locationUrl = import.meta.env.VITE_LOCATION_URL;

function viewJobPost({ setOpen, handleOpen, viewId, setView }) {
  const [selectedJobTypeValues, setSelectedJobTypeValues] = useState([]);
  const [selectedJobLocationTypeValues, setSelectedJobLocationTypeValues] =
    useState([]);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [techSkillsValues, setTechSkillsValues] = useState([]);
  const [educationalValues, setEducationalValues] = useState([]);
  const [closeDate, setCloseDate] = useState();
  const [createDate, setCreateDate] = useState();
  const [editJobPost, setEditJobPost] = useState([
    {
      job_title: "",
      job_location_type: [],
      job_category: "",
      job_type: [],
      job_location: "",
      job_experience_level: "",
      job_technical_skills: "",
      job_education_qualification: "",
      job_description: "",
      job_vacancy: "",
      job_interview_rounds: "",
      job_budget: "",
      job_create_date: "",
      job_close_date: "",
      job_status: "",
    },
  ]);

  const fetchSingleJobPost = async () => {
    const jobpost = await axios.get(`${jobUrl}/${viewId}`);
    console.log(jobpost);
    setEditJobPost(jobpost.data);

    //Job Close Date

    setCloseDate(jobpost.data.job_close_date);

    //Job Create Date

    setCreateDate(jobpost.data.job_create_date);

    //Job Type

    setSelectedJobTypeValues(jobpost.data.job_type);

    //Job Location Type

    setSelectedJobLocationTypeValues(jobpost.data.job_location_type);

    //Education Qualification
    const uniqueEdu = new Set(jobpost.data.job_education_qualification);
    setEducationalValues((prevValues) => {
      const combinedValues = new Set([...prevValues, ...uniqueEdu]);
      return Array.from(combinedValues); // Convert the set back to an array
    });

    // Technical Skills
    const uniqueTech = new Set(jobpost.data.job_technical_skills);
    setTechSkillsValues((prevValues) => {
      const combinedValues = new Set([...prevValues, ...uniqueTech]);
      return Array.from(combinedValues); // Convert the set back to an array
    });
  };
  useEffect(() => {
    fetchSingleJobPost();
  }, [viewId]);

  useEffect(() => {
    axios.get(categoryUrl).then((response) => {
      setCategory(response.data);
    });
  }, [setCategory]);

  useEffect(() => {
    axios.get(locationUrl).then((response) => {
      setLocation(response.data);
    });
  }, [setLocation]);

  ///////////////////////////////////////////////////////////////////////

  function handleOpen() {
    setOpen(!open);
  }

  function handleClose() {
    setView(false);
  }

  return (
    <div>
      <Dialog
        size="lg"
        open={open}
        handler={handleOpen}
        className="p-4  scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300 h-[600px] overflow-y-scroll"
      >
        <DialogHeader className="relative font-Josefin  block space-y-4 pb-6">
          <Typography className="font-Josefin" variant="h4" color="blue-gray">
            Detailed JobPost View
          </Typography>
          <Typography className="mt-1 font-Josefin font-medium text-gray-600">
            Read down for Jobpost details
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleClose}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>

          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="  text-left font-Josefin font-medium "
            >
              Title :
            </Typography>
            <div className="text-base">{editJobPost.job_title}</div>
          </div>

          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Job Location Type :
            </Typography>
            <div className="text-base">
              {selectedJobLocationTypeValues.join(", ")}
            </div>
          </div>

          <div className="flex space-x-5 ">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Job Category :
            </Typography>
            <div className="text-base">{editJobPost.job_category}</div>
          </div>

          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Job Type :
            </Typography>
            <div className="text-base">{selectedJobTypeValues.join(", ")}</div>
          </div>

          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Job Location :
            </Typography>
            <div className="text-base">{editJobPost.job_location}</div>
          </div>
          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2  text-left font-Josefin font-medium "
            >
              Experience Level :
            </Typography>
            <div className="text-base">{editJobPost.job_experience_level}</div>
          </div>
          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Mandatory Technical Skills :
            </Typography>
            <div className="text-base">{techSkillsValues.join(", ")}</div>
          </div>
          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Education Qualification :
            </Typography>
            <div className="text-base">{educationalValues.join(", ")}</div>
          </div>
          <div className="font-Josefin flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium font-Josefin"
            >
              Job Description :
            </Typography>
            <div className="text-base">
              <div
                dangerouslySetInnerHTML={{
                  __html: editJobPost.job_description,
                }}
              ></div>
            </div>
          </div>
          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2  text-left font-Josefin font-medium "
            >
              Vacancy :
            </Typography>
            <div className="text-base">{editJobPost.job_vacancy}</div>
          </div>
          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2  text-left font-Josefin font-medium "
            >
              Interview Rounds :
            </Typography>
            <div className="text-base">{editJobPost.job_interview_rounds}</div>
          </div>

          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2  text-left font-Josefin font-medium "
            >
              Budget :
            </Typography>

            <div className="text-base">{editJobPost.job_budget}</div>
          </div>

          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Created Date :
            </Typography>
            <div className="text-base">{createDate}</div>
          </div>
          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Valid Through :
            </Typography>
            <div className="text-base">{closeDate}</div>
          </div>
          <div className="flex space-x-5">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-Josefin font-medium"
            >
              Status :
            </Typography>
            <div className="text-base">{editJobPost.job_status}</div>
          </div>
        </DialogHeader>
      </Dialog>
    </div>
  );
}

export default viewJobPost;
