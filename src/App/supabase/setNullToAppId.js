import supabase from "./supabase";

export async function setNullToAppId(id) {
    const { error } = await supabase
    .from('users')
    .update({app_id: null})
    .eq('id', id)
   
    if(error) {
        console.log("błąd podczas ustawiania użytkownika na null", error)
    }else{
        console.log('ustawiono nulla')
    }
}