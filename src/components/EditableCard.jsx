import { useState } from 'react';

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
      <button className="button-primary" onClick={onSave}>
        Save
      </button>
      <button className="button-cancel" onClick={onCancel}>
        Cancel
      </button>
      <button className="button-icon" onClick={onDelete}>
        <img className="icon" src="images/trash.png" alt="delete"></img>
      </button>
    </div>
  );

  /**
   * Resizes the text area to fit the contents
   */
  function resizeTextArea() {
    const textArea = document.getElementById(`card-${card.id}-textarea`);
    textArea.style.height = "";
    textArea.style.height = `${textArea.scrollHeight + 3}px`;
  }
}
