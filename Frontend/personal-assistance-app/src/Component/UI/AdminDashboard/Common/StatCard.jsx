import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-90  shadow-lg rounded-xl border border-gray-700 p-6"
      whileHover={{ y: -5, boxShadow: "0 50px 50px -12px rgba(0, 0, 0, 0.5)" }}
    >
      <div className="flex flex-col size-full  flex-nowrap">
        <span className="flex items-center text-sm font-medium text-gray-300 mb-2 ">
          <Icon size={50} className="mr-2" style={{ color }} />
          {name}
        </span>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
    </motion.div>
  );
};
export default StatCard;
