import type { Transition, Variants } from "motion/react";
export const springT: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 24,
};

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springT,
  },
  exit: {
    opacity: 0,
    scale: 0.86,
    transition: { duration: 0.12 },
  },
};