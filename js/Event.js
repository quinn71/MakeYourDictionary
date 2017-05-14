class Event {
  constructor() {
    this._listeners = [];
  }

  notify(...params) {
    this._listeners.forEach((listener) => {
      listener(...params);
    });
  }

  attach(listener) {
    this._listeners.push(listener);
  }
}
