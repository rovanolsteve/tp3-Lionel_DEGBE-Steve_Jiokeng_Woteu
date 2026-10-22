
export class EmailAddress {
  constructor(value) {
    if (typeof value !== 'string' || !EmailAddress.isValid(value)) {
      throw new Error(`Adresse invalide : ${value}`);
    }

    this.value = value;
  }

  static isValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  toString() {
    return this.value;
  }
}
