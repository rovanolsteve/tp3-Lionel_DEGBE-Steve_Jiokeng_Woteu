export class MarkdownFormatter {
  format(stats) {
    const {
      month,
      count,
      revenueHT,
      vat,
      revenueTTC,
      average,
      byCategory,
    } = stats;

    let output =
      `# Ventes ${month}\n\n` +
      `${count} commande(s), panier moyen ${average} €\n\n` +
      '| Catégorie | Montant HT |\n' +
      '|---|---:|\n';

    for (const category of Object.keys(byCategory).sort()) {
      output += `| ${category} | ${byCategory[category]} € |\n`;
    }

    output +=
      `\nTotal HT : ${revenueHT} €\n\n` +
      `TVA : ${vat} €\n\n` +
      `Total TTC : ${revenueTTC} €`;

    return output;
  }
}
