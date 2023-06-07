import axios from 'axios';

const cardsApi = axios.create({
  baseURL: 'http://127.0.0.1:3001/cards/'
});

const cardService = {
  /**
   * Creates a new card
   * @param {object} card The card object to create
   * @returns {Promise<object>} The created card object
   */
  createCard: async function(card) {
    const response = await cardsApi.post('', card, { new: true })
    return response.data;
  },

  /**
   * Deletes a card with the specified id
   * @param {number} id The id of the card to delete
   * @returns {Promise<boolean>} True if successful
   */
  deleteCard: async function(id) {
    const response = await cardsApi.delete(`${id}`);
    return (response.status === 200);
  },

  /**
   * Updates a card with new data
   * @param {number} id The id of the card to update
   * @param {*} card The updated card object
   * @returns {Promise<object>} The updated card
   */
  updateCard: async function(id, card) {
    const response = await cardsApi.put(`${id}`, card)
    return response.data;
  }
}

export default cardService;