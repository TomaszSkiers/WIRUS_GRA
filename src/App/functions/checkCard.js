export async function checkCards(users, handCard, tableCard) {
  const index = users.findIndex((user) => user.id === tableCard[0])
  const { k1, k2, k3, k4 } = users[index]

  // Sprawdzenie, czy handCard[1] znajduje się w tablicy organów
  if (["brain", "stomach", "pelvis", "heart"].includes(handCard[1])) {
    // todo na stole może leżeć np: brain-virus a ja mogę położyć brain to trzeba zablokować
    console.log("karta jest organem")
    if (tableCard[2] === "empty-card") {
      console.log("karta na stoliku jest pusta")
      if (
        [k1, k2, k3, k4].includes(handCard[1]) ||
        [k1, k2, k3, k4].includes(`${handCard[1]}-virus`)
      ) {
        return [
          tableCard[2],
          "już jest taki sam organ (może być zawirusowany lub zaszczepiony) nie można położyć drugiego takiego samego, tracisz kolejkę, zakończ turę"
        ]
      } else {
        return [
          handCard[1],
          "ruch wykonany poprawnie dodano kartę do stolika zatwierdź turę"
        ]
      }
    } else {
      console.log("organ można położyć tylko na pustej karcie")
      return [
        tableCard[2],
        "nie można położyć organu na organ, tracisz kolejkę zatwierdź turę"
      ]
    }
  } else if (handCard[1].includes("virus")) {
    //jeżeli karta w ręku zawiera słowo 'virus' to karta w ręku jest wirusem
    //heart-virus, brain-virus itd. ale nie heart-medicine

    if (tableCard[2] != "empty-card") {
      //jeżeli na stoliku not empty-card

      //sprawdzam czy kładę wirusa odpowiedniego typu np: brain  -> brain-virus; brain -> heart-virus
      //wyodrębniam słowo przed -virus z każdej karty i porównuję jeśli się zgadza to jest to wirus tego dla tego organu

      if (tableCard[2].split("-")[0] === handCard[1].split("-")[0]) {
        //co może leżeć na stole: wszystko oprócz pustej karty
        //*nie sprawdzi np: heart-medicine bo odetnie -virus nie -medicine

        //jeśli wirus odpowiedni to możliwe są takie scenariusze:
        //1. brain -> brain-virus => brain-virus
        //2. brain-virus -> brain-virus => empty-card
        //3. brain-medicine -> brain-virus => brain

        if (tableCard[2] === tableCard[2].split("-")[0]) {
          return [
            `${tableCard[2].split("-")[0]}-virus`,
            "zdrowy organ został zawirusowany, poprawny ruch, zakończ turę"
          ]
        } else if (tableCard[2] === `${tableCard[2].split("-")[0]}-medicine`) {
          return [
            tableCard[2].split("-")[0],
            "organ, który był zaszczepiony stracił ochronę, poprawny ruch, zakończ turę"
          ]
        } else if (tableCard[2] === `${tableCard[2].split("-")[0]}-virus`) {
          return [
            "empty-card",
            "organ chory został ponownie zawirusowany co spowodowało jego śmierć, usunięto go ze stolika, poprawny ruch, zakończ turę"
          ]
        } else {
          console.log(tableCard[2].split("-")[0])
          return ["empty-card", "tu jest coś zjabane"]
        }
      } else {
        return [
          tableCard[2],
          "nieodpowiedni virus dla tego organu, tracisz kolejkę, zakończ turę"
        ]
      }
    } else {
      console.log("karta na stole jest pusta")
      return [
        "empty-card",
        "możesz położyć wirusa na organ lub na organ zaszczepiony lub na organ zawirusowany ale nie na pusty stolik tracisz kolejkę zatwierdź turę"
      ]
    }
  } else if (handCard[1].includes("medicine")) {
    if (tableCard[2] != "empty-card") {
      if (tableCard[2].split("-")[0] === handCard[1].split("-")[0]) {
        if (tableCard[2] === tableCard[2].split("-")[0]) {
          return [
            `${tableCard[2].split("-")[0]}-medicine`,
            "zdrowy organ został zaszczepiony, poprawny ruch, zakończ turę"
          ]
        } else if (tableCard[2] === `${tableCard[2].split("-")[0]}-medicine`) {
          return [
            `${tableCard[2].split("-")[0]}-medicine`,
            "organu zaszczepiony w przyszłości będzie uodporniony narazie nic się nie dzieje, poprawny ruch, zakończ turę"
          ]
        } else if (tableCard[2] === `${tableCard[2].split("-")[0]}-virus`) {
          return [
            `${tableCard[2].split("-")[0]}`,
            "organ zawirusowany został uleczony, poprawny ruch, zakończ turę"
          ]
        } else {
          console.log(tableCard[2].split("-")[0])
          return ["empty-card", "tu jest coś zjabane"]
        }
      } else {
        return [
          tableCard[2],
          "nieodpowiedni virus dla tego organu, tracisz kolejkę, zakończ turę"
        ]
      }
    } else {
      return [
        tableCard[2],
        "mie możesz położyć lekarstwa na pusty stolik ( musi leżeć organ lub organ zaszczepiony lub organ zawirusowany), tracisz kolejkę, zakończ turę"
      ]
    }
    //
  } else {
    return ["empty-card", "jesteś w else"]
  }
}

//mam tak karta w ręku jest wiruserm, karta na stole nie jest pusta i wywala

// handCard     [index, 'stomach']
// tableCard    [id, index, 'empty-card']
// obj user:
// {
//     "id": "bfa82c45-4673-4229-80ff-017ba847fea9",
//     "order": 1,
//     "table": "blue",
//     "k1": "empty-card",
//     "k2": "empty-card",
//     "k3": "empty-card",
//     "k4": "empty-card",
//     "app_id": "pxqieedm",
//     "time": "2024-11-05T09:22:42.437779+00:00"
// }
