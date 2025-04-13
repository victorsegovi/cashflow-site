"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBars } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Preventa() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

  const handleClickCart = () => {
    router.push("/cart");
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phone) {
      return;
    }
    if (phone.length >= 7 && phone.length <= 15 && /^[0-9]+$/.test(phone)) {
      const response = await fetch('../../api/update-phone', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email, phone })
      })
      if (response.ok) {
        router.push('/')
        console.log('Datos guardados correctamente');
      } else {
        console.log('Hubo un error al guardar los datos');
      }
    }
  }

  if (session) {
    if (loading) {
      return (
        <div className="w-full min-h-screen bg-[#F2F7DF] flex justify-center items-center">
          <Image
            src={`/icono_verde_svg.svg`}
            width={100}
            height={100}
            alt="Icono Cashflow"
            className="animate-spin"
          />
        </div>
      );
    } else {
      return (
        <div className="bg-[#F2F7DF] h-screen flex flex-col items-center" style={{ fontFamily: 'var(--font-red-hat-text)' }}>
          <div className="bg-[#F2F7DF] sticky top-0 z-[1000] w-full flex items-center justify-center flex-col mb-10">
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
                onClick={()=>router.push('/')}
              />
                <BsCart2
                  className="text-[#EE6055] text-2xl 2xl:text-4xl cursor-pointer"
                  onClick={handleClickCart}
                />
              <div
                className={`absolute left-0 p-4 w-full h-screen bg-[#F2F7DF] transition-all duration-1000 flex flex-col items-center justify-center gap-4 ${
                  menuOpen ? "top-0" : "-top-[400vh]"
                }`}
              >
                <Link href={"/"} className="text-[#1F4C1A]">
                  Inicio
                </Link>
                <button onClick={() => signOut()} className="text-[#1F4C1A]">
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
          <form className="bg-white text-[#1F4C1A] px-6 py-10 rounded-lg shadow-md mb-4 flex flex-col justify-center items-center gap-6 2xl:scale-150 max-w-[350px]">
          <img
                src="/logotipo-verde.svg"
                width={150}
                height={50}
                className="mb-10"
                alt="Logotipo"
              />
            <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-literata)' }}>No te pierdas de esta oportunidad. Sé de los primeros en probar nuestro bot</h1>
            <input
                    type="text"
                    placeholder="Número de teléfono"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    className="border rounded-xl p-2 w-full"
                  />
            <button onClick={handleSubmit} className="text-[#F2F7DF] bg-[#1F4C1A] text-center font-bold w-full p-2 rounded-lg">¡Mantenme al tanto!</button>
          </form>
        </div>
      );
    }
  }
}
