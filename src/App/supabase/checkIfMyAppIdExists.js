import supabase from "./supabase"

export async function checkIfMyAppIdExists(appId) {
  try {
    //przeszukaj bazę czy istnieje moje appId
    const { data: idExist, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("app_id", appId)

    if (fetchError) {
      console.log("coś nie tak ze sprawdzeniem czy moje appId jest już w bazie")
      return
    } else {
      return idExist
    }
  } catch {
    console.log("wystąpił nieoczekiwany błąd w checkIfMyAppIdExists")
  }
}
