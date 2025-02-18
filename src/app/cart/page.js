"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaBars } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { signOut, signIn, useSession } from "next-auth/react";
import { loadScript } from "@paypal/paypal-js";

export default function OrdersPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paidOrders, setPaidOrders] = useState({}); // Track paid state per order

  const { data: session } = useSession();
  const paypalRefs = useRef({}); // Store PayPal button refs

  // Load PayPal SDK once
  useEffect(() => {
    async function loadPayPal() {
      try {
        await loadScript({
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        }); // Change to your real PayPal client ID
      } catch (error) {
        console.error("Failed to load PayPal SDK", error);
      }
    }
    loadPayPal();
  }, []);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/paypal/checkout");
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Check localStorage for already paid orders
  useEffect(() => {
    const savedPaidOrders = JSON.parse(localStorage.getItem("paidOrders")) || {};
    setPaidOrders(savedPaidOrders);
  }, []);

  // Initialize PayPal Buttons for each order
  useEffect(() => {
    async function initPayPalButtons() {
      for (let order of orders) {
        if (!paypalRefs.current[order.order_id] && !paidOrders[order.order_id]) {
          paypalRefs.current[order.order_id] = true; // Prevent duplicate renders

          window.paypal
            .Buttons({
              createOrder: () => order.order_id, // Use the existing order ID
              onApprove: async (data, actions) => {
                try {
                  const details = await actions.order.capture();
                  setPaidOrders((prevState) => {
                    const updatedState = { ...prevState, [order.order_id]: true };
                    // Save the updated state to localStorage
                    localStorage.setItem("paidOrders", JSON.stringify(updatedState));
                    return updatedState;
                  });

                  // Proceed with backend call
                  const orderId = order.order_id;
                  const res = await fetch(
                    `/api/paypal/cuadro_anual?orderId=${orderId}`
                  );
                  const responseData = await res.json();

                  if (responseData.fileURL) {
                    window.location.href = responseData.fileURL; // Redirect to download link
                  }
                } catch (error) {
                  console.error("Error capturing the payment", error);
                }
              },
            })
            .render(`#paypal-button-${order.order_id}`); // Render for each order
        }
      }
    }

    if (orders.length > 0 && window.paypal) {
      initPayPalButtons();
    }
  }, [orders, paidOrders]); // Run this effect when `orders` or `paidOrders` updates

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
        <div className="bg-[#F2F7DF] flex flex-col ">
          <div className="bg-[#F2F7DF] sticky top-0 z-[1000] w-full">
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
                  router.push("/"); // Navigate to home page
                }}
                className="cursor-pointer"
              />
              <BsCart2
                className="text-[#EE6055] text-2xl cursor-pointer"
                onClick={() => router.push("/cart")}
              />

              <div
                className={`absolute left-0 p-4 w-full h-screen bg-[#F2F7DF] transition-all duration-1000 ${
                  menuOpen ? "top-0" : "-top-[400vh]"
                }`}
              >
                <button onClick={() => signOut()} className="text-[#1F4C1A]">
                  Cerrar Sesión
                </button>
                <button
                  className="text-[#EE6055] text-5xl absolute top-2 right-4"
                  onClick={() => setMenuOpen(false)}
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
          <div className="min-h-screen flex gap-4 p-4 justify-center items-center">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.order_id}
                  className="shadow-lg p-4 min-h-[400px] w-[300px] rounded-2xl text-[#1F4C1A] flex flex-col justify-between hover:scale-105 transition-all duration-700 cursor-pointer"
                >
                  <Image
                    src={`/cuadro-anual.jpg`}
                    width={268}
                    height={100}
                    alt="Cuadro Anual"
                    className="rounded-lg"
                  />
                  <h2 className="font-bold text-xl">Cuadro Anual</h2>
                  <h2>
                    <span className="font-bold">Pedido ID:</span> {order.order_id}
                  </h2>
                  <h2>
                    <span className="font-bold">Usuario:</span> {order.email}
                  </h2>
                  {/* Show PayPal button only if the order is not paid */}
                  {!paidOrders[order.order_id] && (
                    <div
                      id={`paypal-button-${order.order_id}`}
                      className="mt-2"
                    ></div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center gap-4 items-center">
                <Image
                  src={`/money.png`}
                  width={300}
                  height={150}
                  alt="Money"
                ></Image>
                <h1
                  className="font-bold text-3xl text-center text-[#1F4C1A]"
                  style={{ fontFamily: "var(--font-literata)" }}
                >
                  ¡Parece que aún no hay pedidos pendientes!
                </h1>
              </div>
            )}
          </div>
        </div>
      );
    }
  } else {
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
        <div className="bg-[#F2F7DF] flex flex-col ">
          <div className="bg-[#F2F7DF] sticky top-0 z-[1000] w-full">
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
                  router.push("/"); // Navigate to home page
                }}
              />
              <BsCart2
                className="text-[#EE6055] text-2xl cursor-pointer"
                onClick={() => router.push("/cart")}
              />

              <div
                className={`absolute left-0 p-4 w-full h-screen bg-[#F2F7DF] transition-all duration-1000 ${
                  menuOpen ? "top-0" : "-top-[400vh]"
                }`}
              >
                <button onClick={() => signIn()} className="text-[#1F4C1A]">
                  Iniciar Sesión
                </button>
                <button
                  className="text-[#EE6055] text-5xl absolute top-2 right-4"
                  onClick={() => setMenuOpen(false)}
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
          <div className="min-h-screen flex gap-4 p-4 justify-center items-center">
            <div className="flex flex-col justify-center gap-4 items-center">
              <Image
                src={`/money.png`}
                width={300}
                height={150}
                alt="Money"
              ></Image>
              <h1
                className="font-bold text-3xl text-center text-[#1F4C1A]"
                style={{ fontFamily: "var(--font-literata)" }}
              >
                ¡Parece que aún no hay pedidos pendientes!
              </h1>
            </div>
          </div>
        </div>
      );
    }
  }
}
