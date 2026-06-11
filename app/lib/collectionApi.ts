import { supabase } from "../lib/supabaseClient";

export async function addCardToCollection(userId: string, playerId: number) {
  const { error } = await supabase
    .from("collections")
    .insert({ user_id: userId, player_id: playerId });

  if (error && error.code !== "23505") { // ignora conflicto si PK (user_id, player_id)
    throw error;
  }
}

export async function getUserCollection(userId: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("player_id");

  if (error) throw error;
  return data?.map((r) => r.player_id) || [];
}
