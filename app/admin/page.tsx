"use client";

export const dynamic = "force-dynamic";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../app/lib/supabaseClient";



type User = {
  id: string;
  password: string;
  coins: number;

  collectionCount?: number;
  albumCount?: number;
};

export default function AdminPage() {
  const router = useRouter();

  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ==========================
  // VALIDAR ADMIN
  // ==========================
  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId");

    if (currentUserId !== "Vado") {
      router.push("/home");
      setAllowed(false);
      return;
    }

    setAllowed(true);
  }, [router]);

  useEffect(() => {
    if (allowed) {
      loadUsers();
    }
  }, [allowed]);

  // ==========================
  // CARGAR USUARIOS
  // ==========================
  const loadUsers = async () => {
  setLoading(true);

 const { data: usersData, error } = await supabase
  .from("users")
  .select("*");
   

  if (error) {
    console.error(error);
    setLoading(false);
    return;
  }

  const enrichedUsers = await Promise.all(
     (usersData as any[] || []).map(async (user: any) => {
    const { count: collectionCount } = await supabase
      .from("user_cards")
      .select("*", {
        count: "exact",
        head: true,
        })
        .eq("user_id", user.id);

      const { count: albumCount } = await supabase
        .from("album_placed")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

      return {
        ...user,
        collectionCount: collectionCount || 0,
        albumCount: albumCount || 0,
      };
    })
  );

  setUsers(enrichedUsers);
  setLoading(false);
};

 // ==========================
  // ACTUALIZAR COINS

const updateCoins = async (
  userId: string,
  coins: number
) => {
  const { error } = await supabase
    .from("users")
    .update({ coins })
    .eq("id", userId);

  if (error) {
    console.error(error);
    return;
  }

  loadUsers();
};

  // ==========================
  // crear usuario

const createUser = async () => {
  if (!newUser || !newPassword) {
    alert("Complete usuario y contraseña");
    return;
  }

  const { error } = await supabase
    .from("users")
    .insert({
      id: newUser,
      password: newPassword,
      coins: 0,
    });

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  setNewUser("");
  setNewPassword("");

  await loadUsers();
};
  // ==========================
  // ACTUALIZAR PASSWORD
  // ==========================
  const updatePassword = async (
  userId: string,
  password: string
) => {
  const { error } = await supabase
    .from("users")
    .update({ password })
    .eq("id", userId);

  if (error) {
    console.error(error);
    return;
  }

  loadUsers();
};

  // ==========================
  // RESETEAR COLECCION
  // ==========================
 const resetCollection = async (
  userId: string
) => {
  if (
    !confirm(
      `Eliminar todas las cartas de ${userId}?`
    )
  ) {
    return;
  }

  const { error } = await supabase
    .from("user_cards")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return;
  }

  await loadUsers();
};

  // ==========================
  // RESTAURAR ALBUM
  // ==========================
  const restoreAlbum = async (
  userId: string
) => {
  if (
    !confirm(
      `Vaciar álbum de ${userId}?`
    )
  ) {
    return;
  }

  const { error } = await supabase
    .from("album_placed")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return;
  }

  await loadUsers();
};

  if (allowed === null || loading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Cargando...
      </main>
    );
  }

  if (!allowed) {
    return null;
  }

return (
  <main className="min-h-screen bg-slate-900 text-white p-8">
    <button
      onClick={() => (window.location.href = "/home")}
      className="mb-6 px-4 py-2 border border-white/20 rounded"
    >
      ← Volver
    </button>

    <h1 className="text-3xl font-bold mb-8">
      Panel Administración
    </h1>

    {/* CREAR USUARIO */}
    <div className="mb-8 border border-white/10 rounded-xl p-5 bg-slate-800">
      <h2 className="font-bold text-xl mb-4">
        Crear usuario
      </h2>

      <div className="grid md:grid-cols-3 gap-3">
        <input
          value={newUser}
          onChange={(e) =>
            setNewUser(e.target.value)
          }
          placeholder="Usuario"
          className="bg-slate-700 rounded px-3 py-2"
        />

        <input
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          placeholder="Contraseña"
          className="bg-slate-700 rounded px-3 py-2"
        />

        <button
          onClick={createUser}
          className="bg-green-600 hover:bg-green-700 rounded px-3 py-2"
        >
          Crear usuario
        </button>
      </div>
    </div>

    <div className="space-y-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onCoins={updateCoins}
          onPassword={updatePassword}
          onResetCollection={resetCollection}
          onRestoreAlbum={restoreAlbum}
        />
      ))}
    </div>
  </main>
);
}

function UserCard({
  user,
  onCoins,
  onPassword,
  onResetCollection,
  onRestoreAlbum,
}: any) {
  const [coins, setCoins] = useState(
    user.coins || 0
  );

  const [password, setPassword] =
    useState(
      user.password || ""
    );

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
      <div className="mb-4">
        <h2 className="font-bold text-xl">
          {user.id}
        </h2>

        <div className="text-sm text-slate-400 mt-2 flex flex-wrap gap-4">
          <span>
            📦 Colección:{" "}
            <strong className="text-white">
              {user.collectionCount || 0}
            </strong>
          </span>

          <span>
            📘 Álbum:{" "}
            <strong className="text-white">
              {user.albumCount || 0}
            </strong>
          </span>

          <span>
            🪙 Monedas:{" "}
            <strong className="text-white">
              {user.coins || 0}
            </strong>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1">
            Monedas
          </label>

          <input
            value={coins}
            type="number"
            onChange={(e) =>
              setCoins(
                Number(e.target.value)
              )
            }
            className="w-full bg-slate-700 px-3 py-2 rounded"
          />

          <button
            onClick={() =>
              onCoins(
                user.id,
                coins
              )
            }
            className="mt-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm"
          >
            Guardar monedas
          </button>
        </div>

        <div>
          <label className="block text-xs mb-1">
            Contraseña
          </label>

          <input
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full bg-slate-700 px-3 py-2 rounded"
          />

          <button
            onClick={() =>
              onPassword(
                user.id,
                password
              )
            }
            className="mt-2 bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-sm"
          >
            Guardar contraseña
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          onClick={() =>
            onResetCollection(
              user.id
            )
          }
          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
        >
          Reset colección
        </button>

        <button
          onClick={() =>
            onRestoreAlbum(
              user.id
            )
          }
          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm"
        >
          Restaurar álbum
        </button>
      </div>
    </div>
  );
}