import List from "./List";
import listService from "../services/listService";
import { useEffect, useState } from "react";
import AddListButton from "./AddListButton";

export default function Board() {
  let [lists, setLists] = useState([]);

  const loadLists = () => {
    listService.getLists().then((lists) => {
      setLists(lists);
    });
  }

  // Load lists when the component first loads
  useEffect(loadLists, []);

  const deleteList = async (listToDelete) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Are you sure you want to delete the list ${listToDelete.name}?`)) {
      if (await listService.deleteList(listToDelete.id)) {
        const newLists = lists.filter((list) => list.id !== listToDelete.id);
        setLists(newLists);
      } else {
        alert("Failed to delete list.");
      }
    }
  }

  return (
    <>
      <div className="board-header">
        <h1 className="board-name">My Board</h1>
      </div>
      <div className="board">
        {lists.map((list) => {
          return (
            <List
              key={list.id}
              list={list}
              onCardMoved={loadLists}
              onListDeleted={deleteList}
            />
          );
        })}
        <AddListButton onAddList={createList} />
      </div>
    </>
  );

  /**
   * Creates a new list
   * @param {string} name The name of the list
   */
  async function createList(name) {
    const createdList = await listService.createList({ name });
    if (createdList) {
      const newLists = [...lists, createdList];
      setLists(newLists);
    } else {
      alert("Failed to create list.");
    }
  }
}