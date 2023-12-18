/*
 * MVC pattern
 * Model (state management)
 */

const InitialState = {
  data: {},
  replying: { isReplying: false, replyCommentId: 0 },
  editing: { isEditing: false, editCommentId: 0 },
  scores: [],
};

export default class Store {
  state = {};

  constructor(data) {
    this.state = InitialState;
    this.state.data = data;
  }

  get data() {
    return this.state.data;
  }

  get replying() {
    return this.state.replying;
  }

  get editing() {
    return this.state.editing;
  }

  addScore(id) {
    const stateClone = structuredClone(this.#getState());
    if (stateClone.scores.includes(id)) {
      return;
    }
    const comment = stateClone.data.comments.find(
      (comment) => comment.id === id
    );
    if (comment) {
      comment.score++;
    } else {
      stateClone.data.comments.forEach((comment) => {
        if (comment.replies && comment.replies.length > 0) {
          const reply = comment.replies.find((reply) => reply.id === id);
          if (reply) {
            reply.score++;
          }
        }
      });
    }
    stateClone.scores.push(id);
    this.#setState(stateClone);
  }

  subScore(id) {
    const stateClone = structuredClone(this.#getState());
    if (!stateClone.scores.includes(id)) {
      return;
    }
    const comment = stateClone.data.comments.find(
      (comment) => comment.id === id
    );
    if (comment) {
      comment.score--;
    } else {
      stateClone.data.comments.forEach((comment) => {
        if (comment.replies && comment.replies.length > 0) {
          const reply = comment.replies.find((reply) => reply.id === id);
          if (reply) {
            reply.score--;
          }
        }
      });
    }
    stateClone.scores = stateClone.scores.filter((score) => score !== id);
    this.#setState(stateClone);
  }

  delete(id) {
    const stateClone = structuredClone(this.#getState());
    stateClone.scores = stateClone.scores.filter((score) => score !== id);
    const newComments = stateClone.data.comments.filter(
      (comment) => comment.id !== id
    );
    stateClone.data.comments = newComments;
    stateClone.data.comments.forEach((comment) => {
      const newReplies = comment.replies.filter((reply) => reply.id !== id);
      comment.replies = newReplies;
    });
    this.#reallocateCommentIds(stateClone.data.comments, stateClone.scores);
    this.#setState(stateClone);
  }

  send(content) {
    const stateClone = structuredClone(this.#getState());
    const comment = this.#fillCommentTemplate(content);
    stateClone.data.comments.push(comment);
    this.#reallocateCommentIds(stateClone.data.comments, stateClone.scores);
    this.#setState(stateClone);
  }

  setReplying(replying) {
    const stateClone = structuredClone(this.#getState());
    stateClone.replying = replying;
    this.#setState(stateClone);
  }

  setEditing(editing) {
    const stateClone = structuredClone(this.#getState());
    stateClone.editing = editing;
    this.#setState(stateClone);
  }

  updateComment(content) {
    const stateClone = structuredClone(this.#getState());
    const commentOrReply = this.#findCorrespondingComment(
      stateClone.data.comments,
      this.editing.editCommentId,
      true
    );
    commentOrReply.content = content;
    this.#setState(stateClone);
  }

  addReply(content) {
    const stateClone = structuredClone(this.#getState());
    const reply = this.#fillReplyTemplate(content);
    const comment = this.#findCorrespondingComment(
      stateClone.data.comments,
      this.replying.replyCommentId,
      false
    );
    comment.replies.push(reply);
    this.#reallocateCommentIds(stateClone.data.comments, stateClone.scores);
    this.#setState(stateClone);
  }

  #fillCommentTemplate(content) {
    const template = {
      id: 0,
      content: "",
      createdAt: "now",
      score: 0,
      user: {
        image: {
          png: "",
          webp: "",
        },
        username: "whoever-a",
      },
      replies: [],
    };

    template.content = content;
    template.user.username = this.data.currentUser.username;
    template.user.image = this.data.currentUser.image;

    return template;
  }

  #findCorrespondingComment(comments, id, canReturnReply) {
    let correspondingComment = null;

    comments.forEach((comment) => {
      if (comment.id === id) {
        correspondingComment = comment;
      } else if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach((reply) => {
          if (reply.id === id) {
            if (canReturnReply) correspondingComment = reply;
            else correspondingComment = comment;
          }
        });
      }
    });

    if (!correspondingComment)
      throw new Error("Corresponding Comment not found");
    return correspondingComment;
  }

  #reallocateCommentIds(comments, scores) {
    let id = 1;
    comments.forEach((comment) => {
      const oldId = comment.id;
      comment.id = id++;
      let score = scores.find((score) => score === oldId);
      if (score) score = comment.id;
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach((reply) => {
          reply.id = id++;
        });
      }
    });
  }

  #findReplyingTo(id) {
    let name = null;

    this.data.comments.forEach((comment) => {
      if (comment.id === id) {
        name = comment.user.username;
      } else if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach((reply) => {
          if (reply.id === id) {
            name = reply.user.username;
          }
        });
      }
    });

    if (!name) throw new Error("Replying to who is not found");

    return name;
  }

  #fillReplyTemplate(content) {
    const replyTemplate = {
      id: 0,
      content: "",
      createdAt: "now",
      score: 0,
      replyingTo: "whoever-b",
      user: {
        image: {
          png: "",
          webp: "",
        },
        username: "whoever-a",
      },
    };

    replyTemplate.content = content;
    replyTemplate.replyingTo = this.#findReplyingTo(
      this.replying.replyCommentId
    );
    replyTemplate.user.username = this.data.currentUser.username;
    replyTemplate.user.image = this.data.currentUser.image;

    return replyTemplate;
  }

  #setState(stateOrFn) {
    const prevState = this.#getState();

    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid argument passed to saveState");
    }

    this.state = newState;
  }

  #getState() {
    return this.state;
  }
}
