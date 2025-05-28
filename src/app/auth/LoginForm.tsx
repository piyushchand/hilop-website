import Button from "@/components/uiFramework/Button";
import Image from "next/image";
import Link from "next/link";

interface Props {
  setView: (view: "login" | "signup" | "otp") => void;
}
export default function LoginForm({ setView }: Props) {
  return (
    <>
      <Link href="/">
        <Image src="/logo.svg" alt="Hilop logo" width={100} height={40} />
      </Link>
      <div className="max-w-[495px] mx-auto">
        <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
        <p className="font-medium mb-6 text-gray-600">
          Let’s get you logged in.
        </p>
        {/* Input + T&C */}
        <input
          type="tel"
          placeholder="Mobile number"
          className="w-full p-3 border rounded mb-2"
        />
        <label className="text-sm flex items-center mb-4">
          <input type="checkbox" className="mr-2" />
          By registering, you agree to our{" "}
          <span className="underline mx-1">Terms</span> &{" "}
          <span className="underline ml-1">Privacy</span>.
        </label>
        <Button
          label="Get OTP"
          variant="btn-dark"
          size="xl"
          className="w-full"
          link="/"
        />
        <div className="text-center text-sm my-4">Or login with</div>
        <div className="flex gap-4">
          <Button
            label="Google"
            variant="btn-secondary"
            size="xl"
            className="w-full"
            link="/"
          />
          <Button
            label="Facebook"
            variant="btn-secondary"
            size="xl"
            className="w-full"
            link="/"
          />
        </div>
      </div>
      <p className="text-sm mt-4 text-center text-gray-600 font-medium">
        Do not have an account yet?{' '}
        <span
          className="hover:underline text-green-800 font-semibold cursor-pointer"
          onClick={() => setView("signup")}
        >
          Sign up for free
        </span>
      </p>
    </>
  );
}
