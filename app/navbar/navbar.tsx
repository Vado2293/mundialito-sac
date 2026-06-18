"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importar useRouter

// Estas funciones ahora se manejarán dentro del Navbar para que sea autónomo
const getCurrentUserId = () => localStorage.getItem("currentUserId");
const loadUsers = () => JSON.parse(localStorage.getItem("users") || "{}");
const saveUsers = (users: any) =>
  localStorage.setItem("users", JSON.stringify(users));

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const router = useRouter(); // Inicializar useRouter

  useEffect(() => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      setCoins(null);
      setUsername(null);
      return;
    }

    const users: any = loadUsers();
    const user = users[currentUserId];

    if (!user) {
      setCoins(null);
      setUsername(null);
      return;
    }

    setCoins(user.coins ?? 0);
    setUsername(user.id || currentUserId);
  }, []); // El array de dependencias vacío significa que se ejecuta una sola vez al montar

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    router.push("/login"); // Redirigir al login usando useRouter
  };

  return (
    <>
      <nav className="relative z-50 flex flex-wrap gap-4 items-center justify-between mb-16 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl px-4 md:px-8 py-4 md:py-5">
        {/* LOGO */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-7xl font-black tracking-[0.1em] bg-gradient-to-r from-yellow-300 via-white to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]"
          >
            MUNDIALITO SAC
          </motion.h1>
          <p className="text-xs text-slate-400 tracking-[0.3em]">GTI 2026</p>
        </div>

        {/* MENÚ ESCRITORIO */}
        <div className="hidden md:flex items-center gap-10 text-sm uppercase tracking-[0.2em]">
          <a href="/album" className="hover:text-yellow-300 transition">
            Álbum
          </a>
          <a href="/coleccion" className="hover:text-yellow-300 transition">
            Colección
          </a>
          {/* El link de "Sobres" va a la página principal */}
          <a href="/sobres" className="hover:text-yellow-300 transition">
            SOBRES
          </a>

          <a href="/admin" className="hover:text-yellow-300 transition">
            Admin
          </a>
        </div>

        {/* USUARIO Y BOTÓN MÓVIL */}
        <div className="flex items-center gap-3 md:gap-4">
          {username && (
            <span className="hidden md:inline text-sm text-slate-300">
              {username}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="hidden md:block text-xs px-3 py-1 rounded-full border border-red-400/60 text-red-300 hover:bg-red-500/10 transition"
          >
            Salir
          </button>

          <div className="bg-yellow-400/10 border border-yellow-300/20 px-4 py-2 rounded-full">
            <p className="text-yellow-300 font-bold text-sm md:text-base">
              {coins !== null ? `${coins} 🪙` : "Sin sesión"}
            </p>
          </div>

          {/* BOTÓN HAMBURGUESA (SOLO MÓVIL) */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* MENÚ MÓVIL (OVERLAY) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-8 right-8 text-white/70 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-8 text-2xl font-black tracking-[0.2em] uppercase">
              <a
                href="/album"
                className="hover:text-yellow-300 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Álbum
              </a>
              <a
                href="/coleccion"
                className="hover:text-yellow-300 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Colección
              </a>
             <a
                href="/sobres"
                className="hover:text-yellow-300 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sobres
              </a>
                            <a
                href="/admin"
                className="hover:text-yellow-300 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </a>

              <div className="w-full h-px bg-white/20 my-4"></div>

              {username && (
                <span className="text-sm text-slate-400">
                  Jugador: {username}
                </span>
              )}

              <button
                onClick={() => {
                  handleLogout(); // Usamos la función handleLogout
                  setIsMobileMenuOpen(false); // Cierra el menú al cerrar sesión
                }}
                className="text-base px-6 py-2 rounded-full border border-red-400/60 text-red-400 hover:bg-red-500/20 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
