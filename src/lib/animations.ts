import { Transition, Variants } from "motion/react"

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
}

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
}

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
}

export const scaleHoverTap = {
    hidden: {},
    visible: {},
    hover: { scale: 1.02 },
    tap: { scale: 0.96 },
}

export const springSnappy: Transition = {
    type: "spring",
    stiffness: 320,
    damping: 26,
    mass: 0.35,
};

export const springSmooth: Transition = {
    type: "spring",
    stiffness: 140,
    damping: 24,
    mass: 0.55,
};