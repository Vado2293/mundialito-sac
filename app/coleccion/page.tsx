"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CollectionPage() {
  const [collection, setCollection] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollection = async () => {
  setLoading(true);

  const currentUserId = localStorage.getItem("currentUserId");

  if (!currentUserId) {
    setCollection([]);
    setLoading(false);
    return;
  }

  // Cartas del usuario
  const { data: userCards, error: userCardsError } = await supabase
    .from("user_cards")
    .select(`
      player_id,
      players (*)
    `)
    .eq("user_id", currentUserId);

  if (userCardsError) {
    console.error(userCardsError);
    setLoading(false);
    return;
  }

  // Cartas pegadas
  const { data: placedCards, error: placedError } = await supabase
    .from("album_placed")
    .select("player_id")
    .eq("user_id", currentUserId);

  if (placedError) {
    console.error(placedError);
    setLoading(false);
    return;
  }

  const placedIds = (placedCards || []).map(
    (row: any) => row.player_id
  );

  const availableCards = (userCards || [])
    .filter((row: any) => !placedIds.includes(row.player_id))
    .map((row: any) => row.players);

  setCollection(availableCards);
  setLoading(false);
};

useEffect(() => {
  fetchCollection();
}, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Cargando colección...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white p-10">
      <button
        onClick={() => (window.location.href = "/home")}
        className="mb-4 inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full border border-white/20 text-slate-200 hover:bg-white/10 transition"
      >
        ← Volver
      </button>

      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-[0.2em] text-yellow-300">
          MI COLECCIÓN
        </h1>

        <p className="text-slate-400 mt-3">
          Total de cartas:{" "}
          <span className="text-white font-bold">{collection.length}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {collection.length === 0 ? (
          <p className="text-slate-500">
            No tienes cartas aún. Abre un sobre.
          </p>
        ) : (
          collection.map((card, i) => {
            const rarityStyle =
              card.rarity === "Legendario" || card.rarity === "Legendary"
                ? "border-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.7)]"
                : card.rarity === "Gold"
                ? "border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.5)]"
                : card.rarity === "Silver"
                ? "border-slate-300 shadow-[0_0_25px_rgba(148,163,184,0.5)]"
                : card.rarity === "Bronze"
                ? "border-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.5)]"
                : "border-slate-600";

            return (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden border bg-black/40 shadow-lg hover:scale-105 transition duration-300 ${rarityStyle}`}
              >
                <div className="relative z-10 flex justify-center pt-4">
                  <img
                    src={card.image || "/cards/joseph.png"}
                    alt={card.name || "Carta"}
                    className="h-[200px] object-contain"
                  />
                </div>

                <div className="relative z-10 p-4 bg-black/60 border-t border-white/10">
                  <h2 className="text-xl font-black">{card.name}</h2>
                  <p className="text-sm text-slate-400">{card.country}</p>

                  <div className="flex justify-between mt-3">
                    <span className="text-yellow-300 font-black">
                      {card.overall}
                    </span>

                    <span className="text-xs px-3 py-1 rounded-full bg-white/10">
                      {card.rarity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}


