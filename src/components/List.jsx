import React, { useState } from "react";
import Card from "./Card";

/**
 * Creates a new List component
 * @param {{
 *  list: { id: string, name: string },
 *  cards: Array<object>,
 *  focusedCard: object,
 *  onCardCreated: (object) => (),
 *  onCardDeleted: (object, string, number) => (),
 *  onCardMoved: (object) => (),
 *  onListDeleted: (string) => ()
 * }} params
 */
export default function List({
  list,
  cards,
  focusedCard,
  onCardCreated,
  onCardDeleted,
  onCardMoved,
  onListDeleted,
}) {
  const [dragData, setDragData] = useState(null);

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
        isNew={card.id === focusedCard?.id}
        onDelete={onCardDeleted}
      />
    ));

  // If a card is being dragged, show a translucent placeholder
  if (dragData) {
    const draggedCard = cards.find((card) => card.id === dragData.cardId);
    listCards.splice(
      dragData.position,
      0,
      <Card
        key={-1}
        card={draggedCard}
        isBeingDragged={true}
      />
    );
  }

  return (
    <div
      id={`list-${list.id}`}
      className="list"
      onDragOver={dragOver}
      onDrop={cardDropped}
      onDragLeave={() => setDragData(null)}
    >
      <div className="list-header">
        <h1 className="list-title">{list.name}</h1>
        <button className="button-icon" onClick={deleteList}>
          <img className="icon" src="images/trash.png" alt="delete"></img>
        </button>
      </div>
      {listCards}
      <button id="add-card-button" onClick={() => onCardCreated(list.id)}>
        + Add card to list
      </button>
    </div>
  );
  
  /**
   * Prompts user if they want to delete the list
   */
  function deleteList() {
    // eslint-disable-next-line no-restricted-globals
    if(confirm(`Are you sure you want to delete the list ${list.name}?`)) {
      onListDeleted(list.id)
    }
  }

  /**
   *
   * @param {DragEvent} e Drag event data
   */
  function dragOver(e) {
    setDragData({
      cardId: e.dataTransfer.getData("cardId"),
      position: calculateListPosition(e),
    });
  }

  /**
   * A card was dropped on this list
   * @param {DragEvent} e Drag event data
   */
  function cardDropped(e) {
    const cardId = e.dataTransfer.getData("cardId");
    onCardMoved(cardId, list.id, calculateListPosition(e));
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
    const listElement = document.getElementById(`list-${list.id}`);
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
