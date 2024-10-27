import supabase from "./supabase"

export async function getActiveUsers() {
  const { data: activeUsers, error } = await supabase
    .from("users")
    .select()
    .eq("active", true)

  if (error) {
    console.error("Błąd podczas pobierania aktywnych użytkowników:", error)
    return []
  }

  return activeUsers
}
