"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { PLAYERS } from "../data/players";

const BASE_REWARD_COINS = 300;
const LEGENDARY_REWARD_COINS = 500;

const getCurrentUserId = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("currentUserId");
};

type Player = (typeof PLAYERS)[number];

type RepeatedInstance = {
  cardId: number; // id de user_cards
  player: Player;
};

export default function SobresPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [repeated, setRepeated] = useState<RepeatedInstance[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState<number | null>(null);

  /* --- CARGAR USUARIO + REPETIDAS --- */
  useEffect(() => {
    const load = async () => {
      const id = getCurrentUserId();
      if (!id) {
        setUserId(null);
        setLoading(false);
        return;
      }
      setUserId(id);
      setLoading(true);
      setMessage(null);

      // cargar usuario para ver coins
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("coins")
        .eq("id", id)
        .maybeSingle();

      if (!userError && user) {
        setUserCoins(user.coins ?? 0);
      }

      // cargar cartas del usuario
      const { data, error } = await supabase
        .from("user_cards")
        .select("id, player_id")
        .eq("user_id", id)
        .order("player_id", { ascending: true });

      if (error) {
        console.error(error);
        setMessage("Error cargando tus cartas.");
        setLoading(false);
        return;
      }

      const byPlayer: Record<string, { cardId: number }[]> = {};
        (data || []).forEach((row: any) => {
          const pid = String(row.player_id);
          if (!byPlayer[pid]) byPlayer[pid] = [];
          byPlayer[pid].push({ cardId: row.id as number });
        });

      const repeatedInstances: RepeatedInstance[] = [];

      Object.entries(byPlayer).forEach(([playerId, rows]) => {
        if (rows.length <= 1) return; // no repetidas

        const basePlayer = PLAYERS.find((p) => String(p.id) === playerId);
        if (!basePlayer) return;

        const [, ...extras] = rows; // 1ª es colección, resto repetidas
        extras.forEach((r) => {
          repeatedInstances.push({
            cardId: r.cardId,
            player: basePlayer,
          });
        });
      });

      setRepeated(repeatedInstances);
      setSelectedIds([]);
      setLoading(false);
    };

    load();
  }, []);

  const toggleSelect = (cardId: number) => {
    setSelectedIds((prev) => {
      const isSelected = prev.includes(cardId);
      if (isSelected) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= 3) {
        return prev; // máximo 3
      }
      return [...prev, cardId];
    });
  };

  const handleRedeem = async () => {
    if (!userId) return;

    if (selectedIds.length !== 3) {
      setMessage("Debes seleccionar exactamente 3 repetidas.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1) Averiguar las rarezas de las 3 seleccionadas
      const selectedInstances = repeated.filter((r) =>
        selectedIds.includes(r.cardId)
      );
      const allLegendary =
        selectedInstances.length === 3 &&
        selectedInstances.every((r) => r.player.rarity === "Legendario");

      const reward =
        allLegendary ? LEGENDARY_REWARD_COINS : BASE_REWARD_COINS;

      // 2) Borrar esas 3 copias de user_cards
      const { error: delError } = await supabase
        .from("user_cards")
        .delete()
        .in("id", selectedIds);

      if (delError) {
        console.error("DELETE user_cards ERROR:", delError);
        throw delError;
      }

      // 3) Sumar coins al usuario
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("coins")
        .eq("id", userId)
        .maybeSingle();

      if (userError || !user) {
        throw new Error("No se pudo leer coins del usuario");
      }

      const currentCoins = user.coins ?? 0;
      const newCoins = currentCoins + reward;

      const { error: updError } = await supabase
        .from("users")
        .update({ coins: newCoins })
        .eq("id", userId);

      if (updError) {
        console.error("UPDATE coins ERROR:", updError);
        throw updError;
      }

      setUserCoins(newCoins);
      setMessage(
        allLegendary
          ? `Canje exitoso. 3 legendarias → ${reward} monedas.`
          : `Canje exitoso. 3 repetidas → ${reward} monedas.`
      );

      // 4) Recargar repetidas
      const { data, error } = await supabase
        .from("user_cards")
        .select("id, player_id")
        .eq("user_id", userId)
        .order("player_id", { ascending: true });

      if (!error) {
        const byPlayer: Record<string, { cardId: number }[]> = {};
        (data || []).forEach((row) => {
          const pid = String(row.player_id);
          if (!byPlayer[pid]) byPlayer[pid] = [];
          byPlayer[pid].push({ cardId: row.id as number });
        });

        const repeatedInstances: RepeatedInstance[] = [];
        Object.entries(byPlayer).forEach(([playerId, rows]) => {
          if (rows.length <= 1) return;
          const basePlayer = PLAYERS.find((p) => String(p.id) === playerId);
          if (!basePlayer) return;
          const [, ...extras] = rows;
          extras.forEach((r) => {
            repeatedInstances.push({
              cardId: r.cardId,
              player: basePlayer,
            });
          });
        });
        setRepeated(repeatedInstances);
        setSelectedIds([]);
      }
    } catch (e) {
      console.error("handleRedeem ERROR:", e);
      setMessage("Error al canjear. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Debes iniciar sesión para ver tus repetidas.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <button
        onClick={() => (window.location.href = "/home")}
        className="mb-4 px-4 py-2 border border-white/20 rounded hover:bg-white/10 text-sm"
      >
        ← Volver
      </button>

      <h1 className="text-3xl font-bold mb-2">Canjear repetidas por coins</h1>

      {userCoins !== null && (
        <p className="mb-4 text-sm text-slate-300">
          Monedas actuales: <strong>{userCoins}</strong>
        </p>
      )}

      {loading && !repeated.length && <p>Cargando...</p>}

      {!loading && repeated.length === 0 && (
        <p>No tienes cartas repetidas por ahora.</p>
      )}

      {repeated.length > 0 && (
        <>
          <p className="mb-4 text-sm text-slate-300">
            Selecciona <strong>3 cartas repetidas</strong> para canjear.
            <br />
            Normal: <strong>{BASE_REWARD_COINS}</strong> monedas.
            <br />
            Si las 3 son <strong>Legendario</strong>:{" "}
            <strong>{LEGENDARY_REWARD_COINS}</strong> monedas.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {repeated.map((item) => {
              const isSelected = selectedIds.includes(item.cardId);
              return (
                <button
                  key={item.cardId}
                  onClick={() => toggleSelect(item.cardId)}
                  className={`relative rounded-2xl overflow-hidden border bg-slate-800/80 hover:bg-slate-700 transition ${
                    isSelected
                      ? "border-emerald-400 ring-2 ring-emerald-400/70"
                      : "border-white/10"
                  }`}
                >
                  <img
                    src={item.player.image}
                    alt={item.player.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] bg-black/70">
                    REP
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] bg-slate-900/80">
                    {item.player.rarity}
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center text-3xl font-bold">
                      ✓
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs font-semibold truncate">
                      {item.player.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {item.player.country}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mb-2 text-sm">
            Seleccionadas: {selectedIds.length} / 3
          </p>

          <button
            onClick={handleRedeem}
            disabled={loading || selectedIds.length !== 3}
            className={`px-4 py-2 rounded text-sm font-semibold ${
              selectedIds.length === 3 && !loading
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {loading ? "Procesando..." : "Canjear 3 repetidas"}
          </button>
        </>
      )}

      {message && (
        <p className="mt-4 text-sm text-slate-200">{message}</p>
      )}
    </main>
  );
}
