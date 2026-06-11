"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { PLAYERS } from "../data/players";

const getCurrentUserId = () => localStorage.getItem("currentUserId");

const PACK_PRICES: Record<string, number> = {
  Bronze: 100,
  Silver: 200,
  Gold: 300,
  Legendario: 500,
};

/* ---------------- SUPABASE HELPERS ---------------- */

async function getUser(id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)         // <-- o .eq("username", id)
    .single();

  if (error) {
    console.error("getUser ERROR:", error);
    return null;
  }
  return data;
}

async function updateUserCoins(id: string, coins: number) {
  const { data, error } = await supabase
    .from("users")
    .update({ coins })
    .eq("id", id)         // <-- o .eq("username", id)
    .select()
    .single();

  if (error) {
    console.error("updateUserCoins ERROR:", error);
    return null;
  }
  return data;
}

/* ================= COMPONENT ================= */

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [players, setPlayers] = useState<any[]>(PLAYERS);

  const [openPack, setOpenPack] = useState(false);
  const [revealCard, setRevealCard] = useState(false);
  const [selectedPack, setSelectedPack] = useState("Gold");
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [randomPlayer, setRandomPlayer] = useState<any>(null);

  const [username, setUsername] = useState<string | null>(null);
  const [coins, setCoins] = useState<number | null>(null);

  const [particles, setParticles] = useState<any[]>([]);

  /* ---------------- LOAD USER ---------------- */

  useEffect(() => {
    const load = async () => {
      const id = getCurrentUserId();

      if (!id) {
        setCoins(null);
        setUsername(null);
        return;
      }

      const user = await getUser(id);
      if (!user) return;

      setCoins(user.coins ?? 0);
      setUsername(user.id);
    };

    load();
  }, [openPack]);

  /* ---------------- LOAD PLAYERS ---------------- */

useEffect(() => {
  const loadPlayers = async () => {
    const { data } = await supabase
      .from("players")
      .select("*");

    console.log("PLAYERS:", data);

    const legendarios =
      data?.filter(
        (p) => p.rarity === "Legendario"
      ) || [];

    console.log(
      "LEGENDARIOS:",
      legendarios.length,
      legendarios
    );

    if (data && data.length > 0) {
      setPlayers(data);
    } else {
      setPlayers(PLAYERS);
    }
  };

  loadPlayers();
}, []);

  /* ---------------- SOUND ---------------- */

  const playSound = (src: string) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = new Audio(src);
      audio.volume = 0.6;
      audio.play().catch((e) => {
        console.warn("audio play blocked:", e);
      });

      setCurrentAudio(audio);
    } catch (err) {
      console.error("playSound error:", err);
    }
  };

  /* ---------------- RANDOM PLAYER ---------------- */

  const getRandomPlayer = (pack: string) => {
    if (!players || !players.length) return null;

    const pool = players.filter((p) => p?.rarity === pack);
    if (!pool.length) return null;

    return pool[Math.floor(Math.random() * pool.length)];
  };

  /* ---------------- OPEN PACK ---------------- */

  const openPackHandler = async (pack: string) => {
  try {
    const id = getCurrentUserId();   // lo que guardaste en localStorage
    if (!id) {
      alert("No estás logueado");
      return;
    }

    const user = await getUser(id);
    if (!user) {
      alert("Usuario no encontrado");
      return;
    }

    const price = PACK_PRICES[pack];
    if ((user.coins ?? 0) < price) {
      alert("No tienes monedas");
      return;
    }

    const player = getRandomPlayer(pack);
    if (!player) {
      alert("No hay jugadores disponibles para este sobre");
      return;
    }

    // UI FIRST
    setSelectedPack(pack);
    setRandomPlayer(player);
    setOpenPack(true);
    setRevealCard(false);

    playSound("/audio/pack-open.mp3");

    // UPDATE COINS
    const newCoins = (user.coins ?? 0) - price;
    setCoins(newCoins);

    const updated = await updateUserCoins(id, newCoins);
    if (!updated) {
      setCoins(user.coins ?? 0);
      alert("Error actualizando monedas. Intenta de nuevo.");
      setOpenPack(false);
      setRandomPlayer(null);
      return;
    }

    // SAVE CARD
    console.log("DEBUG INSERT payload:", {
      user_id: id,
      player_id: player.id,
    });

    const { data: insertData, error: insertError } = await supabase
      .from("user_cards")
      .insert({
        user_id: id,        // <-- este tipo/valor debe coincidir con user_cards.user_id
        player_id: player.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("INSERT ERROR RAW:", insertError);
      const reverted = await updateUserCoins(id, user.coins ?? 0);
      if (reverted) setCoins(user.coins ?? 0);
      alert("Error guardando la carta. Se revirtieron las monedas.");
      setOpenPack(false);
      setRandomPlayer(null);
      return;
    }

    console.log("Carta guardada OK:", insertData);

    setTimeout(() => {
      setRevealCard(true);
    }, 4000);
  } catch (err) {
    console.error("openPackHandler unexpected error:", err);
    alert("Ocurrió un error. Revisa la consola.");
    setOpenPack(false);
    setRandomPlayer(null);
  }
};


  /* ---------------- RARITY STYLE ---------------- */

  const rarityStyles: any = {
    Legendario: {
      border: "border-cyan-300/70",
      glow: "shadow-[0_0_80px_rgba(34,211,238,0.85)]",
      badge: "bg-cyan-400 text-black",
    },
    Gold: {
      border: "border-amber-300/60",
      glow: "shadow-[0_0_70px_rgba(251,191,36,0.75)]",
      badge: "bg-amber-400 text-black",
    },
    Silver: {
      border: "border-slate-300/60",
      glow: "shadow-[0_0_70px_rgba(148,163,184,0.75)]",
      badge: "bg-slate-300 text-black",
    },
    Bronze: {
      border: "border-orange-400/60",
      glow: "shadow-[0_0_70px_rgba(251,146,60,0.75)]",
      badge: "bg-orange-400 text-black",
    },
  };

  return (
    <main className="min-h-screen overflow-x-hidden relative isolate bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_45%,#000000_100%)] text-white p-4 md:p-10">
      {/* PARTICLES (FIXED) */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [p.y, p.y - 300],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
            style={{ x: p.x }}
          />
        ))}
      </div>

      {/* BACKGROUND LIGHTS */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-yellow-400/20 blur-[140px] rounded-full" />
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-cyan-400/10 blur-[120px] rounded-full" />

      {/* NAVBAR */}
      <nav className="relative z-50 flex flex-wrap gap-4 items-center justify-between mb-16 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl px-4 md:px-8 py-4 md:py-5">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-black tracking-[0.1em] bg-gradient-to-r from-yellow-300 via-white to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]"
          >
            MUNDIALITO SAC
          </motion.h1>

          <p className="text-xs text-slate-400 tracking-[0.3em]">GTI 2026</p>
        </div>

        <div className="hidden md:flex items-center gap-10 text-sm uppercase tracking-[0.2em]">
          <a href="/album" className="hover:text-yellow-300 transition">
            Álbum
          </a>
          <a href="/coleccion" className="hover:text-yellow-300 transition">
            Colección
          </a>
          <button className="hover:text-yellow-300 transition">SOBRES</button>
          <a href="/admin" className="hover:text-yellow-300 transition">
            Admin
          </a>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {username && <span className="hidden md:inline text-sm text-slate-300">{username}</span>}
          <button
            onClick={() => {
              localStorage.removeItem("currentUserId");
              window.location.href = "/login";
            }}
            className="hidden md:block text-xs px-3 py-1 rounded-full border border-red-400/60 text-red-300 hover:bg-red-500/10 transition"
          >
            Salir
          </button>

          <div className="bg-yellow-400/10 border border-yellow-300/20 px-4 py-2 rounded-full">
            <p className="text-yellow-300 font-bold text-sm md:text-base">
              {coins !== null ? `${coins} Coins` : "Sin sesión"}
            </p>
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <button className="absolute top-8 right-8 text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-8 text-2xl font-black tracking-[0.2em] uppercase">
              <a href="/album" className="hover:text-yellow-300 transition" onClick={() => setIsMobileMenuOpen(false)}>
                Álbum
              </a>
              <a href="/coleccion" className="hover:text-yellow-300 transition" onClick={() => setIsMobileMenuOpen(false)}>
                Colección
              </a>
              <button onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-300 transition">
                Sobres
              </button>
              <a href="/admin" className="hover:text-yellow-300 transition" onClick={() => setIsMobileMenuOpen(false)}>
                Admin
              </a>

              <div className="w-full h-px bg-white/20 my-4"></div>

              {username && <span className="text-sm text-slate-400">Jugador: {username}</span>}

              <button
                onClick={() => {
                  localStorage.removeItem("currentUserId");
                  window.location.href = "/login";
                  setIsMobileMenuOpen(false);
                }}
                className="text-base px-6 py-2 rounded-full border border-red-400/60 text-red-400 hover:bg-red-500/20 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="flex justify-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full max-w-[340px] h-[450px] md:h-[500px] rounded-[36px] overflow-hidden border border-yellow-400/40 bg-gradient-to-b from-yellow-400/20 via-slate-900 to-black shadow-[0_0_60px_rgba(250,204,21,0.35)] hover:scale-105 transition duration-500 mx-auto"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.4),transparent_65%)] animate-pulse" />

          <img src="/cards/sobre.png" alt="Sobre" className="absolute bottom-24 left-1/2 -translate-x-1/2 h-[400px] object-contain" />

          <div className="absolute bottom-0 w-full bg-black/50 backdrop-blur-xl border-t border-white/10 p-6" />
        </motion.div>
      </section>

      {/* SOBRES */}
      <section className="mb-24">
        <h2 className="text-4xl font-black mb-10 tracking-[0.15em]">SOBRES</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRONZE */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            onClick={() => openPackHandler("Bronze")}
            className="relative h-[340px] rounded-[28px] overflow-hidden cursor-pointer border border-orange-400/30 bg-gradient-to-b from-orange-700/30 to-black shadow-[0_0_40px_rgba(251,146,60,0.35)]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-6xl mb-4">🥉</h2>
              <h3 className="text-3xl font-black text-orange-300">BRONZE</h3>
            </div>
          </motion.div>

          {/* SILVER */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            onClick={() => openPackHandler("Silver")}
            className="relative h-[340px] rounded-[28px] overflow-hidden cursor-pointer border border-slate-300/30 bg-gradient-to-b from-slate-400/30 to-black shadow-[0_0_40px_rgba(226,232,240,0.35)]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-6xl mb-4">🥈</h2>
              <h3 className="text-3xl font-black text-slate-200">SILVER</h3>
            </div>
          </motion.div>

          {/* GOLD */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            onClick={() => openPackHandler("Gold")}
            className="relative h-[340px] rounded-[28px] overflow-hidden cursor-pointer border border-yellow-300/30 bg-gradient-to-b from-yellow-500/30 to-black shadow-[0_0_40px_rgba(250,204,21,0.35)]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-6xl mb-4">🥇</h2>
              <h3 className="text-3xl font-black text-yellow-300">GOLD</h3>
            </div>
          </motion.div>

          {/* LEGENDARIO */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            onClick={() => openPackHandler("Legendario")}
            className="relative h-[340px] rounded-[28px] overflow-hidden cursor-pointer border border-cyan-400/30 bg-gradient-to-b from-cyan-500/30 to-black shadow-[0_0_40px_rgba(34,211,238,0.45)]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-6xl mb-4">💎</h2>
              <h3 className="text-3xl font-black text-cyan-300">Legendario</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FLASH WHITE ON REVEAL */}
      {revealCard && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9998] bg-white pointer-events-none"
        />
      )}

      {/* PACK MODAL */}
      <AnimatePresence>
        {openPack && randomPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center"
          >
            {/* CLOSE */}
            <button
              onClick={() => {
                if (currentAudio) {
                  currentAudio.pause();
                  currentAudio.currentTime = 0;
                }

                if (!revealCard) {
                  setRevealCard(true);
                  return;
                }

                setOpenPack(false);
                setRevealCard(false);
                setRandomPlayer(null);
              }}
              className="absolute top-4 right-4 md:top-10 md:right-10 text-white text-3xl md:text-4xl hover:text-yellow-300 transition z-50"
            >
              ✕
            </button>

            {!revealCard ? (
              /* OPENING ANIMATION */
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                }}
                className="relative w-[260px] h-[360px] rounded-[28px] overflow-hidden border border-yellow-300/20 bg-gradient-to-b from-yellow-500/20 to-black shadow-[0_0_60px_rgba(250,204,21,0.45)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.45),transparent_70%)] animate-pulse" />
                <div className="absolute inset-0 bg-white/10 animate-pulse" />

                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
                  <div className="absolute top-24 right-16 w-3 h-3 bg-white rounded-full animate-pulse" />
                  <div className="absolute bottom-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="mb-4">
                    <img src="/cards/logo.png" alt="logo" className="h-65 w-auto mx-auto" />
                  </div>

                  <h3 className="text-2xl font-black text-yellow-300 mb-2 tracking-[0.1em] text-center px-4 leading-tight">
                    {selectedPack.toUpperCase()} PACK
                  </h3>

                  <p className="text-slate-300 text-sm tracking-[0.25em] animate-pulse">OPENING...</p>
                </div>
              </motion.div>
                        ) : (
              /* CARD REVEAL */
              <motion.div
                initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className={`relative w-[90vw] max-w-[340px] h-[430px] md:h-[470px] rounded-[36px] overflow-hidden border bg-gradient-to-b from-white/10 to-black ${
                  rarityStyles[randomPlayer.rarity as keyof typeof rarityStyles].border
                } ${
                  rarityStyles[randomPlayer.rarity as keyof typeof rarityStyles].glow
                }`}
              >
                {/* SMOKE */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl top-[-100px] left-[-120px] animate-pulse" />
                  <div className="absolute w-[400px] h-[400px] bg-yellow-300/10 rounded-full blur-3xl bottom-[-120px] right-[-120px] animate-pulse" />
                </div>

                {/* Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.4),transparent_70%)] animate-pulse" />

                {/* LIGHT RAYS */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-[-20%] left-[10%] w-[120px] h-[700px] rotate-12 bg-yellow-300/10 blur-3xl" />
                  <div className="absolute top-[-20%] right-[10%] w-[120px] h-[700px] -rotate-12 bg-cyan-300/10 blur-3xl" />
                </div>

                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse" />

                {/* SPARKS */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 0,
                        scale: 0,
                        x: Math.random() * 400,
                        y: Math.random() * 600,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: Math.random(),
                      }}
                      className="absolute w-2 h-2 rounded-full bg-yellow-300"
                    />
                  ))}
                </div>

                {/* Player image */}
                <img
                  src={randomPlayer.image}
                  alt={randomPlayer.name}
                  className="absolute inset-0 m-auto max-h-[80%] max-w-[80%] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                />

                {/* Footer */}
                <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-xl p-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div
                      className={`${
                        rarityStyles[randomPlayer.rarity as keyof typeof rarityStyles].badge
                      } px-4 py-2 rounded-full text-sm font-black shadow-[0_0_20px_rgba(255,255,255,0.25)]`}
                    >
                      {randomPlayer.rarity}
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold">{randomPlayer.name}</p>
                      {randomPlayer.country && (
                        <p className="text-xs text-slate-300 mt-1">
                          {randomPlayer.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

