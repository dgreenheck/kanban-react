import React, { useState } from "react";
import Card from "./Card";

/**
 * Creates a new List component
 * @param {{
 *  list: string,
 *  cards: Array<object>,
 *  focusedCard: object,
 *  onCardCreated: () => (),
 *  onCardMoved: (object) => (),
 *  onListDeleted: (string) => ()
 * }} params
 */
export default function List({
  list,
  cards,
  focusedCard,
  onCardCreated,
  onCardMoved,
  onListDeleted,
}) {
  const [dragData, setDragData] = useState(null);

  return (
    <div
      id={`list-${list}`}
      className="list"
      onDragOver={dragOver}
      onDrop={cardDropped}
      onDragLeave={() => setDragData(null)}
    >
      <div className="list-header">
        <h1 className="list-title">{list}</h1>
        <button className="button-icon" onClick={() => onListDeleted(list)}>
          <img className="icon" src="images/trash.png" alt="delete"></img>
        </button>
      </div>
      {listCards(cards)}
      <button id="add-card-button" onClick={() => onCardCreated(list)}>
        + Add card to list
      </button>
    </div>
  );

  function listCards(cards) {
    // Get the cards in this list (sorted by position)
    let listCards = cards
    .filter((card) => {
      return (card.list === list)
    });

    listCards.sort((a, b) => a.position > b.position);

    listCards = listCards.map((card) => (
      <Card
        key={card.id}
        card={card}
        // If this card is the currently focused card, start it in
        // an editable state
        initialEditState={card.id === focusedCard?.id}
      />
    ));

    if (dragData) {
      console.log(dragData)
      const draggedCard = cards.find(card => card.id === dragData.cardId);
      console.log(draggedCard);
      listCards.splice(dragData.position, 0, (
        <Card
          key={-1}
          card={draggedCard}
          initialEditState={false}
          isBeingDragged={true}
        />
      ));
    }

    return listCards;
  }

  /**
   *
   * @param {DragEvent} event
   */
  function dragOver(event) {
    setDragData({
      cardId: Number(event.dataTransfer.getData('cardId')),
      position: calculateDragIndex(event)
    });
  }

    /**
   *
   * @param {DragEvent} event
   */
  function cardDropped(event) {
    const cardId = Number(event.dataTransfer.getData('cardId'));
    onCardMoved(cardId, list, calculateDragIndex(event));
    setDragData(null);
  }

  function calculateDragIndex(event) {
    // Get the DOM elements of the cards in this list
    const listElement = document.getElementById(`list-${list}`);
    let listCards = [...listElement.children].filter((card) =>
      card.classList.contains("card")
    );

    const dragY = event.pageY;
    for (let i = 0; i < listCards.length; i++) {
      const cardY = listCards[i].offsetTop + listCards[i].scrollHeight / 2;
      if (dragY < cardY) {
        return i;
      }
    }
    return listCards.length;
  }
}
