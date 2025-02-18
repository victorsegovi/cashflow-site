"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBars } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import {signOut} from "next-auth/react"
import {useRouter} from "next/navigation"


export default function CuadroMensual() {
  const router = useRouter()
  useEffect(() => {
    const downloadFile = async () => {

      // Crear URL de descarga y forzar descarga
      const url = "https://endywgnafozbihskobxa.supabase.co/storage/v1/object/public/mensual//freemium.xlsx";
      const a = document.createElement("a");
      a.href = url;
      a.download = "freemium.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    downloadFile();
  }, []);


  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      className="w-screen min-h-screen bg-[#F2F7DF] text-[#1F4C1A]"
      style={{ fontFamily: "var(--font-red-hat-text)" }}
    >
      <div className="bg-[#F2F7DF] sticky top-0 z-[1000]">
        <header className="bg-[#EE6055] text-[#F2F7DF] text-center p-2 text-sm font-bold rounded-b-3xl">
          Te quedan solo 00:00 minutos para aprovechar nuestra gran oferta
        </header>

        <div className="flex justify-between items-center p-4 bg-[#f2f7df]">
          <FaBars
            className="text-[#EE6055] text-2xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          <Image
            src="/logotipo-verde.svg"
            width={150}
            height={50}
            alt="Logotipo"
            onClick={() => {
              window.open("/", "_self");
            }}
          />
          <BsCart2 className="text-[#EE6055] text-2xl" />

          <div
            className={`absolute left-0 p-4 w-full h-screen bg-[#F2F7DF] transition-all duration-1000 ${
              menuOpen ? "top-0" : "-top-[400vh]"
            }`}
          >
            <button onClick={() =>{
              router.push('/')
              signOut()
            }}>Cerrar Sesión</button>
            <button
              className="text-[#EE6055] text-5xl absolute top-2 right-4"
              onClick={() => setMenuOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 h-full flex flex-col justify-center gap-4">
        <img
          src="./thumb-up.png"
          alt="Pulgar arriba, color verde"
          className="w-1/2 self-center"
        />
        <h1
          style={{ fontFamily: "var(--font-literata)" }}
          className="font-bold text-2xl"
        >
          ¡Gracias por descargar nuestro cuadro mensual!
        </h1>
        <p>
          Este es el primer paso a una vida financiera más estable, esperamos lo
          disfrutes.
        </p>
      </div>
    </div>
  );
}
