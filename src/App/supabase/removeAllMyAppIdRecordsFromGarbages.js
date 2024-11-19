import supabase from "./supabase"

export async function removeAllMyAppIdRecordsFromGarbages(appId) {
  try {
    //wyszukaj wszystkie moje rekordy i usuń
    const { error: err } = await supabase
      .from("users")
      .update({app_id: null})
      .eq("app_id", appId)

    if (err) {
      console.log("błąd podczas wpisywania nulla do zdublowanych rekordów")
    }
  } catch {
    console.log("coś nie tak w funkcji removeAllMyAppIdRecordsFromGarbages")
  }
}
