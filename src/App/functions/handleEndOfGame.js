export function handleEndOfGames(users) {
  // Znajdujemy pierwszego użytkownika, którego wszystkie karty są inne niż "virus" lub "empty"
  const wonPlayer = users.find((user) => {
    const { k1, k2, k3, k4 } = user
    return ![k1, k2, k3, k4].some(
      (card) => card.includes("virus") || card.includes("empty")
    )
  })

  // Jeśli znajdzie zwycięzcę, zwracamy jego `id`; w przeciwnym razie zwracamy `false`
  return wonPlayer ? wonPlayer.id : false
}
