"use client";
import { useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "../utils/api";

// Register function using Axios
const registerUser = async (userData) => {
  const response = await api.post("/api/users", {
    email: userData.email,
    password: userData.password,
    displayName: userData.name,
  });

  return response.data;
};

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Define the mutation
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("Registration successful! Redirecting...");

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.accessToken); // Store the access token
        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          displayName: data.user.displayName,
          email: data.user.email,
        })); // Store user details
      }

      setTimeout(() => {
        router.push("/dashboard"); // Redirect to dashboard after successful registration
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-4xl font-black leading-9 tracking-tight">
            Create your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Name"
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
            />

            <InputField
              label="Email address"
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
            />

            <InputField
              label="Password"
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="new-password"
            />

            <div className="font-black flex justify-center">
              <Button type="submit" variant="secondary" disabled={mutation.isPending}>
                {mutation.isPending ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}