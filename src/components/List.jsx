import Card from "./Card";

/**
 * Creates a new List component
 * @param {{
 *  list: string,
 *  cards: Array<object>,
 *  onCardCreated: (object) => (),
 *  onCardDragEnded: React.DragEventHandler
 * }} params
 * @returns
 */
export default function List({
  list,
  cards,
  focusedCard,
  onAddCardToListClicked,
  onCardDragEnded,
}) {
  console.log(`List ${list} updated`);

  // Get the cards in this list
  const listCards = cards.filter((card) => card.list === list);

  return (
    <div id={list} className="list">
      <h1 className="list-header">{list}</h1>
      {listCards.map((card) => {
        return (
          <Card
            key={card.id}
            card={card}
            // If this card is the currently focused card, start it in
            // an editable state
            initialEditState={focusedCard ? card.id === focusedCard.id : false}
            onCardDragEnded={onCardDragEnded}
          />
        );
      })}
      <button id="add-card-button" onClick={() => onAddCardToListClicked(list)}>
        + Add card to list
      </button>
    </div>
  );
}
