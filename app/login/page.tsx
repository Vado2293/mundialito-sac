"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const users: any = JSON.parse(localStorage.getItem("users") || "{}");

    // Si no existe, lo creamos
    if (!users[userId]) {
      users[userId] = {
        id: userId,
        password,
        coins: 500,
        collection: [],
        album: [],
      };
      localStorage.setItem("users", JSON.stringify(users));
    } else {
      // Validar contraseña
      if (users[userId].password !== password) {
        setError("Contraseña incorrecta");
        return;
      }
    }

    // Guardar usuario actual
    localStorage.setItem("currentUserId", userId);
    router.push("/home"); // ir a la home
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Ingresar</h1>

        <input
          className="w-full px-3 py-2 rounded bg-slate-700"
          placeholder="ID de usuario"
          value={userId}
          onChange={e => setUserId(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 rounded bg-slate-700"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 text-black font-bold py-2 rounded"
        >
          Entrar / Registrarse
        </button>
      </div>
    </main>
  );
}
