import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/router";
import Alert from "@/app/components/alert";


const LoginPage = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const [alertType, setAlertType] = useState<"warning" | "success" | "error">(
    "error"
  );
  const router = useRouter();
  const { redirect } = router.query;

  const handleClose = () => {
    setShowAlert(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisabledButton(true);
    console.log(username);
    console.log(password);
    
    
    if (!username || !password) {
      setAlertMessage("Please enter both email and password.");
      setAlertType("warning");
      setShowAlert(true);
      setDisabledButton(false);
      return;
    }
    
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    console.log(result);
    
    if (result?.error) {
      setAlertMessage("Email or Passoword is wrong");
      setAlertType("warning");
      setShowAlert(true);
      setDisabledButton(false);
    } else {
      setAlertMessage("Login successful!");
      setAlertType("success");
      setShowAlert(true);
      setTimeout(() => {
        router.push(redirect ? decodeURIComponent(redirect as string) : "/dashboard");
      }, 1000);
    }
  };

  return (
    <>
      <NextSeo
        title="PORTAL TECH SUPPORT | Login"
        description="Welcome to IT TECH PORTAL. Sign in to access your dashboard."
        openGraph={{
          title: "PORTAL TECH SUPPORT | Login",
          description: "Welcome to IT TECH PORTAL. Sign in to access your dashboard.",
          url: "http://10.100.101.200:3030/login",
        }}
      />
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-200 to-blue-500">
        {/* Container */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md relative">
          {/* Header Section */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Selamat Datang!</h2>
            <p className="text-sm text-gray-500">
              Sign in untuk dapat akses dan masuk ke dalam dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-600 mb-1"
                htmlFor="email"
              >
                Username
              </label>
              <input
                id="email"
                type="text"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-[#00ADEF] focus:outline-none"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-600 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-3 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-[#00ADEF] focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              disabled={disabledButton}
              type="submit"
              className={`w-full py-3 mt-2 text-white font-medium rounded-md transition duration-300 ${
                disabledButton
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#00ADEF] hover:bg-[#053F74] shadow-md"
              }`}
            >
              {disabledButton ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Footer Section */}
          <div className="text-center mt-4 text-gray-500 text-sm">
            <p>
              Hubungi Kami{" "}
              <a
                href="https://wa.link/p6n3nx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ADEF] hover:underline font-medium"
              >
                Contact
              </a>
            </p>
          </div>

          {/* Alert Component */}
          {showAlert && (
            <div className="absolute top-2 w-full">
              <Alert
                message={alertMessage}
                type={alertType}
                onClose={handleClose}
                time={2}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
