import React, { useEffect, useState } from "react";
import Card from "./Card";
import cardService from "../services/cardService";
import listService from "../services/listService";

/**
 * Creates a new List component
 * @param {{
 *  list: { id: string, name: string },
 *  onCardMoved: (object) => (),
 *  onListDeleted: (string) => ()
 * }} params
 */
export default function List({ list, onCardMoved, onListDeleted }) {
  const [cards, setCards] = useState([]);
  const [focusedCard, setFocusedCard] = useState(null);
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [draggedCardPosition, setDraggedCardPosition] = useState(0);

  useEffect(() => {
    // Load the cards in this list from the API
    listService.getCards(list.id).then((listCards) => {
      setCards(listCards);
    });
  }, [list]);

  const createCard = async () => {
    const card = {
      listId: list.id,
      position: cards.length,
    };

    const createdCard = await cardService.createCard(card);

    if (createdCard) {
      setFocusedCard(createdCard);
      // Update state
      const newCards = [...cards, createdCard];
      setCards(newCards);
    } else {
      alert("Failed to create card");
    }
  };

  const deleteCard = async (cardId) => {
    const newCards = cards.filter((x) => x.id !== cardId);
    setCards(newCards);
  };

  const moveCard = async (cardId, targetListId, targetPosition) => {
    // Move the card to the target list and update its posiiton
    const card = cards.find((card) => card.id === cardId);

    console.log('Original Card');
    console.log(card);

    // Capture the original position and list
    const originalPosition = card.position;
    const originalListId = card.listId;

    const stuff = { 
      ...card,
      listId: targetListId,
      position: targetPosition,
    };
    
    console.log('Request data');
    console.log(stuff);

    // Update card in database
    const movedCard = await cardService.updateCard(card.id, stuff);

    console.log('Moved Card');
    console.log(card);
    console.log(targetListId);
    console.log(targetPosition);
    console.log(movedCard);

    if (movedCard) {
      // Swap out the original card with the updated card
      const updatedCards = cards.map(card => card.id === cardId ? movedCard : card);

      console.log(updatedCards);

      // Re-order the cards in the original list and target list to
      // account for the deleted/inserted card, respectively.
      await updateCardPositions(updatedCards, originalListId, movedCard.id, originalPosition, null);
      await updateCardPositions(updatedCards, targetListId, movedCard.id, null, targetPosition);
      
      setCards(updatedCards);
      setFocusedCard(null);
    } else {
      alert('Failed to move card.');
    }
  }

  // Event handler triggered when a card is dragged over this list
  const dragOver = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    setDraggedCardId(cardId);
    setDraggedCardPosition(calculateListPosition(e, list.id));
  };

  // Event handler triggered when a card is droppedo n this list
  const cardDropped = (e) => {
    moveCard(draggedCardId, list.id, draggedCardPosition);
    setDraggedCardId(null);
  };

  // Get the cards in this list (sorted by position)
  let listCards = cards
    .filter((card) => {
      return card.listId === list.id;
    })
    .sort((a, b) => a.position > b.position)
    .map((card) => (
      <Card
        key={card.id}
        card={card}
        // If this card is the currently focused card, start it in
        // an editable state
        hasFocus={card.id === focusedCard?.id}
        onDelete={deleteCard}
      />
    ));

  // If a card is being dragged, show a translucent placeholder
  if (draggedCardId) {
    const draggedCard = cards.find((card) => card.id === draggedCardId);
    listCards.splice(
      draggedCardPosition,
      0,
      <Card key={-1} card={draggedCard} placeholder={true} />
    );
  }

  return (
    <div
      id={`list-${list.id}`}
      className="list"
      onDragOver={dragOver}
      onDrop={cardDropped}
      onDragLeave={() => setDraggedCardId(null)}
    >
      <div className="list-header">
        <h1 className="list-title">{list.name}</h1>
        <button className="button-icon" onClick={onListDeleted}>
          <img className="icon" src="images/trash.png" alt="delete"></img>
        </button>
      </div>
      {listCards}
      <button id="add-card-button" onClick={createCard}>
        + Add card to list
      </button>
    </div>
  );
}

function calculateListPosition(e, listId) {
  // Get the DOM elements of the cards in this list
  const listElement = document.getElementById(`list-${listId}`);
  let listCards = [...listElement.children].filter((card) =>
    card.classList.contains("card")
  );

  const dragY = e.pageY;
  for (let i = 0; i < listCards.length; i++) {
    const cardY = listCards[i].offsetTop + listCards[i].scrollHeight / 2;
    if (dragY < cardY) {
      return i;
    }
  }

  return listCards.length;
}

/**
 * Updates the positions of the
 * @param {string} listId
 */
async function updateCardPositions(cards, listId, movedCardId, deletedPosition = null, insertedPosition = null) {
  if (deletedPosition) {
    // Update the positions of the cards in the source list
    cards
      .filter((card) => card.listId === listId && card.id !== movedCardId)
      .forEach(async (card) => {
        // All cards after the moved card need to have their position decremented by 1
        if (card.position > deletedPosition) {
          card.position -= 1;
        }
        await cardService.updateCard(card.id, card);
      });
  }

  // Update the positions of the cards in the target list
  if (insertedPosition) {
    cards
      .filter((card) => card.listId === listId && card.id !== movedCardId)
      .forEach(async (card) => {
        // All cards after the moved card need to have their position incremented by 1
        if (card.position >= insertedPosition) {
          card.position += 1;
        }
        await cardService.updateCard(card.id, card);
      });
  }
}