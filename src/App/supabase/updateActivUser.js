import supabase from "./supabase";

export async function updateActiveUser(id, isActive) {
    const { data, error } = await supabase
    .from('users')
    .update({active: isActive})
    .eq('id', id)
    .select()
    .single()


    if(error) {
        console.log("błąd podczas ustawiania użytkownika na active", error)
    }else{
        // console.log(`player ${id} jest aktywnym graczem`)
        // console.log('dane zwrócone z bazy', data)
        return data
    }
}

//przeanalizuj dlaczego pobierasz tylko jeden rekord