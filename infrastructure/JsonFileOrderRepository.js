import fs from 'node:fs';

export class JsonFileOrderRepository {
  constructor(dbFile) {
    this.dbFile = dbFile;
  }

  all() {
    const raw = fs.readFileSync(this.dbFile, 'utf8');
    return JSON.parse(raw);
  }
}