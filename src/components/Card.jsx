import { useState } from "react";
import EditableCard from "./EditableCard.jsx";

/**
 * Creates a new Card component
 * @param {{
 *  card: object,
 *  hasFocus?: boolean,
 *  dragging?: boolean,
 *  onDelete?: (object) => ()
 * }} param0
 * @returns
 */
export default function Card({
  card,
  hasFocus = false,
  placeholder = false,
  onDelete = null,
}) {
  let [editing, setEditing] = useState(hasFocus);
  let [dragging, setDragging] = useState(false);
  
  const dragStart = (e) => {
    e.dataTransfer.setData("cardId", card.id);
    setDragging(true);
  }

  return editing ? (
    <EditableCard
      card={card}
      onDoneEditing={() => setEditing(false)}
      onDelete={onDelete}
    ></EditableCard>
  ) : (
    <div
      id={`card-${card.id}`}
      className={dragging ? "card dragging" : "card"}
      style={{
        backgroundColor: card.color,
        display: dragging ? "none" : "block",
      }}
      draggable
      onDragStart={dragStart}
      onDragEnd={() => setDragging(false)}
      onClick={() => setEditing(!editing)}
    >
      <span className="card-description">{card.description}</span>
      <div>{card.position}</div>
    </div>
  );
}
