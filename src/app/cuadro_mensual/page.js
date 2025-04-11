"use client";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CuadroMensual() {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    const downloadFile = async () => {
      // Crear URL de descarga y forzar descarga
      const url =
        "https://endywgnafozbihskobxa.supabase.co/storage/v1/object/public/mensual//freemium.xlsx";
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

  if (session) {
    return (
      <div
        className="min-h-screen bg-[#F2F7DF] text-[#1F4C1A] flex flex-col"
        style={{ fontFamily: "var(--font-red-hat-text)" }}
      >
        <div className="bg-[#F2F7DF] sticky top-0 z-[1000] w-full flex items-center justify-center flex-col">
          <div className="flex justify-between items-center p-4 bg-[#f2f7df] max-w-[2000px] w-full 2xl:text-4xl 2xl:p-16">
            <FaBars
              className="text-[#EE6055] text-2xl 2xl:text-4xl cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            <img
              src="/logotipo-verde.svg"
              width={150}
              height={50}
              className="2xl:w-[300px]"
              alt="Logotipo"
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              }}
            />
            <BsCart2
              className="text-[#EE6055] text-2xl 2xl:text-4xl cursor-pointer"
              onClick={() => {
                router.push("../cart");
              }}
            />

            <div
              className={`absolute left-0 p-4 w-full h-screen bg-[#F2F7DF] transition-all duration-1000 flex flex-col gap-4 items-center justify-center ${
                menuOpen ? "top-0" : "-top-[400vh]"
              }`}
            >
              <Link href={"/"} className="text-[#1F4C1A]">
                Inicio
              </Link>
              <button
                onClick={() => {
                  router.push("/");
                  signOut();
                }}
              >
                Cerrar Sesión
              </button>
              <button
                className="text-[#EE6055] text-5xl 2xl:text-8xl absolute top-2 right-4 2xl:top-16 2xl:right-16"
                onClick={() => setMenuOpen(false)}
              >
                &times;
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 h-full flex flex-col justify-around gap-4 w-full items-center lg:flex-row-reverse 2xl:self-center">
          <img
            src="./thumb-up.png"
            alt="Pulgar arriba, color verde"
            className="w-1/2 max-w-[300px] self-center 2xl:max-w-[500px]"
          />
          <div className="lg:w-[400px] 2xl:w-[800px]">
            <h1
              style={{ fontFamily: "var(--font-literata)" }}
              className="font-bold text-2xl lg:text-4xl 2xl:text-6xl 2xl:mb-10"
            >
              ¡Gracias por descargar nuestro cuadro mensual!
            </h1>
            <p className="lg:text-xl 2xl:text-4xl">
              Este es el primer paso a una vida financiera más estable,
              esperamos lo disfrutes.
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return;
  }
}
