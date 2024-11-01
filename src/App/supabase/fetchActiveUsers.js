import supabase from "./supabase"

/**
 * Funkcja pobierająca wszystkich aktywnych użytkowników z tabeli `users`.
 * @returns {Array} Lista użytkowników lub pustą tablicę w przypadku błędu.
 */
export const fetchActiveUsers = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .not("app_id", "is", null)
    
    if (error) {
      console.error("Błąd podczas pobierania aktywnych użytkowników:", error)
      return []
    }
    return data || [] //zwracamy dane lub pustą tablicę w razie błędu
  } catch (error) {
    console.error("Wystąpił nieoczekiwany błąd:", error)
    return []
  }
}
