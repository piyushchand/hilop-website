import OTPInput from "@/components/animationComponents/OTPInput";
import Button from "@/components/uiFramework/Button";
import AuthLayout from "../AuthLayout";

export default function OtpPage() {
  return (
    <AuthLayout
    bottomContent={
      <p className="text-sm mt-4 text-center text-gray-600 font-medium">
        {" "}
        Do not have an account yet?{" "}
        <a
          href="/auth/signup"
          className="hover:underline text-green-800 font-semibold cursor-pointer"
        >
          Sign up for free
        </a>
      </p>
    }
    >
      <div className="xl:w-[495px] mx-auto lg:w-full md:w-[495px] min-w-auto">
        <h2 className="text-3xl font-semibold mb-2">OTP Verification</h2>
        <p className="font-medium mb-6 text-gray-600">
          We have sent an OTP code to your phone number.
        </p>
        {/* Input + T&C */}
        <form>
          <OTPInput />
          <p className="mb-6 text-sm mt-4 text-center">00:120 sec</p>
          <p className="text-gray-600 text-sm">
            Don’t receive code ?{" "}
            <span className="text-dark font-semibold">Re-send</span>
          </p>
          <div>
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
    </AuthLayout>
  );
}
