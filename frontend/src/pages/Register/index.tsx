/**
 * Register Component
 * @author Sultan Jurabekov
 * @functionality Registration page component that handles:
 * - Multi-step registration form
 * - Email and password validation
 * - OTP verification
 * - Google Sign-in integration
 * - Dark mode support
 * - Form validation and error handling
 * - Responsive design
 * @created February 8, 2024
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaCheck, FaMoon, FaSun } from "react-icons/fa";
import { registerUser, loginWithOtp } from "../../api/auth";
import "./RegistrationForm.css";

// Validation Schema
const schema = yup.object().shape({
  fullname: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .matches(/@(gmail|hotmail|outlook)\.com$/, "Only Gmail, Hotmail, and Outlook are allowed")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

type FormData = yup.InferType<typeof schema>;

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Watch form fields for validation
  const fullname = watch("fullname");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const otp = watch("otp");

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return fullname && !errors.fullname;
      case 2:
        return email && !errors.email;
      case 3:
        return password && !errors.password;
      case 4:
        return confirmPassword && !errors.confirmPassword;
      case 5:
        return otp && !errors.otp;
      default:
        return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      if (!showOtpField) {
        // First step: Register user
        const registrationResult = await registerUser(data.email, data.fullname, data.password);
        
        if (registrationResult?.email) {
          setRegisteredEmail(registrationResult.email);
          setShowOtpField(true);
          setCurrentStep(5);
        } else {
          throw new Error("Registration failed: No email received");
        }
      } else {
        // Second step: Verify OTP
        await loginWithOtp(registeredEmail, data.otp);
        navigate("/dashboard");
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error:', error);
      if (error.message === "User already exists") {
        setError("A user with this email already exists. Please try logging in instead.");
      } else if (error.message.includes("OTP")) {
        setError("Invalid OTP. Please try again.");
      } else {
        setError(`Registration failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const nextStep = () => {
    if (currentStep < 4 && isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1 && !showOtpField) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.classList.toggle("dark-mode", savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  return (
    <div className="registration-container">
      <div className="registration-content">
        <div className="header-container">
          <h1 className="registration-title">Create Account</h1>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
          >
            {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
          </button>
        </div>
        <p className="registration-subtitle">Join our community today</p>

        <div className="progress-container">
          <div className="progress-line" />
          <div
            className="progress-line-filled"
            style={{ width: `${((showOtpField ? 5 : currentStep) / 5) * 100}%` }}
          />
          <div className="progress-steps">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="progress-step-container">
                <div className={`progress-step ${step <= (showOtpField ? 5 : currentStep) ? "filled" : ""}`}>
                  {step <= (showOtpField ? 5 : currentStep) && <FaCheck className="progress-step-icon" />}
                </div>
                <span className="progress-label">
                  {step === 1 && "Name"}
                  {step === 2 && "Email"}
                  {step === 3 && "Password"}
                  {step === 4 && "Confirm"}
                  {step === 5 && "OTP"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          if (showOtpField) {
            handleSubmit(onSubmit)(e);
          }
        }} className="form-container">
          {!showOtpField ? (
            <>
              <div className="form-group" style={{ display: currentStep === 1 ? "block" : "none" }}>
                <label htmlFor="fullname" className="form-label">Full Name</label>
                <input
                  id="fullname"
                  type="text"
                  className={`form-input ${errors.fullname ? "error" : ""}`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  {...register("fullname")}
                />
                {errors.fullname && <p className="error-text">{errors.fullname.message}</p>}
              </div>

              <div className="form-group" style={{ display: currentStep === 2 ? "block" : "none" }}>
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && <p className="error-text">{errors.email.message}</p>}
              </div>

              <div className="form-group" style={{ display: currentStep === 3 ? "block" : "none" }}>
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password && <p className="error-text">{errors.password.message}</p>}
              </div>

              <div className="form-group" style={{ display: currentStep === 4 ? "block" : "none" }}>
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
              </div>
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="otp" className="form-label">Enter OTP</label>
              <input
                id="otp"
                type="text"
                className={`form-input ${errors.otp ? "error" : ""}`}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                {...register("otp")}
              />
              {errors.otp && <p className="error-text">{errors.otp.message}</p>}
              <p className="otp-hint">Please check your email for the OTP code</p>
            </div>
          )}

          <div className="nav-buttons">
            {currentStep > 1 && !showOtpField && (
              <button
                type="button"
                onClick={prevStep}
                className="nav-button back-button"
              >
                Back
              </button>
            )}
            {!showOtpField ? (
              currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="nav-button next-button"
                  disabled={!isCurrentStepValid()}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const formData = getValues();
                    onSubmit(formData);
                  }}
                  className="nav-button next-button"
                  disabled={isLoading || !isCurrentStepValid()}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              )
            ) : (
              <button
                type="submit"
                className="nav-button next-button"
                disabled={isLoading || !isCurrentStepValid()}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            )}
          </div>

          {error && <p className="error-text">{error}</p>}

          {!showOtpField && (
            <>
              <div className="divider">
                <span>or</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="google-signin-button"
              >
                <FcGoogle size={20} />
                Sign in with Google
              </button>

              <p className="login-link">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;