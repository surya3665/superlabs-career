import { Link } from "react-router-dom";
import funnyImage from "../assets/Darknet-404-Page-Concept.png"; // Make sure to replace this with the actual path to your funny image

const Error404 = () => {
  return (
    <div className="h-screen flex flex-col lg:flex-row gap-5  items-center justify-center lg:justify-between bg-gray-100">
      <div className=" flex flex-col items-center justify-center lg:items-start gap-5 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! Page not found.
        </h1>
        <p className="text-gray-600 mb-8">
          It looks like the page you are looking for doesn't exist.
        </p>
        <Link to="/">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Go Back Home
          </button>
        </Link>
      </div>
      <img src={funnyImage} alt="Funny 404" className="w-1/2 mb-8" />
    </div>
  );
};

export default Error404;
