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
              key={list.id}
              list={list}
              cards={cards}
              focusedCard={focusedCard}
              onCardCreated={createCard}
              onCardDeleted={deleteCard}
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
      listId: list.id,
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
   * Deletes a card
   * @param {object}} card The card to delete
   */
    function deleteCard(card) {
      // TODO: Make API call
      console.log('Deleted card');
      console.log(card);
  
      // Update state
      const newCards = cards.filter(x => x.id !== card.id);
      setCards(newCards);
    }

  /**
   * Creates a new list
   * @param {string} name The name of the list
   */
  function createList(name) {
    const list = {
      id: Math.floor(32768 * Math.random()),
      name
    }

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
   * @param {string} targetListId The id of the list the card was moved to
   * @param {number} targetPosition The position of the card in the list
   */
  function moveCard(id, targetListId, targetPosition) {
    let updatedCards = [...cards];

    console.log(cards);

    // Move the card to the target list and update its posiiton
    const movedCard = cards.find(card => card.id === id);

    console.log(movedCard);

    // Update the positions of the cards in the source list
    updatedCards
      .filter(card => card.id !== id)
      .filter(card => card.listId === movedCard.listId)
      .forEach(card => {
        // All cards after the moved card need to have their
        // position decremented by 1
        if (card.position > movedCard.position) {
          card.position -= 1;
        }
      })

    // Update the positions of the cards in the target list
    updatedCards
      .filter(card => card.id !== id)
      .filter(card => card.listId === targetListId)
      .forEach(card => {
        // All cards after the moved card need to have their
        // position incremented by 1
        if (card.position >= targetPosition) {
          card.position += 1;
        }
      })

    // Finally, update list and position for the moved card
    movedCard.listId = targetListId;
    movedCard.position = targetPosition;

    // MAKE API CALL

    setCards(updatedCards);
    setFocusedCard(null);
  }

  /**
   * Deletes a list
   * @param {*} listId Id of the list to delete
   */
  function deleteList(listId) {
    // TODO: Make API call
    console.log('Deleted list');
    console.log(listId);

    // Update state
    const newLists = lists.filter(list => list.id !== listId);
    setLists(newLists);
  }
}
