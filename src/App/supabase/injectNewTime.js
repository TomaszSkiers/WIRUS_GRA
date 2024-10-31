import supabase from "./supabase";

export async function injectNewTime(id) {
    const { error } = await supabase
    .from('users')
    .update({time: `NOW()`})
    .eq('app_id', id)
    

    if(error) {
        console.log("błąd podczas ustawiania użytkownika na active", error)
    }else{
        // 
    }
}