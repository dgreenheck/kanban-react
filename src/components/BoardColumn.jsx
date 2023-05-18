import Card from "./Card";

export default function BoardColumn({ column, cards, onCardDragEnded }) {
  console.log(`column ${column.id} updated`)
  return (
    <div id={column.id} className="column">
      <h1 className="column-header">{column.label}</h1>
      {cards.map((card) => {
        return (
          <Card key={card.id} card={card} onCardDragEnded={onCardDragEnded} />
        );
      })}
    </div>
  );
}
