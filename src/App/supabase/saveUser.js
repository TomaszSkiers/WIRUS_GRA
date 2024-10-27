import supabase from "./supabase"

const addUserData = async (name) => {
  const { data, error } = await supabase
  .from('users')
  .insert([{ name }])
  .select()
  .single()
  // .select('*') // Dodajemy tę linię, aby uzyskać dodane dane
  // .single(); // Opcjonalnie: jeśli chcesz uzyskać tylko jeden rekord
  if (error) {
    console.log("error adding user data", error)
  } else {
    console.log("user data added", data)
    return data
  }
}

export default addUserData
