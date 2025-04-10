"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log(result);

    if (result?.error) {
      alert("Correo o contraseña incorrectos");
    } else {
      router.push("/"); // Redirige al usuario a la página principal después de un inicio de sesión exitoso
    }
  };

  useEffect(()=>{
    setTimeout(setLoading(false),1000)
  })

  if(loading){
    return(
      <div className="w-full min-h-screen bg-[#F2F7DF] flex justify-center items-center">
      <Image
        src={`/icono_verde_svg.svg`}
        width={100}
        height={100}
        alt="Icono Cashflow"
        className="animate-spin"
      />
    </div>
    )
  }else{
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
          <p className="font-bold">Inicia Sesión en Cashflow</p>
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
          <button
            type="submit"
            className="bg-[#1F4C1A] w-full text-[#F2F7DF] font-bold px-4 py-4 rounded-xl"
          >
            Iniciar Sesión
          </button>
          <p>
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="underline font-semibold">
              Regístrate
            </a>
          </p>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })} // Redirige al usuario a la página principal después de un inicio de sesión exitoso
            className="text-gray-800 w-full bg-white font-bold px-4 py-4 rounded-xl border-slate-400 border flex items-center gap-4"
          >
            <span className="text-xl">
              <FaGoogle />
            </span>{" "}
            Continuar con Google
          </button>
        </form>
      </div>
    );
  }
}
