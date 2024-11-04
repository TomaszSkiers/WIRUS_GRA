import supabase from "./supabase";

export async function updateCards(id, card, cardValue) {
    const { error } = await supabase
    .from('users')
    .update({
        
        [card]: cardValue,
    })
    .eq('id', id)
    

    if(error) {
        console.log("błąd podczas ustawiania użytkownika na active", error)
    }else{
        // 
    }
}