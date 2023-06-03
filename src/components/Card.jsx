import { useState } from "react";
import api from "../services/api.js";
import EditableCard from "./EditableCard.jsx";

/**
 * Creates a new Card component
 * @param {{
 *  card: object,
 *  isNew: boolean
 * }} param0
 * @returns
 */
export default function Card({ card, isNew = false, isBeingDragged = false, onDelete }) {
  let [isEditing, setIsEditing] = useState(isNew);
  let [isDragging, setIsDragging] = useState(false);

  return isEditing ? (
    <EditableCard
      card={card}
      onCancel={() => setIsEditing(false)}
      onDelete={deleteCard}
      onSave={save}
      onColorSelected={updateCardColor}
    ></EditableCard>
  ) : (
    <div
      id={`card-${card.id}`}
      className={isBeingDragged ? "card dragging" : "card"}
      style={{ 
        backgroundColor: card.color,
        display: isDragging ? "none" : "block"
      }}
      draggable
      onDragStart={dragStart}
      onDragEnd={() => setIsDragging(false)}
      onClick={() => setIsEditing(!isEditing)}
    >
      <span className="card-description">{card.description}</span>
    </div>
  );

  function updateCardColor(color) {
    card.color = color;
  }

  /**
   * Prompts user if they want to delete the cadr
   */
  function deleteCard() {
    // eslint-disable-next-line no-restricted-globals
    if(confirm('Are you sure you want to delete this card?')) {
      onDelete(card);
    }
  }

  function save() {
    const descriptionElement = document.getElementById(
      `card-${card.id}-textarea`
    );
    card.description = descriptionElement.value;
    api.updateCard(card);
    setIsEditing(false);
  }

  /**
   * The user has started to drag this card
   * @param {DragEvent} e
   */
  function dragStart(e) {
    // Store the card data in the dataTransfer property of the drag event
    e.dataTransfer.setData("cardId", card.id);
    setIsDragging(true);
  }
}
