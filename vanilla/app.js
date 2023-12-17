import Store from "./store.js";
import View from "./view.js";

/*
 * MVC pattern
 * Controller
 */

document.addEventListener("DOMContentLoaded", async function () {
  // Fetch data from data.json
  const response = await fetch("../data.json");
  const data = await response.json();

  const view = new View();
  const store = new Store(data);

  function handleClick(btn, id) {
    if (btn === "reply") {
      handleReply(id);
    } else if (btn === "edit") {
      handleEdit(id);
    }

    view.render(
      store.data,
      { replying: store.replying, editing: store.editing },
      handleClick
    );
  }

  function handleReply(id) {
    const { isReplying, replyCommentId } = store.replying;
    if (isReplying === false || id !== replyCommentId) {
      store.setReplying({ isReplying: true, replyCommentId: id });
    } else {
      store.setReplying({ isReplying: false, replyCommentId: id });
    }
  }

  function handleEdit(id) {
    const { isEditing, editCommentId } = store.editing;
    console.log(isEditing, editCommentId, id);
    if (isEditing === false || id !== editCommentId) {
      store.setEditing({ isEditing: true, editCommentId: id });
    } else {
      store.setEditing({ isEditing: false, editCommentId: id });
    }
  }

  view.render(
    store.data,
    { replying: store.replying, editing: store.editing },
    handleClick
  );
});
