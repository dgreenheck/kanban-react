import { useState } from "react";

export default function AddListButton() {
  let [isEditing, setIsEditing] = useState(false);

  return !isEditing ? (
    <div id="add-list-wrapper" onClick={() => setIsEditing(!isEditing)}>
      <span>+ Add list</span>
    </div>
  ) : (
    <div id="add-list-wrapper" className='editing'>
      <input placeholder="Enter list title..."></input>
      <button className="button-primary">Add list</button>
      <button className="button-cancel" onClick={() => setIsEditing(!isEditing)}>
        Cancel
      </button>
    </div>
  );
}
