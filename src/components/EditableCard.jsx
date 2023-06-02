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
  onSave,
  onCancel,
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
          "#800000A0",
          "#804800A0",
          "#808000A0",
          "#008000A0",
          "#000080A0",
          "#600080A0",
        ].map((color) => {
          return (
            <div
              key={color}
              className="color-palette-item"
              style={{
                backgroundColor: color,
                boxShadow:
                  card.color === color ? "0px 0px 5px 0px white" : null,
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
