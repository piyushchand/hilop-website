import AnimatedInput from "@/components/animationComponents/AnimatedInput";
import Button from "@/components/uiFramework/Button";
import Image from "next/image";
import Link from "next/link";

interface Props {
  setView: (view: "login" | "signup" | "otp") => void;
}
export default function SignupForm({ setView }: Props) {
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
        <h2 className="text-3xl font-semibold mb-2">Register</h2>
        <p className="font-medium mb-6 text-gray-600">Create your account</p>
        {/* Input + T&C */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5 mb-6">
            <AnimatedInput
              label="Full Name"
              name="fullName"
              type="text"
              // value="Rogie"
              required
            />

            <AnimatedInput label="Email" name="email" type="email" required />
            <AnimatedInput
              label="Mobile number"
              name="Mobile number"
              type="tel"
              required
            />
            <AnimatedInput
              label="Date of Birth"
              name="Date of Birth"
              type="date"
              required
            />
          </div>
          <label className="mb-4 flex cursor-pointer items-start">
            <input
              type="checkbox"
              className="mr-2 accent-primary size-5 mt-0.5"
            />
            <span className="text-sm text-gray-600 font-medium">
              By registering, you agree to our
              <span className="underline mx-1 text-dark hover:underline">
                Terms & Conditions
              </span>
              &
              <span className="underline mx-1 text-dark hover:underline">
                Privacy Policy.
              </span>
            </span>
          </label>
          <Button
            label="Register"
            variant="btn-dark"
            size="xl"
            className="w-full"
            link="/"
          />
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
      <p className="text-sm mt-4 text-center">
        Don’t have an account yet?{" "}
        <button
          className="text-green-700 font-semibold underline"
          onClick={() => setView("login")}
        >
          Log in
        </button>
      </p>
    </>
  );
}
