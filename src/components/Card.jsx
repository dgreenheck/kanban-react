import { useState } from 'react';
import api from '../services/api.js';

/**
 * Creates a new Card component
 * @param {{
 *  card: object,
 *  initialEditState: boolean
 * }} param0 
 * @returns 
 */
export default function Card({ card, initialEditState, isBeingDragged }) {
  let [isEditing, setIsEditing] = useState(initialEditState);
  let [isDragging, setIsDragging] = useState(false);

  if (isEditing) {
    return editableCard();
  } else {
    return readOnlyCard()
  }

  function saveCard() {
    const descriptionElement = document.getElementById(`card-${card.id}-textarea`);
    card.description = descriptionElement.value; 
    api.updateCard(card);
    setIsEditing(false);
  }

  function readOnlyCard() {
    return (
      <div
        id={`card-${card.id}`}
        className={isBeingDragged ? 'card dragging' : 'card'}
        style={isDragging ? { display: 'none' } : {}}
        draggable
        onDragStart={dragStart}
        onDragEnd={() => setIsDragging(false)}
        onClick={() => setIsEditing(!isEditing)}
      >
        <span>{card.description}</span>
      </div>
    );
  }
  
  function editableCard() {
    return (
      <div id={`card-${card.id}`} className="card editing">
        <textarea 
          id={`card-${card.id}-textarea`} 
          autoFocus={true}
          onFocus={resizeTextArea}
          onInput={resizeTextArea}
          defaultValue={card.description}
        >
        </textarea>
        <button className="button-primary" onClick={() => saveCard(card)}>
          Save
        </button>
        <button className="button-cancel" onClick={() => setIsEditing(!isEditing)}>
          Cancel
        </button>
      </div>
    );
  }

  function dragStart(event) {
    // Store the card data in the dataTransfer property of the drag event
    event.dataTransfer.setData('cardId', card.id);
    setIsDragging(true);
  }

  /**
   * Resizes the text area to fit the contents
   */
  function resizeTextArea() {
    const textArea = document.getElementById(`card-${card.id}-textarea`);
    textArea.style.height = '';
    textArea.style.height = `${textArea.scrollHeight + 3}px`;
    console.log(textArea.scrollHeight);
  }
}