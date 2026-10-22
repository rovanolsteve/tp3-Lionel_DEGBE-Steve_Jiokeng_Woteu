
export class FormatterRegistry {
  constructor() {
    this.formatters = new Map();
  }

  register(name, formatter) {
    if (!formatter || typeof formatter.format !== 'function') {
      throw new Error(`Formatter invalide : ${name}`);
    }

    this.formatters.set(name, formatter);
  }

  get(name) {
    const formatter = this.formatters.get(name);

    if (!formatter) {
      throw new Error(`Format non supporté : ${name}`);
    }

    return formatter;
  }
}
