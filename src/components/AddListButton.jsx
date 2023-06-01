import { useState } from "react";

export default function AddListButton({ onAddList }) {
  let [listName, setListName] = useState('');
  let [isEditing, setIsEditing] = useState(false);

  return !isEditing ? (
    <div id="add-list-wrapper" onClick={() => setIsEditing(!isEditing)}>
      <span>+ Add list</span>
    </div>
  ) : (
    <div id="add-list-wrapper" className='editing'>
      <input placeholder="Enter list title..." onChange={(e) => setListName(e.target.value)}></input>
      <button className="button-primary" onClick={() => createList(listName)}>Add list</button>
      <button className="button-cancel" onClick={() => setIsEditing(!isEditing)}>
        Cancel
      </button>
    </div>
  );

  /**
   * Creates a new list
   * @param {string} listName 
   */
  function createList(listName) {
    onAddList(listName);
    
    // Reset the state for this control
    setListName(false);
    setIsEditing(false);
  }
}
