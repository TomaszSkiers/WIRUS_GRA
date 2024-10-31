import supabase from "./supabase" // dostosuj ścieżkę do pliku konfiguracyjnego supabase

export async function injectAppId(newAppId) {
  try {
    // Znajdź pierwszy rekord z app_id równym null
    const { data: firstNullRecord, error: fetchError } = await supabase
      .from("users")
      .select("id") // wybierz pole `id` dla znalezionego rekordu
      .is("app_id", null)
      .limit(1)
      .single()

    if (fetchError) {
      console.error("wszystkie rekordy mogą być zajete, Błąd podczas wyszukiwania rekordu:", fetchError)
      return
    }

    if (firstNullRecord) {
      // Aktualizacja rekordu
      const { error: updateError } = await supabase
        .from("users")
        .update({ 
          app_id: newAppId,
          time: `NOW()`
        })
        .eq("id", firstNullRecord.id)

      if (updateError) {
        console.error("Błąd podczas aktualizacji app_id:", updateError)
      } else {
        console.log("Pomyślnie zaktualizowano app_id:", newAppId)
      }
    } else {
      console.log("Nie znaleziono rekordu z app_id równym null")
    }
  } catch (error) {
    console.error("Wystąpił nieoczekiwany błąd:", error)
  }
}
//funkcja znajduje pierwszy wolny rekord z wartością null w kolumni app_id i wstrzykuje idApp