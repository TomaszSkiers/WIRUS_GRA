import supabase from "./supabase"

export async function eraseData() {
  console.log("erase data start")
  const time = new Date(Date.now() - 60 * 1000) // Obecny czas minus 60 sekund

  const { data, error } = await supabase
    .from("users")
    .update({
      k1: "empty-card",
      k2: "empty-card",
      k3: "empty-card",
      k4: "empty-card",
      app_id: null
      // time: `NOW()`,
    })
    .lt("time", time.toISOString())
  if (error) {
    console.log("coś poszło nie tak z eraseData")
  } else console.log("zaktualizowane rekordy", data)
}
