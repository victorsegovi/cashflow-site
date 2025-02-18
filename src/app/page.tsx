"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBars } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";



export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [phone, setPhone] = useState("")
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const router = useRouter()
  const [orderId, setOrderID] = useState('')

  const createOrder = async () => {
    const response = await fetch("/api/paypal/place_order", { method: "POST",});
    const data = await response.json();
    setOrderID(data.id);
  };

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session])

  const handleSubmit = async () => {
    if (!phone) {
      return;
    }

    if (phone.length >= 7 && phone.length <= 15 && /^[0-9]+$/.test(phone)) {
      const response = await fetch('/api/update-phone', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, phone })
      })

      if (response.ok) {
        router.push('/cuadro_mensual')
        console.log('Datos guardados correctamente');
      } else {
        console.log('Hubo un error al guardar los datos');
      }

    }

  }

  if (session) {
    return (
      <div className="bg-[#F2F7DF] flex flex-col items-center lg:flex-row lg:flex-wrap" style={{ fontFamily: 'var(--font-red-hat-text)' }}>

        <div className="bg-[#F2F7DF] sticky top-0 z-[1000] w-full">
          <header className="bg-[#EE6055] text-[#F2F7DF] text-center p-2 text-sm font-bold rounded-b-3xl">
            Te quedan solo 00:00 minutos para aprovechar nuestra gran oferta
          </header>

          <div className="flex justify-between items-center p-4 bg-[#f2f7df]">
            <FaBars className="text-[#EE6055] text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
            <Image src="/logotipo-verde.svg" width={150} height={50} alt="Logotipo" onClick={() => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
              })
            }}  className="cursor-pointer"/>
            <BsCart2 className="text-[#EE6055] text-2xl cursor-pointer" onClick={()=> router.push('/cart')}/>

            <div className={`absolute left-0 p-4 w-full h-screen bg-[#F2F7DF] transition-all duration-1000 ${menuOpen ? "top-0" : "-top-[400vh]"}`}>
              <button onClick={() => signOut()} className="text-[#1F4C1A]">Cerrar Sesión</button>
              <button className="text-[#EE6055] text-5xl absolute top-2 right-4" onClick={() => setMenuOpen(false)}>&times;</button>
            </div>
          </div>
        </div>

        <section className="text-center py-4 rounded-lg mx-4 w-full">
          <p className="text-[#EE6055] font-light">Afirmación del día:</p>
          <h3 className="text-[#EE6055] font-bold text-sm p-4 border-[#EE6055] border-2 rounded-full w-2/3 justify-self-center">Tomo pequeñas decisiones hoy, para grandes resultados mañana</h3>
        </section>

        <section className="bg-[#1F4C1A] text-[#F2F7DF] rounded-3xl p-6 mx-4 my-6 max-w-[400px] relative overflow-hidden hover:scale-105 transition-all duration-700 lg:h-[690px] lg:flex lg:flex-col">
          <div className={`modal text-[#F2F7DF] absolute transition-all duration-[1500ms] z-10 w-full h-full bg-[#1F4C1A] top-0 rounded-3xl ${isModalOpen ? "left-0" : "left-full"}`}>
            <div className="modal-content flex flex-col justify-center items-center w-full h-full p-4 gap-4">
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-literata)' }}>Ingresa tu número de teléfono</h2>
              <input
                type="text"
                placeholder="Número de teléfono"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                className="border rounded-xl p-2 w-full text-[#1F4C1A]"
              />
              <button onClick={handleSubmit} className="bg-[#F2F7DF] text-[#1F4C1A] text-center font-bold w-full p-2 rounded-lg">Obtener Cuadro Mensual</button>
              <button onClick={() => setIsModalOpen(false)} className="text-[#F2F7DF] font-bold border border-[#F2F7DF] rounded-lg w-full p-2">Cerrar</button>
            </div>
          </div>
          <img src="./cuadro-mensual.jpg" className="rounded-3xl mb-4" />
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-literata)' }}>Cuadro Mensual</h2>
          <p className="mt-2"><del className="text-gray-400">$5.00</del> <strong className="text-[#F2F7DF]">Precio ahora: GRATIS!</strong></p>
          <ul className="list-disc ml-6 mt-4">
            <li>Presupuesto Mensual</li>
            <li>Clasificación de Gastos</li>
            <li>Gráficas y Plan de Ahorro Mensual</li>
            <li>Gráficas y Sumatorias en tiempo real</li>
            <li>Sumatoria de Cuentas y Categorías</li>
            <li className="font-bold">Descuento para el resto de productos Cashflow</li>
          </ul>
          <button className="bg-[#F2F7DF] text-[#1F4C1A] font-bold py-3 px-4 rounded-xl  mt-4 w-full" onClick={() => setIsModalOpen(true)}>¡Me lo llevo!</button>
        </section>

        <section className="bg-[#1F4C1A] text-[#F2F7DF] rounded-3xl p-6 mx-4 my-6 max-w-[400px] hover:scale-105 transition-all duration-700 lg:h-[690px] lg:flex lg:flex-col">
          <img src="./cuadro-anual.jpg" className="rounded-3xl mb-4 border" />
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-literata)' }}>Cuadro Anual</h2>
          <p className="mt-2"><del className="text-gray-400">$10.00</del> <strong className="text-[#F2F7DF]">Precio ahora: $5.00</strong></p>
          <ul className="list-disc ml-6 mt-4">
            <li>Presupuesto Mensual</li>
            <li>Clasificación de Gastos</li>
            <li>Gráficas y Plan de Ahorro Mensual</li>
            <li>Gráficas y Sumatorias en tiempo real</li>
            <li>Sumatorias de Cuentas y Categorías</li>
            <li className="font-bold">Gráficas de clasificación mensual y anual</li>
            <li className="font-bold">Afirmaciones mensuales</li>
            <li className="font-bold">Plan de ahorro modificable</li>
            <li className="font-bold">Plan de ahorro de emergencia</li>
            <li className="font-bold">Plan de ahorro general</li>
            <li className="font-bold">Calculadora de montos de libre uso</li>
            <li className="font-bold">Calculadora de sistema cambiario</li>
          </ul>
          <button className="bg-[#F2F7DF] text-[#1F4C1A] font-bold py-3 px-4 rounded-xl  mt-4 w-full" onClick={createOrder}>¡Me lo llevo!</button>
        </section>

        <section className="bg-[#1F4C1A] text-[#F2F7DF] rounded-3xl p-6 mx-4 my-6 max-w-[400px] hover:scale-105 transition-all duration-700 lg:h-[690px] lg:flex lg:flex-col">
          <img src="./chatbot.jpg" className="rounded-3xl mb-4 border" />
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-literata)' }}>Chatbot Cashflow</h2>
          <ul className="list-disc ml-6 mt-4">
            <li>Incluye el Cuadro Anual Premium</li>
            <li>Presupuesto Mensual</li>
            <li>Clasificación de Gastos</li>
            <li>Gráficas y Plan de Ahorro Mensual</li>
            <li>Gráficas y Sumatorias en tiempo real</li>
            <li>Sumatorias de Cuentas y Categorías</li>
            <li className="font-bold">Gráficas de clasificación mensual y anual</li>
            <li className="font-bold">Afirmaciones mensuales</li>
            <li className="font-bold">Plan de ahorro modificable</li>
            <li className="font-bold">Plan de ahorro de emergencia</li>
            <li className="font-bold">Plan de ahorro general</li>
            <li className="font-bold">Calculadora de montos de libre uso</li>
            <li className="font-bold">Calculadora de sistema cambiario</li>
          </ul>
          <button className="bg-[#F2F7DF] text-[#1F4C1A] font-bold py-3 px-4 rounded-xl mt-4 w-full">¡Preventa!</button>
        </section>

        <section className="bg-[#D0E562] text-[#14280C] p-6 mt-6 rounded-t-[7rem] flex flex-col">
          <img src="./asset-phone.png" className="max-w-[200px] self-center" />
          <h2 className="text-2xl font-bold text-[#1F4C1A] italic" style={{ fontFamily: 'var(--font-literata)' }}>¡Próximamente!</h2>
          <p className="mt-2">Imagina que nos escribes por <strong>Whatsapp </strong>
            y nosotros nos encargamos de <strong>actualizar tu tabla. </strong>
            Actualizamos tus ingresos, tus gastos,
            los clasificamos y te damos <strong>resúmenes
              mensuales</strong> vía Whatsapp.<br /><br />
            Olvídate de abrir un archivo de Drive o un Excell.
            <strong> Nosotros nos encargamos con nuestro Chatbot.</strong></p>
          <button className="bg-[#14280C] w-full text-[#F2F7DF] font-bold py-3 px-4 rounded-lg mt-4">¡Preventa!</button>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#F2F7DF] flex flex-col items-center lg:flex-row lg:flex-wrap" style={{ fontFamily: 'var(--font-red-hat-text)' }}>
      <div className="bg-[#F2F7DF] sticky top-0 z-[1000] w-full">
        <header className="bg-[#EE6055] text-[#F2F7DF] text-center p-2 text-sm font-bold rounded-b-3xl">
          Te quedan solo 00:00 minutos para aprovechar nuestra gran oferta
        </header>

        <div className="flex justify-between items-center p-4 bg-[#F2F7DF]">
          <FaBars className="text-[#EE6055] text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
          <Image src="/logotipo-verde.svg" width={150} height={50} alt="Logotipo" />
          <BsCart2 className="text-[#EE6055] text-2xl cursor-pointer" onClick={()=> router.push('/cart')}/>

          <div className={`absolute left-0 p-4 w-full h-screen bg-[#F2F7DF] transition-all duration-1000 ${menuOpen ? "top-0" : "-top-[400vh]"}`}>
            <a href="/login" className="text-[#1F4C1A]">Iniciar Sesión</a>
            <button className="text-[#EE6055] text-5xl absolute top-2 right-4" onClick={() => setMenuOpen(false)}>&times;</button>
          </div>
        </div>
      </div>

      <section className="text-center py-4 rounded-lg mx-4 w-full">
        <p className="text-[#EE6055] font-light">Afirmación del día:</p>
        <h3 className="text-[#EE6055] font-bold text-sm p-4 border-[#EE6055] border-2 rounded-full w-2/3 justify-self-center">Tomo pequeñas decisiones hoy, para grandes resultados mañana</h3>
      </section>

      <section className="bg-[#1F4C1A] text-[#F2F7DF] rounded-3xl p-6 mx-4 my-6 max-w-[400px] relative overflow-hidden hover:scale-105 transition-all duration-700 lg:h-[690px] lg:flex lg:flex-col">
        <img src="./cuadro-mensual.jpg" className="rounded-3xl mb-4" />
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-literata)' }}>Cuadro Mensual</h2>
        <p className="mt-2"><del className="text-gray-400">$5.00</del> <strong className="text-[#F2F7DF]">Precio ahora: GRATIS!</strong></p>
        <ul className="list-disc ml-6 mt-4">
          <li>Presupuesto Mensual</li>
          <li>Clasificación de Gastos</li>
          <li>Gráficas y Plan de Ahorro Mensual</li>
          <li>Gráficas y Sumatorias en tiempo real</li>
          <li>Sumatoria de Cuentas y Categorías</li>
          <li className="font-bold">Descuento para el resto de productos Cashflow</li>
        </ul>
        <button className="bg-[#F2F7DF] text-[#1F4C1A] font-bold py-3 px-4 rounded-xl  mt-4 w-full" onClick={() => {
          window.open('/login', '_self')
        }}>¡Me lo llevo!</button>
      </section>

      <section className="bg-[#1F4C1A] text-[#F2F7DF] rounded-3xl p-6 mx-4 my-6 max-w-[400px] hover:scale-105 transition-all duration-700 lg:h-[690px] lg:flex lg:flex-col">
        <img src="./cuadro-anual.jpg" className="rounded-3xl mb-4 border" />
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-literata)' }}>Cuadro Anual</h2>
        <p className="mt-2"><del className="text-gray-400">$10.00</del> <strong className="text-[#F2F7DF]">Precio ahora: $5.00</strong></p>
        <ul className="list-disc ml-6 mt-4">
          <li>Presupuesto Mensual</li>
          <li>Clasificación de Gastos</li>
          <li>Gráficas y Plan de Ahorro Mensual</li>
          <li>Gráficas y Sumatorias en tiempo real</li>
          <li>Sumatorias de Cuentas y Categorías</li>
          <li className="font-bold">Gráficas de clasificación mensual y anual</li>
          <li className="font-bold">Afirmaciones mensuales</li>
          <li className="font-bold">Plan de ahorro modificable</li>
          <li className="font-bold">Plan de ahorro de emergencia</li>
          <li className="font-bold">Plan de ahorro general</li>
          <li className="font-bold">Calculadora de montos de libre uso</li>
          <li className="font-bold">Calculadora de sistema cambiario</li>
        </ul>
        <button className="bg-[#F2F7DF] text-[#1F4C1A] font-bold py-3 px-4 rounded-xl  mt-4 w-full">¡Me lo llevo!</button>
      </section>

      <section className="bg-[#1F4C1A] text-[#F2F7DF] rounded-3xl p-6 mx-4 my-6 max-w-[400px] hover:scale-105 transition-all duration-700 lg:h-[690px] lg:flex lg:flex-col">
        <img src="./chatbot.jpg" className="rounded-3xl mb-4 border" />
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-literata)' }}>Chatbot Cashflow</h2>
        <ul className="list-disc ml-6 mt-4">
          <li>Incluye el Cuadro Anual Premium</li>
          <li>Presupuesto Mensual</li>
          <li>Clasificación de Gastos</li>
          <li>Gráficas y Plan de Ahorro Mensual</li>
          <li>Gráficas y Sumatorias en tiempo real</li>
          <li>Sumatorias de Cuentas y Categorías</li>
          <li className="font-bold">Gráficas de clasificación mensual y anual</li>
          <li className="font-bold">Afirmaciones mensuales</li>
          <li className="font-bold">Plan de ahorro modificable</li>
          <li className="font-bold">Plan de ahorro de emergencia</li>
          <li className="font-bold">Plan de ahorro general</li>
          <li className="font-bold">Calculadora de montos de libre uso</li>
          <li className="font-bold">Calculadora de sistema cambiario</li>
        </ul>
        <button className="bg-[#F2F7DF] text-[#1F4C1A] font-bold py-3 px-4 rounded-xl mt-4 w-full">¡Preventa!</button>
      </section>

      <section className="bg-[#D0E562] text-[#14280C] p-6 mt-6 rounded-t-[7rem] flex flex-col">
        <img src="./asset-phone.png" className="max-w-[200px] self-center" />
        <h2 className="text-2xl font-bold text-[#1F4C1A] italic" style={{ fontFamily: 'var(--font-literata)' }}>¡Próximamente!</h2>
        <p className="mt-2">Imagina que nos escribes por <strong>Whatsapp </strong>
          y nosotros nos encargamos de <strong>actualizar tu tabla. </strong>
          Actualizamos tus ingresos, tus gastos,
          los clasificamos y te damos <strong>resúmenes
            mensuales</strong> vía Whatsapp.<br /><br />
          Olvídate de abrir un archivo de Drive o un Excell.
          <strong> Nosotros nos encargamos con nuestro Chatbot.</strong></p>
        <button className="bg-[#14280C] w-full text-[#F2F7DF] font-bold py-3 px-4 rounded-lg mt-4">¡Preventa!</button>
      </section>
    </div>
  );
}