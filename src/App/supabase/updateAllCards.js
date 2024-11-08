import supabase from "./supabase";

export async function updateAllCards(user) {
    console.log(user)
    const {id, k1, k2, k3, k4 } = user
    const { error } = await supabase
    .from('users')
    .update({
        k1: k1,
        k2: k2,
        k3: k3,
        k4: k4,
        time: `NOW()`,
    })
    .eq('id', id)
    

    if(error) {
        console.log("błąd podczas ustawiania użytkownika na active", error)
    }else{
        // 
    }
}