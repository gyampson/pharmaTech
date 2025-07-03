/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const variantsMap = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
};

const MotionReveal = ({
  children,
  type = "fade",
  delay = 0,
  duration = 0.8,
  className = "",
}) => {
  const variants = variantsMap[type] || variantsMap.fade;

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      transition={{ delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MotionReveal;
