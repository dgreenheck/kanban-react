/**
 * Creates a new editable Card component
 * @param {{
 *  card: object,
 *  initialEditState: boolean
 * }} param0 
 * @returns 
 */
export default function EditableCard({ card, onSave, onCancel }) {
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
    textArea.style.height = '';
    textArea.style.height = `${textArea.scrollHeight + 3}px`;
  }
}