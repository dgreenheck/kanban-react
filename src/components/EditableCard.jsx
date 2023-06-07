import { useState } from 'react';
import cardService from '../services/cardService';

/**
 * Creates a new editable Card component
 * @param {{
 *  card: object,
 *  initialEditState: boolean
 * }} param0
 * @returns
 */
export default function EditableCard({
  card,
  onCancel,
  onDelete,
  onSave,
  onColorSelected,
}) {
  let [description, setDescription] = useState('');
  let [color, setColor] = useState(null);

  return (
    <div
      id={`card-${card.id}`}
      className="card editing"
      style={{ background: color }}
    >
      <textarea
        id={`card-${card.id}-textarea`}
        autoFocus={true}
        onChange={(e) => setDescription(e.target.value)}
        onFocus={resizeTextArea}
        onInput={resizeTextArea}
        defaultValue={card.description}
      ></textarea>
      <div className="color-palette">
        {[
          "#FF8888",
          "#FFCC88",
          "#FFFF88",
          "#88FF88",
          "#8888FF",
          "#DD99FF",
        ].map((color) => {
          return (
            <div
              key={color}
              className="color-palette-item"
              style={{
                backgroundColor: color,
                border: card.color === color ? "solid 1px lightgray" : null,
              }}
              onClick={() => {
                onColorSelected(color)
                setColor(color);
              }}
            ></div>
          );
        })}
      </div>
      <button className="button-primary" onClick={save}>
        Save
      </button>
      <button className="button-cancel" onClick={onCancel}>
        Cancel
      </button>
      <button className="button-icon" onClick={deleteCard}>
        <img className="icon" src="images/trash.png" alt="delete"></img>
      </button>
    </div>
  );

  async function deleteCard() {
    const cardId = card.id;

    // eslint-disable-next-line no-restricted-globals
    if(confirm('Are you sure you want to delete this card?')) {
      console.log(`EditableCard.deleteCard(${cardId})`);
      const success = await cardService.deleteCard(cardId);
      if (success) {
        console.log(`EditableCard.onDelete(${cardId}`);
        onDelete(cardId);
      } else {
        alert('Failed to delete card.');
      }
    }
  }

  async function save() {
    card.description = description;
    await cardService.updateCard(card.id, card);
    onSave();
  }

  /**
   * Resizes the text area to fit the contents
   */
  function resizeTextArea() {
    const textArea = document.getElementById(`card-${card.id}-textarea`);
    textArea.style.height = "";
    textArea.style.height = `${textArea.scrollHeight + 3}px`;
  }
}
