// Démonstration : node seance3-solid/tp3-Lionel_DEGBE-Steve_Jiokeng_Woteu/demo.js
import { ReportService } from './application/ReportService.js';
import { FormatterRegistry } from './formatters/FormatterRegistry.js';
import { CsvFormatter } from './formatters/CsvFormatter.js';
import { HtmlFormatter } from './formatters/HtmlFormatter.js';
import { JsonFormatter } from './formatters/JsonFormatter.js';
import { ConsoleLogger } from './infrastructure/ConsoleLogger.js';
import { JsonFileOrderRepository } from './infrastructure/JsonFileOrderRepository.js';
import { SmtpMailer } from './infrastructure/SmtpMailer.js';

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

const service = new ReportService({
  orderRepository: new JsonFileOrderRepository(new URL('./orders.json', import.meta.url)),
  formatterRegistry,
  logger: new ConsoleLogger(),
  mailer,
});
console.log(service.generate('2026-09', 'csv'));
console.log(service.generate('2026-09', 'html', 'direction@shoplite.fr'));
console.log('E-mails envoyés :', mailer.outbox.length);
