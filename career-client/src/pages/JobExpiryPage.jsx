import { Link } from "react-router-dom";
import expiredImage from "../assets/Expired.svg"; // Make sure to replace this with the actual path to your expired image

const JobExpiryPage = () => {
  return (
    <div className="h-screen flex flex-col lg:flex-row gap-5  items-center justify-center lg:justify-between bg-gray-100">
      <img
        src={expiredImage}
        alt="Job Expired"
        className="w-1/2 h-[400px] mb-8"
      />
      <div className=" flex flex-col items-center justify-center lg:items-start gap-5 px-4">
        {" "}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Job Post Expired
        </h1>
        <p className="text-gray-600 mb-8">
          The job post you are looking for is no longer available. It might have
          been removed or is no longer active.
        </p>
        <Link to="/">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default JobExpiryPage;
