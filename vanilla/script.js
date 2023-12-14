/*
 * Render comments box
 */

function renderComments(data) {
  const div = document.createElement("div");
  const comments = data.comments;
  const currentUser = data.currentUser;
  // div.style.height = "100%";

  comments.forEach((comment) => {
    div.appendChild(renderSingleComment(comment, currentUser));
    if (comment.replies && comment.replies.length > 0) {
      div.appendChild(renderReplies(comment.replies, currentUser));
    }
  });
  return div;
}

function renderSingleComment(comment, currentUser) {
  const commentMainContainer = document.createElement("div");
  const commentMainBody = renderCommentMainBody(comment, currentUser);
  const score = renderScore(comment);

  commentMainContainer.classList.add("comment-main-container");
  commentMainContainer.appendChild(score);
  commentMainContainer.appendChild(commentMainBody);

  return commentMainContainer;
}

function renderScore(comment) {
  const score = document.createElement("div");
  score.innerHTML = `
    <div class="score-container">
      <img
        class="icon-plus"
        src="../images/icon-plus.svg"
        alt="+"
      />
      <span class="score-number">${comment.score}</span>
      <img
        class="icon-minus"
        src="../images/icon-minus.svg"
        alt="-"
      />
    </div>
  `;
  return score;
}

function renderCommentMainBody(comment, currentUser) {
  const commentMainBody = document.createElement("div");
  const commentRelatedInfo = renderCommentRelatedInfo(comment, currentUser);
  const commentContent = renderCommentContent(comment);

  commentMainBody.appendChild(commentRelatedInfo);
  commentMainBody.appendChild(commentContent);
  commentMainBody.classList.add("comment-main-body");
  return commentMainBody;
}

function renderCommentRelatedInfo(comment, currentUser) {
  if (comment.user.username === currentUser.username) {
    return renderCommentRelatedInfoForCurrentUser(comment);
    // return renderCommentRelatedInfoForOthers(comment);
  }
  return renderCommentRelatedInfoForOthers(comment);
}

function renderCommentRelatedInfoForOthers(comment) {
  const commentRelatedInfo = document.createElement("div");
  commentRelatedInfo.innerHTML = `
    <div class="comment-top-container">
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
    </div>
  `;
  return commentRelatedInfo;
}

function renderCommentRelatedInfoForCurrentUser(comment) {
  const commentRelatedInfo = document.createElement("div");
  commentRelatedInfo.innerHTML = `
    <div class="comment-top-container">
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
    </div>
  `;
  return commentRelatedInfo;
}

function renderCommentContent(comment) {
  const commentContent = document.createElement("div");
  commentContent.innerHTML = `
    <div class="comment-content">
      <span class="reply-to">${
        comment.replyingTo ? `@${comment.replyingTo}` : ""
      }</span>
      ${comment.content}
    </div>
  `;
  return commentContent;
}

/*
 * Render reply comments
 */

function renderReplies(replies, currentUser) {
  const replyContainer = document.createElement("div");

  replyContainer.classList.add("reply-container");
  replyContainer.appendChild(renderReplyLineIcon());
  replyContainer.appendChild(renderReplyComments(replies, currentUser));

  return replyContainer;
}

function renderReplyComments(replies, currentUser) {
  const replyComments = document.createElement("div");

  replies.forEach((reply) => {
    replyComments.appendChild(renderSingleComment(reply, currentUser));
  });

  return replyComments;
}

function renderReplyLineIcon() {
  const replyLineIcon = document.createElement("div");
  replyLineIcon.classList.add("reply-line-icon");
  return replyLineIcon;
}

/*
 * Render input box
 */

function renderInput(currentUser) {
  const inputContainer = document.createElement("div");
  inputContainer.innerHTML = `
    <div class="input-container">
        <img class="input-avatar" src="${currentUser.image.png}" alt="${currentUser.username}" />
        <textarea
          class="input-box"
          name="comment"
          id="comment"
          placeholder="Add a comment..."
        ></textarea>
        <button class="input-button">SEND</button>
    </div>
  `;
  return inputContainer;
}

/*
 * Controller
 */

document.addEventListener("DOMContentLoaded", async function () {
  // Fetch data from data.json
  const response = await fetch("../data.json");
  const data = await response.json();
  const comments = renderComments(data);
  const input = renderInput(data.currentUser);
  const commentsMainContainer = document.getElementById("main-container");

  commentsMainContainer.appendChild(comments);
  commentsMainContainer.appendChild(input);
});
