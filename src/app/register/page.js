"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== cPassword) {
      console.log("Passwords do not match");
      return;
    }
  
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (res.ok) {
      router.push("/login");
    } else {
      const errorData = await res.json();
      console.log(errorData.error);
    }
  };
  

  return (
    <div className="min-h-screen bg-[#F2F7DF] flex p-2 justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-[#1F4C1A] p-6 rounded-lg shadow-md mb-4 flex flex-col justify-between items-center gap-4"
      >
        <h1 className="mb-4 flex w-1/2">
          <img
            src="./logotipo-verde.svg"
            alt="Cashflow Logotipo"
            className="w-full"
          />
        </h1>
        <p className="font-bold">Regístrate en Cashflow</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-xl p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-xl p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={cPassword}
          onChange={(e) => setCPassword(e.target.value)}
          className="border rounded-xl p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-[#1F4C1A] w-full text-[#F2F7DF] font-bold px-4 py-4 rounded-xl"
        >
          Registrarte
        </button>
        <p>
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="underline font-semibold">
            Inicia Sesión
          </a>
        </p>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })} // Redirects to homepage after login
          className="text-gray-800 w-full bg-white font-bold px-4 py-4 rounded-xl border-slate-400 border flex items-center gap-4"
        >
          <span className="text-xl">
            <FaGoogle />
          </span>{" "}
          Regístrate con Google
        </button>
      </form>
    </div>
  );
}