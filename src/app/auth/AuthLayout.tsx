import { useEffect, useState } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OtpForm from "./OtpForm";

export type AuthView = 'login' | 'signup' | 'otp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<AuthView>('login');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
    {/* Backdrop */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40"
        onClick={onClose}
      />
    )}

    {/* Off-canvas panel */}
    <div
      className={`fixed top-0 right-0 w-full h-full z-50 transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="relative grid h-screen w-full grid-cols-1 lg:grid-cols-2 bg-white">
      <div className="bg-green-100 h-full w-full p-12 flex flex-col justify-between">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-black "
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Auth views */}
          {view === "login" && <LoginForm setView={setView} />}
          {view === "signup" && <SignupForm setView={setView} />}
          {view === "otp" && <OtpForm setView={setView} />}
        </div>
        <div className="relative hidden h-full w-full items-center justify-center lg:flex">
        <button
            className="absolute top-4 right-4 text-gray-600 hover:text-black"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
          
        </div>  
      </div>
    </div>
  </>
  );
}
