/*
 * MVC pattern
 * View
 */

export default class View {
  $ = {};
  deleteCommentId = 0;
  handler = null;

  constructor() {
    this.$.mainContainer = this.#qs("#main-container");
    this.$.modalContainer = this.#qs('[data-id="modal-container"]');
    this.$.modalDeleteBtn = this.#qs('[data-id="modal-delete"]');
    this.$.modalCancelBtn = this.#qs('[data-id="modal-cancel"]');

    this.#bindModalCancelButton(() => {
      this.$.modalContainer.classList.remove("activated");
    });
  }

  setHandler(handler) {
    this.#bindModalDeleteButton(handler);
    this.handler = handler;
  }

  render(data, doing) {
    const comments = this.#renderComments(data);
    const input = this.#renderInput(data.currentUser, "SEND", "send");

    while (this.$.mainContainer.firstChild) {
      this.$.mainContainer.removeChild(this.$.mainContainer.firstChild);
    }
    this.$.mainContainer.appendChild(comments);
    this.$.mainContainer.appendChild(input);

    if (doing.replying.isReplying) {
      this.#renderReplying(data.currentUser, doing.replying.replyCommentId);
    }

    if (doing.editing.isEditing) {
      this.#renderEditing(doing.editing.editCommentId);
    }

    this.#bindButton(this.handler, doing);
  }

  #qs(selector, root) {
    const elem = root
      ? root.querySelector(selector)
      : document.querySelector(selector);
    if (!elem) throw new Error(`Cannot find element: ${selector}`);
    return elem;
  }

  #qsAll(selector, root) {
    const list = root
      ? root.querySelectorAll(selector)
      : document.querySelectorAll(selector);
    //if (list.length === 0) throw new Error(`Cannot find element: ${selector}`);
    return list;
  }

  #findParentWithClass(childNode, className) {
    let currentNode = childNode.parentNode;

    while (currentNode !== null && !currentNode.classList.contains(className)) {
      currentNode = currentNode.parentNode;
    }

    if (currentNode === null)
      throw new Error(`Cannot find parent with class: ${className}`);

    return currentNode;
  }

  #bindButton(handler, doing) {
    this.#bindUpVoteBtn(handler);
    this.#bindDownVoteBtn(handler);
    this.#bindSendButton(handler);
    this.#bindReplyButton(handler);
    this.#bindEditButton(handler);
    this.#bindDeleteButton(() => {
      this.$.modalContainer.classList.add("activated");
    });

    if (doing.replying.isReplying) {
      this.#bindReplySubmitButton(handler);
    }
    if (doing.editing.isEditing) {
      this.#bindUpdateButton(handler);
    }
  }

  #bindUpVoteBtn(handler) {
    const upVoteBtnList = this.#qsAll(".icon-plus");
    upVoteBtnList.forEach((upVoteBtn) => {
      const commentMainContainer = this.#findParentWithClass(
        upVoteBtn,
        "comment-main-container"
      );
      upVoteBtn.addEventListener("click", () => {
        handler("upVote", +commentMainContainer.getAttribute("data-id"));
      });
    });
  }

  #bindDownVoteBtn(handler) {
    const downVoteBtnList = this.#qsAll(".icon-minus");
    downVoteBtnList.forEach((downVoteBtn) => {
      const commentMainContainer = this.#findParentWithClass(
        downVoteBtn,
        "comment-main-container"
      );
      downVoteBtn.addEventListener("click", () => {
        handler("downVote", +commentMainContainer.getAttribute("data-id"));
      });
    });
  }

  #bindSendButton(handler) {
    const inputContainer = this.#qs('[data-id="send"]');
    const sendBtn = this.#qs("button", inputContainer);
    sendBtn.addEventListener("click", () => {
      handler("send", sendBtn.previousElementSibling.value);
    });
  }

  #bindReplyButton(handler) {
    const commentReplyList = this.#qsAll(".comment-reply");
    commentReplyList.forEach((commentReply) => {
      const commentMainContainer = this.#findParentWithClass(
        commentReply,
        "comment-main-container"
      );
      commentReply.addEventListener("click", () => {
        handler("reply", +commentMainContainer.getAttribute("data-id"));
      });
    });
  }

  #bindReplySubmitButton(handler) {
    const inputContainer = this.#qs('[data-id="reply"]');
    const replySubmitBtn = this.#qs("button", inputContainer);
    replySubmitBtn.addEventListener("click", () => {
      handler("replySubmit", replySubmitBtn.previousElementSibling.value);
    });
  }

  #bindEditButton(handler) {
    const commentEditList = this.#qsAll(".comment-edit");
    commentEditList.forEach((commentEdit) => {
      const commentMainContainer = this.#findParentWithClass(
        commentEdit,
        "comment-main-container"
      );
      commentEdit.addEventListener("click", () => {
        handler("edit", +commentMainContainer.getAttribute("data-id"));
      });
    });
  }

  #bindUpdateButton(handler) {
    const updateContainer = this.#qs('[data-id="update"]');
    const updateBtn = this.#qs("button", updateContainer);
    const replyContent = this.#qs(
      ".reply-content",
      updateContainer.previousElementSibling
    );
    updateBtn.addEventListener("click", () => {
      handler("update", replyContent.textContent.trim());
    });
  }

  #bindDeleteButton(handler) {
    const commentDeleteList = this.#qsAll(".comment-delete");
    commentDeleteList.forEach((commentDelete) => {
      const commentMainContainer = this.#findParentWithClass(
        commentDelete,
        "comment-main-container"
      );
      commentDelete.addEventListener("click", () => {
        this.deleteCommentId = +commentMainContainer.getAttribute("data-id");
        handler();
      });
    });
  }

  #bindModalDeleteButton(handler) {
    this.$.modalDeleteBtn.addEventListener("click", () => {
      this.$.modalContainer.classList.remove("activated");

      handler("delete", this.deleteCommentId);
    });
  }

  #bindModalCancelButton(handler) {
    this.$.modalCancelBtn.addEventListener("click", () => {
      handler();
    });
  }

  #renderReplying(currentUser, commentId) {
    const commentMainContainer = this.#qs(`[data-id="${commentId}"]`);
    const input = this.#renderInput(currentUser, "REPLY", "reply");
    commentMainContainer.parentNode.insertBefore(
      input,
      commentMainContainer.nextSibling
    );
    commentMainContainer.classList.add("no-bottom-margin");
    const textReply = this.#qs(".text-reply", commentMainContainer);
    textReply.textContent = "Cancel";
  }

  #renderEditing(commentId) {
    const commentMainContainer = this.#qs(`[data-id="${commentId}"]`);
    const commentContent = this.#qs(".comment-content", commentMainContainer);

    const replyContent = this.#qs(".reply-content", commentContent);
    replyContent.setAttribute("contenteditable", "true");

    commentContent.classList.add("editing");

    const textReply = this.#qs(".text-edit", commentMainContainer);
    textReply.textContent = "Cancel";

    const commentMainBody = this.#qs(
      ".comment-main-body",
      commentMainContainer
    );
    const btnContainer = document.createElement("div");
    const updateBtn = this.#renderButton("UPDATE");
    updateBtn.classList.add("no-margin");
    btnContainer.appendChild(updateBtn);
    btnContainer.classList.add("btn-container");
    btnContainer.setAttribute("data-id", "update");
    commentMainBody.appendChild(btnContainer);
  }

  /*
   * Render comments box
   */

  #renderComments(data) {
    const div = document.createElement("div");
    const comments = data.comments;
    const currentUser = data.currentUser;

    comments.forEach((comment) => {
      div.appendChild(this.#renderSingleComment(comment, currentUser));
      if (comment.replies && comment.replies.length > 0) {
        div.appendChild(this.#renderReplies(comment.replies, currentUser));
      }
    });
    return div;
  }

  #renderSingleComment(comment, currentUser) {
    const commentMainContainer = document.createElement("div");
    const commentMainBody = this.#renderCommentMainBody(comment, currentUser);
    const score = this.#renderScore(comment);

    commentMainContainer.classList.add("comment-main-container");
    commentMainContainer.setAttribute("data-id", `${comment.id}`);
    commentMainContainer.appendChild(score);
    commentMainContainer.appendChild(commentMainBody);

    return commentMainContainer;
  }

  #renderScore(comment) {
    const score = document.createElement("div");
    score.innerHTML = `
      <div class="score-container">
        <div class="icon-plus"></div>
        <span class="score-number">${comment.score}</span>
        <div class="icon-minus"></div>
      </div>
    `;
    return score;
  }

  #renderCommentMainBody(comment, currentUser) {
    const commentMainBody = document.createElement("div");
    const commentRelatedInfo = this.#renderCommentRelatedInfo(
      comment,
      currentUser
    );
    const commentContent = this.#renderCommentContent(comment);

    commentMainBody.appendChild(commentRelatedInfo);
    commentMainBody.appendChild(commentContent);
    commentMainBody.classList.add("comment-main-body");
    return commentMainBody;
  }

  #renderCommentRelatedInfo(comment, currentUser) {
    if (comment.user.username === currentUser.username) {
      return this.#renderCommentRelatedInfoForCurrentUser(comment);
    }
    return this.#renderCommentRelatedInfoForOthers(comment);
  }

  #renderCommentRelatedInfoForOthers(comment) {
    const commentRelatedInfo = document.createElement("div");
    commentRelatedInfo.classList.add("comment-top-container");
    commentRelatedInfo.innerHTML = `
        <div class="comment-user-info">
          <img
            class="info-image"
            src="${comment.user.image.png}"
            alt="${comment.user.username}"
          />
          <div class="info-username">${comment.user.username}</div>
          <div class="info-createdAt">${comment.createdAt}</div>
        </div>
        <div class="comment-reply">
          <img
            class="icon-reply"
            src="../images/icon-reply.svg"
            alt="X"
          />
          <span class="text-reply">Reply</span>
        </div>
    `;

    return commentRelatedInfo;
  }

  #renderCommentRelatedInfoForCurrentUser(comment) {
    const commentRelatedInfo = document.createElement("div");
    commentRelatedInfo.classList.add("comment-top-container");
    commentRelatedInfo.innerHTML = `
        <div class="comment-user-info">
          <img
            class="info-image"
            src="${comment.user.image.png}"
            alt="${comment.user.username}"
          />
          <div class="info-username">${comment.user.username}</div>
          <div class="info-currentUser">you</div>
          <div class="info-createdAt">${comment.createdAt}</div>
        </div>
        <div class="delete-edit-container">
          <div class="comment-delete">
            <img
              class="icon-delete"
              src="../images/icon-delete.svg"
              alt="X"
            />
            <span class="text-delete">Delete</span>
          </div>
          <div class="comment-edit">
            <img
              class="icon-edit"
              src="../images/icon-edit.svg"
              alt="X"
            />
            <span class="text-edit">Edit</span>
          </div>
        </div>
    `;
    return commentRelatedInfo;
  }

  #renderCommentContent(comment) {
    const commentContent = document.createElement("div");
    commentContent.classList.add("comment-content");
    commentContent.innerHTML = `
        <span class="reply-to" contenteditable="false">${
          comment.replyingTo ? `@${comment.replyingTo}` : ""
        }</span><span class="reply-content" contenteditable="false">
        ${comment.content}
        </span>
    `;
    return commentContent;
  }

  /*
   * Render reply comments
   */

  #renderReplies(replies, currentUser) {
    const replyContainer = document.createElement("div");

    replyContainer.classList.add("reply-container");
    replyContainer.appendChild(this.#renderReplyLineIcon());
    replyContainer.appendChild(this.#renderReplyComments(replies, currentUser));

    return replyContainer;
  }

  #renderReplyComments(replies, currentUser) {
    const replyComments = document.createElement("div");

    replyComments.classList.add("reply-comments-main-container");

    replies.forEach((reply) => {
      replyComments.appendChild(this.#renderSingleComment(reply, currentUser));
    });

    return replyComments;
  }

  #renderReplyLineIcon() {
    const replyLineIcon = document.createElement("div");
    replyLineIcon.classList.add("reply-line-icon");
    return replyLineIcon;
  }

  /*
   * Render input box
   */

  #renderButton(buttonName) {
    const button = document.createElement("button");
    button.classList.add("input-button");
    button.textContent = buttonName;
    return button;
  }

  #renderInput(currentUser, buttonName, dataId) {
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");
    if (buttonName === "REPLY") inputContainer.classList.add("is-reply");
    inputContainer.innerHTML = `
        <img class="input-avatar" src="${currentUser.image.png}" alt="${currentUser.username}" />
        <textarea
            class="input-box"
            name="comment"
            id="comment"
            placeholder="Add a comment..."
        ></textarea>
    `;
    const inputBtn = this.#renderButton(buttonName);
    inputContainer.append(inputBtn);
    inputContainer.setAttribute("data-id", dataId);
    return inputContainer;
  }
}
