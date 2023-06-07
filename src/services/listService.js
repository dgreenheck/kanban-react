import axios from 'axios';

const listsApi = axios.create({
  baseURL: 'http://127.0.0.1:3001/lists'
});

const api = {
  /**
   * Retrieves all lists
   * @returns {Promise<object[]>} An array of all the list objects
   */
  getLists: async function() {
    const response = await listsApi.get('')
    return response.data;
  },

  /**
   * Creates a new list
   * @param {object} list The list object to create
   * @returns {Promise<object>} The created list object
   */
  createList: async function(list) {
    const response = await listsApi.post('', list);
    return response.data;
  },

  /**
   * Deletes a list with the specified id
   * @param {number} id The id of the list to delete
   * @returns {Promise<boolean>} True if successful
   */
  deleteList: async function(id) {
    const response = await listsApi.delete(`${id}`);
    return (response.status === 200);
  }
}

export default api;