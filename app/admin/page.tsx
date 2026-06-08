"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type User = {
  id: string;
  password: string;
  coins: number;
  collection?: any[];
  album?: any[];
};

export default function AdminPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loaded, setLoaded] = useState(false);

   // 🔒 verificar si el usuario actual es admin
  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId");

    // cambia "admin" por el ID que quieras que tenga permiso
    if (currentUserId !== "Vado") {
      setAllowed(false);
      router.push("/home"); // o "/login"
      return;
    }
     setAllowed(true);

    const raw = localStorage.getItem("users");
    if (raw) {
      setUsers(JSON.parse(raw));
    }
  }, [router]);

  const loadUsers = () => {
    const raw = localStorage.getItem("users");
    if (!raw) {
      setUsers({});
      return;
    }
    setUsers(JSON.parse(raw));
  };

  const saveUsers = (updated: Record<string, User>) => {
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  useEffect(() => {
    loadUsers();
    setLoaded(true);
  }, []);

  const handleCoinsChange = (id: string, value: string) => {
    const coins = Number(value) || 0;
    const updated = { ...users };
    if (!updated[id]) return;
    updated[id].coins = coins;
    saveUsers(updated);
  };

  const handlePasswordChange = (id: string, value: string) => {
    const updated = { ...users };
    if (!updated[id]) return;
    updated[id].password = value;
    saveUsers(updated);
  };

  const resetUserData = (id: string) => {
    const updated = { ...users };
    if (!updated[id]) return;
    updated[id].collection = [];
    updated[id].album = [];
    saveUsers(updated);
  };

  const restoreAlbum = (id: string) => {
  // borrar las pegadas de este usuario
  localStorage.removeItem(`placed-${id}`);

  // opcional: limpiar campo album en el objeto user
  const updated = { ...users };
  if (!updated[id]) return;
  updated[id].album = [];
  saveUsers(updated);
};

  const userEntries = Object.entries(users);

   if (allowed === null) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Cargando...</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>No tienes permiso para ver esta página.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">

         <button
      
      onClick={() => {
      window.location.href = "/home";
      }}
      className="mb-4 inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full border border-white/20 text-slate-200 hover:bg-white/10 transition"
      >
      ← Volver
      </button>



      <h1 className="text-3xl font-bold mb-6">Panel de administración</h1>

      {!loaded ? (
        <p>Cargando...</p>
      ) : userEntries.length === 0 ? (
        <p className="text-slate-400">
          No hay usuarios en localStorage todavía.
        </p>
      ) : (
        <div className="space-y-4">
          {userEntries.map(([id, user]) => (
            <div
              key={id}
              className="border border-white/10 rounded-xl p-4 flex flex-col gap-3 bg-slate-800/60"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{user.id}</p>
                  <p className="text-xs text-slate-400">
                    Cartas: {user.collection?.length || 0} • Álbum:{" "}
                    {user.album?.length || 0}
                  </p>
                </div>
                <button
                  onClick={() => resetUserData(id)}
                  className="text-xs px-3 py-1 rounded bg-red-500/80 hover:bg-red-600"
                >
                  Reset cartas Colección
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => restoreAlbum(id)}
                  className="text-xs px-3 py-1 rounded bg-blue-500/80 hover:bg-blue-600"
                >
                  Restaurar álbum
                </button>
                
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Monedas
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-700 rounded px-3 py-2 text-sm"
                    value={user.coins ?? 0}
                    onChange={(e) =>
                      handleCoinsChange(id, e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-700 rounded px-3 py-2 text-sm"
                    value={user.password || ""}
                    onChange={(e) =>
                      handlePasswordChange(id, e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
