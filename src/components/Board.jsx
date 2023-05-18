import { useState } from "react";
import BoardColumn from "./BoardColumn";

export default function Board(board) {
  const [cards, setCards] = useState(board.cards);

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

  return (
    <div className="board">
      {board.columns.map((column) => {
        return (
          <BoardColumn
            key={column.id}
            column={column}
            cards={cards.filter(card => card.state === column.id)}
            onCardDragEnded={cardDragEnded}
          />
        );
      })}
    </div>
  );
}
