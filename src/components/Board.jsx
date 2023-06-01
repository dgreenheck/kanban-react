import List from "./List";
import api from '../services/api';
import { useEffect, useState } from 'react';
import AddListButton from './AddListButton';

export default function Board() {
  let [focusedCard, setFocusedCard] = useState(null);
  let [lists, setLists] = useState([]);
  let [cards, setCards] = useState({});

  useEffect(() => {
    api.getLists()
      .then(lists => {
        setLists(lists);
      });
    
    api.getCards()
      .then(cards => {
        setCards(cards);
      })
  },[]);

  return (
    <>
      <div className='board-header'>
        <h1 className='board-name'>My Board</h1>
      </div>
      <div className='board'>
        {lists.map((list) => {
          return (
            <List
              key={list}
              list={list}
              cards={cards}
              focusedCard={focusedCard}
              onCardCreated={createCard}
              onCardMoved={moveCard}
              onListDeleted={deleteList}
            />
          );
        })}
        <AddListButton onAddList={createList}/>
      </div>
    </>
  );

  /**
   * Creates a new card
   * @param {string} list The name of the list to add the card to
   */
  function createCard(list) {
    const card = {
      id: Math.floor(32768 * Math.random()),
      description: '',
      list,
      order: 0
    }

    // TODO: Make API call
    console.log('Created new card');
    console.log(card);

    setFocusedCard(card);

    // Update state
    const newCards = [...cards, card];
    setCards(newCards);
  }

  /**
   * Creates a new list
   * @param {string} list 
   */
  function createList(list) {
    // TODO: Make API call
    console.log('Created new list');
    console.log(list);

    // Update state
    const newLists = [...lists, list];
    setLists(newLists);
  }

  /**
   * Moves a card to the target list
   * @param {object} id ID of the moved card 
   * @param {string} targetList The name of the list the card was moved to
   * @param {number} dragIndex The position of the card in the list
   */
  function moveCard(id, targetList, dragIndex) {
    let updatedCards = [...cards];

    console.log(`Moving card ${id} to list ${targetList} at position ${dragIndex}`);

    // Find the other cards in the list and update their positions
    updatedCards
      .filter(card => card.id !== id)
      .filter(card => card.list === targetList)
      .forEach(card => {
        if (card.position >= dragIndex) {
          card.position += 1;
        }
      })

    // Move the card to the target list and update its posiiton
    const movedCard = cards.find(card => card.id === id);
    movedCard.list = targetList;
    movedCard.position = dragIndex;

    console.log(updatedCards);

    // MAKE API CALL

    setCards(updatedCards);
  }

  /**
   * Deletes a list
   * @param {*} list 
   */
  function deleteList(listToDelete) {
    // TODO: Make API call
    console.log('Deleted list');
    console.log(listToDelete);

    // Update state
    const newLists = lists.filter(list => list !== listToDelete);
    setLists(newLists);
  }
}
