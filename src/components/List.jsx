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
  const listId = `list-${list}`;
  const [dragData, setDragData] = useState(null);

  // Get the cards in this list (sorted by position)
  let listCards = cards
    .filter((card) => {
      return card.list === list;
    })
    .sort((a, b) => a.position > b.position)
    .map((card) => (
      <Card
        key={card.id}
        card={card}
        // If this card is the currently focused card, start it in
        // an editable state
        isNew={card.id === focusedCard?.id}
      />
    ));

  // If a card is being dragged, show its silhoutte
  if (dragData) {
    const draggedCard = cards.find((card) => card.id === dragData.cardId);
    listCards.splice(
      dragData.position,
      0,
      <Card
        key={-1}
        card={draggedCard}
        isNew={false}
        isBeingDragged={true}
      />
    );
  }

  return (
    <div
      id={listId}
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
      {listCards}
      <button id="add-card-button" onClick={() => onCardCreated(list)}>
        + Add card to list
      </button>
    </div>
  );

  /**
   *
   * @param {DragEvent} e Drag event data
   */
  function dragOver(e) {
    setDragData({
      cardId: Number(e.dataTransfer.getData("cardId")),
      position: calculateListPosition(e),
    });
  }

  /**
   * A card was dropped on this list
   * @param {DragEvent} e Drag event data
   */
  function cardDropped(e) {
    const cardId = Number(e.dataTransfer.getData("cardId"));
    onCardMoved(cardId, list, calculateListPosition(e));
    setDragData(null);
  }

  /**
   * Calculate the position in the list the mouse is currently
   * hovering over
   * @param {DragEvent} e 
   * @returns 
   */
  function calculateListPosition(e) {
    // Get the DOM elements of the cards in this list
    const listElement = document.getElementById(listId);
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
}
