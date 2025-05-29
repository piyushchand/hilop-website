import AnimatedInput from "@/components/animationComponents/AnimatedInput";
import Button from "@/components/uiFramework/Button";
import Image from "next/image";
import Link from "next/link";

interface Props {
  setView: (view: "login" | "signup" | "otp") => void;
}
export default function LoginForm({ setView }: Props) {
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
        <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
        <p className="font-medium mb-6 text-gray-600">
          Let’s get you logged in.
        </p>
        {/* Input + T&C */}
        <form onSubmit={handleSubmit}>
          {/* Input with initial content (like "Rogie") */}
          <AnimatedInput
            label="Mobile number"
            name="Mobile number"
            type="tel"
            required
          />
        <div  onClick={() => setView("otp")}> <Button
            label="Get OTP"
            variant="btn-dark"
            size="xl"
            className="w-full mt-6"
            link="/"
          /></div> 
        </form>
        <div className="text-center text-sm my-4">Or login with</div>
        <div className="flex gap-4">
          <button className="text-lg py-3 px-6 w-full bg-white border hover:text-dark hover:border-green-400 hover:bg-gray-100 transition-all duration-300 border-gray-200 text-gray-600 rounded-full flex items-center justify-center gap-2.5">
            <Image
              src="/images/icon/google.svg"
              width={22}
              height={22}
              alt="google icons"
            />{" "}
            Google
          </button>
          <button className="text-lg py-3 px-6 w-full bg-white border hover:text-dark hover:border-green-400 hover:bg-gray-100 transition-all duration-300 border-gray-200 text-gray-600 rounded-full flex items-center justify-center gap-2.5">
            <Image
              src="/images/icon/facebook.svg"
              width={22}
              height={22}
              alt="facebook icons"
            />{" "}
            Facebook
          </button>
        </div>
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
