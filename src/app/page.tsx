"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBars } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import financialAffirmations from "@/constants/affirmations/affirmations";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [orderId, setOrderID] = useState("");
  const [dailyAffirmation, setDailyAffirmation] = useState('')
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60);
  const [loading, setLoading] = useState(true)
  const [newOrder, setNewOrder] = useState(0);

  const handleClickCart = () => {
    setNewOrder(0);
    router.push("/cart");
  };

  const createOrder = async () => {
    console.log("createOrder function called!");
    setNewOrder((prevNewOrder) => {
      const newValue = prevNewOrder + 1;
      console.log("newOrder updated to:", newValue);
      return newValue;
    });
    const response = await fetch("/api/paypal/place_order", { method: "POST" });
    const data = await response.json();
    setOrderID(data.id);
    console.log("orderId set to:", data.id);
    console.log(orderId)
  };

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

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

  useEffect(() => {
    const AFFIRMATION_KEY = 'dailyAffirmation';
    const DATE_KEY = 'affirmationDate';

    const getRandomAffirmation = () => {
      const randomIndex = Math.floor(Math.random() * financialAffirmations.length);
      return financialAffirmations[randomIndex];
    };

    const setDailyAffirmationWithPersistence = () => {
      const storedAffirmation = localStorage.getItem(AFFIRMATION_KEY);
      const storedDate = localStorage.getItem(DATE_KEY);
      const today = new Date().toDateString();

      if (storedAffirmation && storedDate === today) {
        setDailyAffirmation(storedAffirmation);
      } else {
        const newAffirmation = getRandomAffirmation();
        setDailyAffirmation(newAffirmation);
        localStorage.setItem(AFFIRMATION_KEY, newAffirmation);
        localStorage.setItem(DATE_KEY, today);
      }
    };

    setDailyAffirmationWithPersistence(); // Set initial affirmation

    const intervalId = setInterval(setDailyAffirmationWithPersistence, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const COUNTDOWN_KEY = 'offerCountdown';
    const INITIAL_TIME = 2 * 60 * 60; // 2 hours in seconds

    const getInitialTime = (): number => {
      const storedTime = localStorage.getItem(COUNTDOWN_KEY);
      if (storedTime) {
        const parsedTime = parseInt(storedTime, 10);
        if (!isNaN(parsedTime) && parsedTime > 0) {
          return parsedTime;
        }
      }
      return INITIAL_TIME;
    };

    setTimeLeft(getInitialTime());

    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft > 0) {
          localStorage.setItem(COUNTDOWN_KEY, String(prevTimeLeft - 1));
          return prevTimeLeft - 1;
        } else {
          clearInterval(interval);
          localStorage.removeItem(COUNTDOWN_KEY); // Optionally remove when finished
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  useEffect(()=>{
    setTimeout(()=>{
      setLoading(false)
    },1500)
  },[])

  if (session) {
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
        <div className="bg-[#F2F7DF] flex flex-col items-center lg:flex-row lg:flex-wrap" style={{ fontFamily: 'var(--font-red-hat-text)' }}>
          <div className="bg-[#F2F7DF] sticky top-0 z-[1000] w-full">
            <header className="bg-[#EE6055] text-[#F2F7DF] text-center p-2 text-sm font-bold rounded-b-3xl">
            Te quedan solo {formatTime(timeLeft)} minutos para aprovechar nuestra gran oferta
            </header>
            <div className="flex justify-between items-center p-4 bg-[#f2f7df]">
              <FaBars className="text-[#EE6055] text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
              <Image src="/logotipo-verde.svg" width={150} height={50} alt="Logotipo" onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }} className="cursor-pointer" />
              <div className="relative">
                <BsCart2 className="text-[#EE6055] text-2xl cursor-pointer" onClick={handleClickCart} />
                {newOrder > 0 ? <h6 className="absolute -top-1 -right-2 bg-[#EE6055] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{newOrder}</h6> : null}
              </div>
              <div className={`absolute left-0 p-4 w-full h-screen bg-[#F2F7DF] transition-all duration-1000 ${menuOpen ? "top-0" : "-top-[400vh]"}`}>
                <button onClick={() => signOut()} className="text-[#1F4C1A]">Cerrar Sesión</button>
                <button className="text-[#EE6055] text-5xl absolute top-2 right-4" onClick={() => setMenuOpen(false)}>&times;</button>
              </div>
            </div>
          </div>
  
          <section className="text-center py-4 rounded-lg mx-4 w-full flex justify-center flex-wrap">
            <p className="text-[#EE6055] font-light w-full">Afirmación del día:</p>
            <h3 className="text-[#EE6055] font-bold text-sm p-4 border-[#EE6055] border-2 rounded-full w-2/3 justify-self-center">{dailyAffirmation}</h3>
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
            <img src="./cuadro-mensual.jpg" className="rounded-3xl mb-4" alt="Cuadro Mensual" />
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
            <img src="./cuadro-anual.jpg" className="rounded-3xl mb-4 border" alt="Cuadro Anual" />
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
            <img src="./chatbot.jpg" className="rounded-3xl mb-4 border" alt="Chatbot" />
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
            <img src="./asset-phone.png" className="max-w-[200px] self-center" alt="" />
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
  }

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
      <div className="bg-[#F2F7DF] flex flex-col items-center lg:flex-row lg:flex-wrap" style={{ fontFamily: 'var(--font-red-hat-text)' }}>
        <div className="bg-[#F2F7DF] sticky top-0 z-[1000] w-full">
          <header className="bg-[#EE6055] text-[#F2F7DF] text-center p-2 text-sm font-bold rounded-b-3xl">
          Te quedan solo {formatTime(timeLeft)} minutos para aprovechar nuestra gran oferta
          </header>
  
          <div className="flex justify-between items-center p-4 bg-[#F2F7DF]">
            <FaBars className="text-[#EE6055] text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
            <Image src="/logotipo-verde.svg" width={150} height={50} alt="Logotipo" />
            <BsCart2 className="text-[#EE6055] text-2xl cursor-pointer" onClick={() => router.push('/cart')} />
  
            <div className={`absolute left-0 p-4 w-full h-screen bg-[#F2F7DF] transition-all duration-1000 ${menuOpen ? "top-0" : "-top-[400vh]"}`}>
              <a href="/login" className="text-[#1F4C1A]">Iniciar Sesión</a>
              <button className="text-[#EE6055] text-5xl absolute top-2 right-4" onClick={() => setMenuOpen(false)}>&times;</button>
            </div>
          </div>
        </div>
  
        <section className="text-center py-4 rounded-lg mx-4 w-full flex justify-center flex-wrap">
          <p className="text-[#EE6055] font-light w-full">Afirmación del día:</p>
          <h3 className="text-[#EE6055] font-bold text-sm p-4 border-[#EE6055] border-2 rounded-full w-2/3 justify-self-center">{dailyAffirmation}</h3>
        </section>
  
        <section className="bg-[#1F4C1A] text-[#F2F7DF] rounded-3xl p-6 mx-4 my-6 max-w-[400px] relative overflow-hidden hover:scale-105 transition-all duration-700 lg:h-[690px] lg:flex lg:flex-col">
          <img src="./cuadro-mensual.jpg" className="rounded-3xl mb-4" alt="Cuadro Mensual" />
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
            router.push('/login')
          }}>¡Me lo llevo!</button>
        </section>
  
        <section className="bg-[#1F4C1A] text-[#F2F7DF] rounded-3xl p-6 mx-4 my-6 max-w-[400px] hover:scale-105 transition-all duration-700 lg:h-[690px] lg:flex lg:flex-col">
          <img src="./cuadro-anual.jpg" className="rounded-3xl mb-4 border" alt="Cuadro Anual" />
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
          <button className="bg-[#F2F7DF] text-[#1F4C1A] font-bold py-3 px-4 rounded-xl  mt-4 w-full" onClick={()=>{router.push("/login")}}>¡Me lo llevo!</button>
        </section>
  
        <section className="bg-[#1F4C1A] text-[#F2F7DF] rounded-3xl p-6 mx-4 my-6 max-w-[400px] hover:scale-105 transition-all duration-700 lg:h-[690px] lg:flex lg:flex-col">
          <img src="./chatbot.jpg" className="rounded-3xl mb-4 border" alt="Chatbot" />
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
          <img src="./asset-phone.png" className="max-w-[200px] self-center" alt="" />
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
}