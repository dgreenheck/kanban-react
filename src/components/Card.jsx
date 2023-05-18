export default function Card({ card, onCardDragEnded }) {
  return (
    <div
      id={card.id}
      className="card"
      draggable
      onDragEnd={(event) => onCardDragEnded(card.id, event)}
    >
      <h1 className="card-header" style={{ backgroundColor: card.color }}>
        {card.title}
      </h1>
      <p className="card-body">{card.description}</p>
    </div>
  );
}
