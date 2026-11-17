// src/auth/Auth.tsx
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthProps {
  onLogin: (user: any) => void; // callback to notify App of login/signup
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <div className="flex justify-between mb-6">
          <button
            className={`px-4 py-2 rounded ${
              isLogin ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${
              !isLogin ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        {isLogin ? <LoginForm onLogin={onLogin} /> : <SignupForm onLogin={onLogin} />}
      </div>
    </div>
  );
};

export default Auth;
