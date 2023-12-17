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
