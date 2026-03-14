import { motion } from "framer-motion";

const SuccessJob = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        className="flex flex-col gap-4 items-center justify-center bg-red-500 p-8 shadow-lg rounded-lg border border-gray-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-semibold text-green-600"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Job Applied Successfully!
        </motion.h1>
        <motion.p
          className=" text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Thank you for applying. We will review your application and get back
          to you soon.
        </motion.p>
        <motion.a
          href="/"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <button className="mt-4 px-6 py-2 rounded-lg bg-green-600 bg-black text-white hover:bg-green-700 transition duration-300">
            Back to Home
          </button>
        </motion.a>
      </motion.div>
    </div>
  );
};

export default SuccessJob;
