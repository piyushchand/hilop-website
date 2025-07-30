import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string; // <-- add optional className prop
};

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { opacity: 0, y: "-50%", scale: 0.95 },
  visible: { opacity: 1, y: "0", scale: 1 },
};

export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0  flex items-center justify-center z-80 bg-black/50 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
          exit={{ opacity: 0 }}
          variants={backdrop}
          onClick={onClose}
        >
          <motion.div
            className={`bg-white w-full relative ${className}`} // <-- add className here
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
            <motion.button
              className="absolute top-5 right-5 z-20 bg-dark rounded-xl cursor-pointer"
              onClick={onClose}
            >
              <motion.div
                className="size-8 p-1 md:size-12 flex justify-center items-center text-white hover:text-gray-300"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ rotate: 90 }}
              >
                <X size={32} />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
