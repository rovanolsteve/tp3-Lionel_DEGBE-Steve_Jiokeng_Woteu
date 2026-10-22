import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ReportService } from './application/ReportService.js';
import { FormatterRegistry } from './formatters/FormatterRegistry.js';
import { CsvFormatter } from './formatters/CsvFormatter.js';
import { HtmlFormatter } from './formatters/HtmlFormatter.js';
import { JsonFormatter } from './formatters/JsonFormatter.js';
import { MarkdownFormatter } from './formatters/MarkdownFormatter.js';
import { ConsoleLogger } from './infrastructure/ConsoleLogger.js';
import { JsonFileOrderRepository } from './infrastructure/JsonFileOrderRepository.js';
import { SmtpMailer } from './infrastructure/SmtpMailer.js';

function createReportService() {
  const formatterRegistry = new FormatterRegistry();
  formatterRegistry.register('csv', new CsvFormatter());
  formatterRegistry.register('html', new HtmlFormatter());
  formatterRegistry.register('json', new JsonFormatter());

  const mailer = new SmtpMailer({
    host: 'smtp.shoplite.fr',
    port: 587,
    user: 'reports',
    password: 'Sh0pL1te!',
  });

  return {
    service: new ReportService({
      orderRepository: new JsonFileOrderRepository(new URL('./orders.json', import.meta.url)),
      formatterRegistry,
      logger: new ConsoleLogger(),
      mailer,
    }),
    mailer,
    formatterRegistry,
  };
}

const CSV_SEPT = 'categorie;montant_ht\ninformatique;416\nlivres;135\n' +
  'TOTAL HT;551\nTVA;110.2\nTOTAL TTC;661.2\n';

// Sortie actuelle relevée en lançant le code (une seule commande en octobre : CMD-105)
const CSV_OCT = 'categorie;montant_ht\ninformatique;57\nTOTAL HT;57\nTVA;11.4\nTOTAL TTC;68.4\n';

test('CSV de septembre 2026 (commande annulée exclue)', () => {
  const { service } = createReportService();
  assert.equal(service.generate('2026-09', 'csv'), CSV_SEPT);
});

test('HTML de septembre 2026', () => {
  const { service } = createReportService();
  assert.equal(service.generate('2026-09', 'html'),
    '<h1>Ventes 2026-09</h1><p>3 commande(s), panier moyen 183.67 €</p><ul>' +
    '<li>informatique : 416 €</li><li>livres : 135 €</li></ul><p><b>Total TTC : 661.2 €</b></p>');
});

test('JSON de septembre 2026', () => {
  const { service } = createReportService();
  assert.deepEqual(JSON.parse(service.generate('2026-09', 'json')), {
    month: '2026-09', count: 3, revenueHT: 551, vat: 110.2, revenueTTC: 661.2,
    average: 183.67, byCategory: { informatique: 416, livres: 135 },
  });
});

test('mois sans commande : totaux à zéro', () => {
  const { service } = createReportService();
  assert.equal(service.generate('2026-01', 'csv'),
    'categorie;montant_ht\nTOTAL HT;0\nTVA;0\nTOTAL TTC;0\n');
});

test('format inconnu refusé', () => {
  const { service } = createReportService();
  assert.throws(() => service.generate('2026-09', 'pdf'), /Format non supporté/);
});

test('envoi par e-mail : un message dans la boîte d’envoi', () => {
  const { service, mailer } = createReportService();
  service.generate('2026-09', 'csv', 'direction@shoplite.fr');
  assert.equal(mailer.outbox.length, 1);
  assert.equal(mailer.outbox[0].to, 'direction@shoplite.fr');
  assert.equal(mailer.outbox[0].body, CSV_SEPT);
});

test('adresse e-mail invalide refusée', () => {
  const { service } = createReportService();
  assert.throws(() => service.generate('2026-09', 'csv', 'direction'), /Adresse invalide/);
});

test('CSV d\'octobre 2026', () => {
  const { service } = createReportService();
  assert.equal(service.generate('2026-10', 'csv'), CSV_OCT);
});

test('un format Markdown s’ajoute sans modifier ReportService', () => {
  const { service, formatterRegistry } = createReportService();
  formatterRegistry.register('md', new MarkdownFormatter());

  assert.equal(
    service.generate('2026-09', 'md'),
    '# Ventes 2026-09\n\n' +
      '3 commande(s), panier moyen 183.67 €\n\n' +
      '| Catégorie | Montant HT |\n' +
      '|---|---:|\n' +
      '| informatique | 416 € |\n' +
      '| livres | 135 € |\n' +
      '\nTotal HT : 551 €\n\n' +
      'TVA : 110.2 €\n\n' +
      'Total TTC : 661.2 €'
  );
});