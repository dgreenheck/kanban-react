import data from './data.json';

const api = {
  getLists: async function() {
    console.log('getLists');
    console.log(data.lists);
    return data.lists;
  },
  createList: async function(list) {
    console.log('createList');
    console.log(list);
    return true;
  },
  getCards: async function() {
    console.log('getCards');
    console.log(data.cards);
    return data.cards;
  },
  createCard: async function(card) {
    console.log('createCard');
    console.log(card);
  },
  updateCard: async function(card) {
    console.log('updateCard');
    console.log(card);
    return card;
  }
}

export default api;