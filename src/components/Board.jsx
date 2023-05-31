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
              onAddCardToListClicked={createCard}
              onCardDragEnded={cardDragEnded}
            />
          );
        })}
        <AddListButton/>
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

  function cardDragEnded(cardId, event) {
    // Get the element the card was dropped on
    const targetElement = document.elementFromPoint(event.clientX, event.clientY);

    // Did we drop on a column?
    if (!targetElement.classList.contains('column')) {
      return;
    }

    // Did the state of the card change?
    const oldCardState = cards.find(x => x.id === cardId).state;
    const newCardState = targetElement.id;
    if (oldCardState !== newCardState) {
      let clonedCards = cards.slice();
      const card = clonedCards.find(x => x.id === cardId);
      card.state = newCardState;
      setCards(clonedCards);
    }
  }
}
