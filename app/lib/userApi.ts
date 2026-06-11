import { supabase } from "../lib/supabaseClient";

export async function getUser(id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function updateUserCoins(id: string, coins: number) {
  const { error } = await supabase
    .from("users")
    .update({ coins })
    .eq("id", id);

  if (error) throw error;
}
