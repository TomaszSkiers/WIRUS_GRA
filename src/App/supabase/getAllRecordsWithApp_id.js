import supabase from "./supabase";

export async function getAllRecordsWithApp_id(){
    console.log('getAllRecordsWithApp_id start')
    const {data, error} = await supabase 
    .from('users')
    .select('*')
    .not('app_id', 'is', null)

    if(error){
        console.log('problem z pobraniem rekordów')
    }else{
        console.log('rekordy pobrane', data)
        return data
    }
}