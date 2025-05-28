

interface Props {
    setView: (view: 'login' | 'signup' | 'otp') => void;
  }
  export default function SignupForm({ setView }: Props) {
  return (
   <>
    <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
      <p className="text-sm mb-4 text-gray-500">Let’s get you logged in.</p>
      {/* Input + T&C */}
      <input type="tel" placeholder="Mobile number" className="w-full p-3 border rounded mb-2" />
      <label className="text-sm flex items-center mb-4">
        <input type="checkbox" className="mr-2" />
        By registering, you agree to our <span className="underline mx-1">Terms</span> & <span className="underline ml-1">Privacy</span>.
      </label>
      <button className="bg-black text-white w-full py-2 rounded">Get OTP</button>
      <div className="text-center text-sm my-4">Or login with</div>
      {/* Google/Facebook buttons here */}
      <p className="text-sm mt-4 text-center">
        Don’t have an account yet?{" "}
        <button className="text-green-700 font-semibold underline" onClick={() => setView('login')}>
          Log in
        </button>
      </p></>
  );
}
