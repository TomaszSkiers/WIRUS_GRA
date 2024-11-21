import supabase from "./supabase";

export async function putEmptyCard(id) {
    console.log('user jest')
    const {error} = await supabase
    .from('users')
    .update({
        k1: 'empty-card',
        k2: 'empty-card',
        k3: 'empty-card',
        k4: 'empty-card',
        time: `NOW()`,
        app_id: null,
    })
    .eq('id', id)

    if(error){
        console.log('coś nie tak z winner empty-card')
    }
}