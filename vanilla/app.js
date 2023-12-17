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

  function handleClick(btn, idOrContent) {
    if (btn === "reply") {
      handleReply(idOrContent);
    } else if (btn === "edit") {
      handleEdit(idOrContent);
    } else if (btn === "replySubmit") {
      handleReplySubmit(idOrContent);
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

  function handleReplySubmit(content) {
    store.addReply(content);
    store.setReplying({ isReplying: false, replyCommentId: 0 });
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
