
import OTPInput from "@/components/animationComponents/OTPInput";
import Button from "@/components/uiFramework/Button";
import Image from "next/image";
import Link from "next/link";

interface Props {
  setView: (view: "login" | "signup" | "otp") => void;
}

export default function OtpForm({ setView }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted!");
    // You'd typically access form values from state here
  };
  return (
    <>
      <Link href="/">
        <Image src="/logo.svg" alt="Hilop logo" width={100} height={40} />
      </Link>
      <div className="xl:w-[495px] mx-auto lg:w-full md:w-[495px] min-w-auto">
        <h2 className="text-3xl font-semibold mb-2">OTP Verification</h2>
        <p className="font-medium mb-6 text-gray-600">
        We have sent an OTP code to your phone number.
        </p>
        {/* Input + T&C */}
        <form onSubmit={handleSubmit}>
           <OTPInput />
          <p className="mb-6 text-sm mt-4 text-center">00:120 sec</p>
          <p className="text-gray-600 text-sm">Don’t receive code ? <span className="text-dark font-semibold">Re-send</span></p>
          <div onClick={() => setView("otp")}>
            {" "}
            <Button
              label="Submit"
              variant="btn-dark"
              size="xl"
              className="w-full mt-6"
              link="/"
            />
          </div>
        </form>
      </div>
      <div>
        <p className="text-sm mt-4 text-center text-gray-600 font-medium">
          Do not have an account yet?{" "}
          <span
            className="hover:underline text-green-800 font-semibold cursor-pointer"
            onClick={() => setView("signup")}
          >
            Sign up for free
          </span>
        </p>
      </div>
    </>
  );
}
