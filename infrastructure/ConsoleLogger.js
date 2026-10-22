export class ConsoleLogger {
  constructor() {
    this.history = [];
  }

  info(message) {
    console.log(message);
    this.history.push(message);
  }
}