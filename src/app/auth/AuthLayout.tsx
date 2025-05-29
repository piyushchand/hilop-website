import { useEffect, useState } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OtpForm from "./OtpForm";
import Image from "next/image";
import { motion } from "framer-motion";

export type AuthView = "login" | "signup" | "otp";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const imageGrid = [
  {
    src: "/images/auth/1.jpg",
    alt: "Woman with closed eyes",
    className: "col-span-6",
  },
  {
    src: "/images/auth/2.jpg",
    alt: "Person holding liver graphic",
    className: "col-span-6",
  },
  {
    src: "/images/auth/3.jpg",
    alt: "Elderly couple smiling",
    className: "col-span-4",
  },
  {
    src: "/images/auth/4.jpg",
    alt: "Woman showing loose jeans",
    className: "col-span-8",
  },
  { src: "/images/auth/5.jpg", alt: "Couple in bed", className: "col-span-8" },
  {
    src: "/images/auth/6.jpg",
    alt: "Couple kissing in bed",
    className: "col-span-4",
  },
];
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<AuthView>("login");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
  <div className="fixed top-0 right-0 w-full max-h-screen z-50">
  </div>
)}

      {/* Off-canvas panel */}
      <div
  className={`fixed top-0 right-0 w-full max-h-screen z-50 ${
    isOpen ? "block" : "hidden"
  }`}
>
        <div className="relative grid w-full grid-cols-1 lg:grid-cols-2 bg-white h-screen max-h-screen overflow-y-auto">
          <motion.button
            className="absolute top-6 right-6 sm:top-12 z-20 sm:right-12 w-12 h-12 text-white hover:text-gray-300 bg-dark rounded-full flex justify-center items-center"
            onClick={onClose}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ rotate: 90 }}
          >
            <X size={32} />
          </motion.button>
          <div className="bg-green-100 h-full w-full sm:p-12 p-6 flex flex-col justify-between">
            {/* Close button */}

            {/* Auth views */}
            {view === "login" && <LoginForm setView={setView} />}
            {view === "signup" && <SignupForm setView={setView} />}
            {view === "otp" && <OtpForm setView={setView} />}
          </div>
          <div className="relative hidden h-full w-full items-center justify-center lg:flex">
            <motion.div
              key={isOpen ? "open" : "closed"}
              className="grid grid-cols-12 gap-4 w-full overflow-hidden h-screen p-4"
              variants={container}
              initial="hidden"
              animate={isOpen ? "show" : "hidden"}
            >
              {imageGrid.map((image, index) => (
                <motion.div
                  key={index}
                  className={`relative rounded-lg overflow-hidden ${image.className}`}
                  variants={item}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
