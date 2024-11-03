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
//wstawiam do bazy danych informację o czasie zakończenia tury później za pomocą filtrowania usta
//lam czyja jest reraz tura gry

//* tu za chwilkę stawiam nową kartę i nie muszę aktualizować stanu bo on się sam zaktualizuje w
//* w subskrypcji 
//* czyli uruchamiam funkcję do sprawdzenia tych dwóch stanów handCard i tableCard i aktualizuję
//* pole w bazie danych i to co przyleci zaktualizuje stany u wszystkich