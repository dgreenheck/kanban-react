import List from "./List";
import listService from "../services/listService";
import cardService from "../services/cardService";
import { useEffect, useState } from "react";
import AddListButton from "./AddListButton";

export default function Board() {
  let [focusedCard, setFocusedCard] = useState(null);
  let [lists, setLists] = useState([]);
  let [cards, setCards] = useState([]);

  useEffect(() => {
    listService.getLists().then((lists) => {
      setLists(lists);
    });

    cardService.getCards().then((cards) => {
      setCards(cards);
    });
  }, []);

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
              cards={cards}
              focusedCard={focusedCard}
              onCardCreated={createCard}
              onCardDeleted={deleteCard}
              onCardMoved={moveCard}
              onListDeleted={deleteList}
            />
          );
        })}
        <AddListButton onAddList={createList} />
      </div>
    </>
  );

  /**
   * Creates a new card
   * @param {string} listId The id of the list to add the card to
   */
  async function createCard(listId) {
    const card = {
      listId,
      position: 0,
    };

    const createdCard = await cardService.createCard(card);

    if (createdCard) {
      setFocusedCard(createdCard);
      // Update state
      const newCards = [...cards, createdCard];
      setCards(newCards);
    } else {
      alert("Failed to create card");
    }
  }

  /**
   * Deletes a card
   * @param {object}} card The card to delete
   */
  async function deleteCard(cardId) {
    const newCards = cards.filter((x) => x.id !== cardId);
    setCards(newCards);
  }

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

  /**
   * Moves a card to the target list
   * @param {object} id ID of the moved card
   * @param {string} targetListId The id of the list the card was moved to
   * @param {number} targetPosition The position of the card in the list
   */
  async function moveCard(id, targetListId, targetPosition) {
    let updatedCards = [...cards];

    // Move the card to the target list and update its posiiton
    const card = cards.find((card) => card.id === id);

    // Capture the original position and list
    const originalPosition = card.position;
    const originalListId = card.listId;

    // Update the card list and position
    card.listId = targetListId;
    card.position = targetPosition;

    // Update card in database
    const movedCard = await cardService.updateCard(card.id, card);

    if (movedCard) {
      // Re-order the cards in the original list and target list to
      // account for the deleted/inserted card, respectively.
      await updateCardPositions(originalListId, originalPosition, null);
      await updateCardPositions(targetListId, null, targetPosition);
      
      setCards(updatedCards);
      setFocusedCard(null);
    } else {
      alert('Failed to move card.');
    }
  }

  /**
   * Deletes a list
   * @param {string} listId Id of the list to delete
   */
  async function deleteList(listId) {
    if (await listService.deleteList(listId)) {
      const newLists = lists.filter((list) => list.id !== listId);
      setLists(newLists);
    } else {
      alert("Failed to delete list.");
    }
  }

  /**
   * Updates the positions of the
   * @param {U} listId
   */
  async function updateCardPositions(listId, deletedPosition = null, insertedPosition = null) {
    if (deletedPosition) {
      // Update the positions of the cards in the source list
      cards
        .filter((card) => card.listId === listId)
        .forEach(async (card) => {
          // All cards after the moved card need to have their position decremented by 1
          if (card.position > deletedPosition) {
            card.position -= 1;
          }
          await cardService.updateCard(card.id, card);
        });
    }

    // Update the positions of the cards in the target list
    if (insertedPosition) {
      cards
        .filter((card) => card.listId === listId)
        .forEach(async (card) => {
          // All cards after the moved card need to have their position incremented by 1
          if (card.position >= insertedPosition) {
            card.position += 1;
          }
          await cardService.updateCard(card.id, card);
        });
    }
  }
}
