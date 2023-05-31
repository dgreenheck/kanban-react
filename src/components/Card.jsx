import { useState } from 'react';
import api from '../services/api.js';

export default function Card({ card, initialEditState, onDragEnter, onDragEnd }) {
  let [isEditing, setIsEditing] = useState(initialEditState);

  return (isEditing ? editableCard() : readOnlyCard());

  function saveCard() {
    const descriptionElement = document.getElementById(`card-${card.id}-textarea`);
    card.description = descriptionElement.value; 
    api.updateCard(card);
    setIsEditing(false);
  }

  function readOnlyCard() {
    return (
      <div
        id={card.id}
        className="card"
        draggable
        onClick={() => setIsEditing(!isEditing)}
        onDragEnter={() => onDragEnter(card)}
        onDragEnd={() => onDragEnd(card)}
      >
        <span>{card.description}</span>
      </div>
    );
  }
  
  function editableCard() {
    return (
      <div id={card.id} className="card editing">
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