"use client";
import { useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "../utils/api";
import Image from "next/image";

// Login function outside the component
const loginUser = async (userData) => {
  const response = await api.post("/login", {
    email: userData.email,
    password: userData.password,
  });

  if (!response.data) {
    throw new Error("Login fehlgeschlagen!");
  }

  return response.data;
};

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('Login response:', data)
      toast.success("Login erfolgreich! Sie werden weitergeleitet.");

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.accessToken); 
        localStorage.setItem("user", JSON.stringify({
          name: data.displayName,
          email: data.email,
          id: data.id,
        }));
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Login fehlgeschlagen! Bitte überprüfen Sie Ihre Eingaben.");
    },
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    mutation.mutate(formData);
  }

  return (
    <div className="flex flex-col items-center justify-top md:justify-center min-h-screen">
      <div className="fixed left-2 md:left-10 xl:left-25 bottom-0 block">
                    <Image
                      src="/misc/dog.png"
                      alt="Dog illustration"
                      width={140}
                      height={400}
                      className="md:w-[220px] xl:w-[240px]"
                      priority
                    />
                  </div>
      <div className="flex px-6 lg:px-8 flex-col justify-center">
        <div className="grid">
          <h2 className="mt-10 mx-auto text-center text-4xl/9 font-bold tracking-tight max-w-[70%] sm:max-w-none ">
            In Ihrem Konto anmelden.
          </h2>
        </div>

        <div className="flex flex-col mt-10 ">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Email address"
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="Geben Sie Ihre E-Mail-Adresse ein"
            />

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Passwort
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Passwort vergessen?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <InputField
                  label=""
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Geben Sie Ihr Passwort ein"
                />
              </div>
            </div>

            <div className="font-black grid w-66 mx-auto">
              <Button
                type="submit"
                variant="secondary"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Anmeldung..." : "Anmelden"}
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Kein Nutzer?{" "}
            <a
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Registriere dich hier
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}