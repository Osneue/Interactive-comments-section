/*
 * MVC pattern
 * Model (state management)
 */

const InitialState = {
  data: {},
  replying: { isReplying: false, replyCommentId: 0 },
  editing: { isEditing: false, editCommentId: 0 },
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

  addReply(content) {
    const stateClone = structuredClone(this.#getState());
    const reply = this.#fillReplyTemplate(content);
    const comment = this.#findCorrespondingComment(
      stateClone.data.comments,
      this.replying.replyCommentId
    );
    comment.replies.push(reply);
    this.#reallocateCommentIds(stateClone.data.comments);
    this.#setState(stateClone);
  }

  #findCorrespondingComment(comments, id) {
    console.log(comments, id);
    let correspondingComment = null;

    comments.forEach((comment) => {
      if (comment.id === id) {
        correspondingComment = comment;
      } else if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach((reply) => {
          if (reply.id === id) {
            correspondingComment = comment;
          }
        });
      }
    });

    if (!correspondingComment)
      throw new Error("Corresponding Comment not found");
    return correspondingComment;
  }

  #reallocateCommentIds(comments) {
    let id = 1;
    comments.forEach((comment) => {
      comment.id = id++;
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
