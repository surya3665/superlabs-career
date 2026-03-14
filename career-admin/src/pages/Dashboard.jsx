// import { useContext, useEffect, useState } from "react";
// import { FaUserAlt } from "react-icons/fa";

// // import { Chart as ChartJS } from "chart.js/auto";
// // import { Bar, Doughnut, Line } from "react-chartjs-2";
// import axios from "axios";
// import { ThemeContext } from "../App";

// const candidatesUrl = import.meta.env.VITE_CANDIDATES_URL

// export default function Dashboard() {
//   const { job } = useContext(ThemeContext);

//   console.log(job);

//   const [candidates, setCandidates] = useState([]);

//   useEffect(() => {
//     fetchCandidates();
//   }, []);

//   const fetchCandidates = async () => {
//     const response = await axios.get(candidatesUrl);
//     setCandidates(response.data);
//   };
//   const name = localStorage.getItem("username")

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
//         <p className="absolute top-7 right-7 bg-blue-100 p-2 rounded-lg flex gap-2"><FaUserAlt className="text-gray-700" />{name}</p>
//       </div>
//       <div className="grid grid-cols-2 gap-6">
//         <div className="p-4 bg-blue-100 rounded-lg shadow">
//           <h3 className="text-lg font-semibold">Total Jobs Posted </h3>
//           <p className="text-2xl">{job?.length}</p>
//         </div>
//         <div className="p-4 bg-green-100 rounded-lg shadow">
//           <h3 className="text-lg font-semibold">Total Candidates</h3>
//           <p className="text-2xl">{candidates?.length}</p>
//         </div>
//         <div className="p-4 bg-yellow-100 rounded-lg shadow">
//           <h3 className="text-lg font-semibold">Active Jobs</h3>
//           <p className="text-2xl">
//             {job?.filter((j) => j.job_status === "Active").length}
//           </p>
//         </div>
//         <div className="p-4 bg-red-100 rounded-lg shadow">
//           <h3 className="text-lg font-semibold">Inactive Jobs</h3>
//           <p className="text-2xl">
//             {" "}
//             {job?.filter((j) => j.job_status === "Inactive").length}
//           </p>
//         </div>
//       </div>
//       {/* <div className=" flex flex-col gap-5">
//         <h1 className=" text-2xl font-bold">Graphs</h1>
//         <div className=" flex gap-2 flex-wrap items-center justify-between ">
//           <div className=" w-[400px] h-[400px] flex items-center justify-center">
//             {" "}
//             <Bar
//               data={{
//                 labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//                 datasets: [
//                   {
//                     label: "Job Applications",
//                     backgroundColor: "rgba(75, 192, 192, 0.2)",
//                     borderColor: "rgba(75, 192, 192, 1)",
//                     borderWidth: 1,
//                     data: [65, 59, 80, 81, 56, 55, 40],
//                   },
//                   {
//                     label: "Job Interviews",
//                     backgroundColor: "rgba(255, 99, 132, 0.2)",
//                     borderColor: "rgba(255, 99, 132, 1)",
//                     borderWidth: 1,
//                     data: [28, 48, 40, 19, 86, 27, 90],
//                   },
//                 ],
//               }}
//             />
//           </div>

//           <div className=" w-[400px] h-[400px] flex items-center justify-center ">
//             {" "}
//             <Doughnut
//               data={{
//                 labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//                 datasets: [
//                   {
//                     label: "Job Applications",
//                     backgroundColor: "rgba(75, 192, 192, 0.2)",
//                     borderColor: "rgba(75, 192, 192, 1)",
//                     borderWidth: 1,
//                     data: [65, 59, 80, 81, 56, 55, 40],
//                   },
//                   {
//                     label: "Job Interviews",
//                     backgroundColor: "rgba(255, 99, 132, 0.2)",
//                     borderColor: "rgba(255, 99, 132, 1)",
//                     borderWidth: 1,
//                     data: [28, 48, 40, 19, 86, 27, 90],
//                   },
//                 ],
//               }}
//             />
//           </div>

//           <div className=" w-[400px] h-[400px] flex items-center justify-center ">
//             {" "}
//             <Line
//               data={{
//                 labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//                 datasets: [
//                   {
//                     label: "Job Applications",
//                     backgroundColor: "rgba(75, 192, 192, 0.2)",
//                     borderColor: "rgba(75, 192, 192, 1)",
//                     borderWidth: 1,
//                     data: [65, 59, 80, 81, 56, 55, 40],
//                   },
//                   {
//                     label: "Job Interviews",
//                     backgroundColor: "rgba(255, 99, 132, 0.2)",
//                     borderColor: "rgba(255, 99, 132, 1)",
//                     borderWidth: 1,
//                     data: [28, 48, 40, 19, 86, 27, 90],
//                   },
//                 ],
//               }}
//             />
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// }

import { useContext, useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { ThemeContext } from "../App";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const candidatesUrl = import.meta.env.VITE_CANDIDATES_URL;

export default function Dashboard() {
  const { job } = useContext(ThemeContext);

  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const response = await axios.get(candidatesUrl);
    setCandidates(response.data);
  };

  const name = localStorage.getItem("username");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="absolute top-7 right-7 bg-blue-100 p-2 rounded-lg flex gap-2">
          <FaUserAlt className="text-gray-700" />
          {name}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-blue-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Jobs Posted </h3>
          <p className="text-2xl">{job?.length}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Candidates</h3>
          <p className="text-2xl">{candidates?.length}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Jobs</h3>
          <p className="text-2xl">
            {job?.filter((j) => j.job_status === "Active").length}
          </p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Inactive Jobs</h3>
          <p className="text-2xl">
            {job?.filter((j) => j.job_status === "Inactive").length}
          </p>
        </div>
      </div>
    </div>
  );
}
