import React, { useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Form validation
    if (!fullName) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Log the request being sent
      console.log("Sending registration request:", {
        fullName,
        email,
        password: "***", // Don't log actual password
      });

      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      console.log("Response status:", response.status);

      // Handle non-JSON responses
      let data;
      try {
        const responseText = await response.text();
        console.log("Response text:", responseText);

        // Try to parse as JSON if possible
        if (responseText) {
          try {
            data = JSON.parse(responseText);
          } catch (e) {
            console.error("Failed to parse response as JSON:", e);
            data = { message: responseText };
          }
        } else {
          data = { message: "Empty response from server" };
        }
      } catch (err) {
        console.error("Error reading response:", err);
        throw err;
      }

      if (!response.ok) {
        setError(
          data.message || `Error: ${response.status} ${response.statusText}`
        );
        return;
      }

      console.log("Signup success:", data);
      // Show success message before redirecting
      setError(null);
      alert("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(`Connection error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label='Full Name'
              type='text'
              placeholder='Full Name'
              required
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label='Email Address'
              type='email'
              placeholder='student@example.com'
              required
            />
            <div className='col-span-2'>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label='Password'
                type='password'
                placeholder='Min 8 Characters'
                required
                minLength={8}
              />
            </div>
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary' disabled={isLoading}>
            {isLoading ? "SIGNING UP..." : "SIGN UP"}
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <Link className='font-medium text-primary underline' to='/login'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
