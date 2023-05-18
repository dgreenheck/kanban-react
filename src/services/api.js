import data from './data.json';

const api = {
  getColumns: function() {
    return data.columns;
  },
  getCards: function() {
    return data.cards;
  }
}

export default api;