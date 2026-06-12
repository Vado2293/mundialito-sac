"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!userId || !password) {
      setError("Completa todos los campos");
      setLoading(false);
      return;
    }

    // 1. buscar usuario
    const { data: user, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    // error real de DB
    if (findError) {
      setError("Error en la base de datos");
      setLoading(false);
      return;
    }

    // 2. si NO existe → crear usuario automático
    if (!user) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          id: userId,
          password: password,
          coins: 1000, // 🔥 bonus inicial
        })
        .select()
        .single();

      if (insertError) {
        setError("Error creando usuario");
        setLoading(false);
        return;
      }

      localStorage.setItem("currentUserId", newUser.id);
      localStorage.setItem("coins", String(newUser.coins));

      setLoading(false);
      router.push("/home");
      return;
    }

    // 3. si existe → validar password
    if (user.password !== password) {
      setError("Contraseña incorrecta");
      setLoading(false);
      return;
    }

    // 4. login correcto
    localStorage.setItem("currentUserId", user.id);
    localStorage.setItem("coins", String(user.coins));

    setLoading(false);
    router.push("/home");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Login / Registro</h1>

        <input
          className="w-full px-3 py-2 rounded bg-slate-700"
          placeholder="ID de usuario"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          className="w-full px-3 py-2 rounded bg-slate-700"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-yellow-400 text-black font-bold py-2 rounded"
        >
          {loading ? "Procesando..." : "Entrar"}
        </button>
      </div>
    </main>
  );
}