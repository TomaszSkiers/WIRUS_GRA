/**
 * Losuje unikalne karty z tablicy.
 * @param {Array} cardsArray - Tablica kart do losowania.
 * @param {number} numOfCards - Liczba kart do wylosowania.
 * @returns {Array} - Tablica wylosowanych kart.
 */
 const getRandomCards = (cardsArray, numOfCards) => {
  // Tworzenie kopii tablicy, aby nie modyfikować oryginalnej
  const shuffledCards = [...cardsArray].sort(() => 0.5 - Math.random())

  // Zwrócenie pierwszych 'numOfCards' kart
  return shuffledCards.slice(0, numOfCards)
}
export default getRandomCards