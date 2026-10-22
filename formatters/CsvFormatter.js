
export class CsvFormatter {
  format(stats) {
    const {
      revenueHT,
      vat,
      revenueTTC,
      byCategory,
    } = stats;

    let output = 'categorie;montant_ht\n';

    for (const category of Object.keys(byCategory).sort()) {
      output += `${category};${byCategory[category]}\n`;
    }

    output += `TOTAL HT;${revenueHT}\n`;
    output += `TVA;${vat}\n`;
    output += `TOTAL TTC;${revenueTTC}\n`;

    return output;
  }
}
