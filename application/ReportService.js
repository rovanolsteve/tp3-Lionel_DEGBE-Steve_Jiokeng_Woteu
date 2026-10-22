import { computeStats } from '../domain/salesStats.js';

export class ReportService {
  constructor({ orderRepository, formatterRegistry, logger, mailer }) {
    if (!orderRepository || typeof orderRepository.all !== 'function') {
      throw new Error('Dépôt de commandes invalide');
    }
    if (!formatterRegistry || typeof formatterRegistry.get !== 'function') {
      throw new Error('Registre de formats invalide');
    }
    if (!logger || typeof logger.info !== 'function') {
      throw new Error('Journaliseur invalide');
    }
    if (!mailer || typeof mailer.send !== 'function') {
      throw new Error('Service d’envoi invalide');
    }

    this.orderRepository = orderRepository;
    this.formatterRegistry = formatterRegistry;
    this.logger = logger;
    this.mailer = mailer;
  }

  generate(month, format, recipient) {
    const orders = this.orderRepository.all();
    const stats = computeStats(orders, month);
    const output = this.formatterRegistry.get(format).format(stats);

    const line =
      `[${new Date().toISOString()}] rapport ${month} (${format}) : ${stats.count} commande(s)`;
    this.logger.info(line);

    if (recipient) {
      this.mailer.send({
        to: recipient,
        subject: `Rapport des ventes ${month}`,
        body: output,
      });
    }
    return output;
  }
}

// Variante « offre gratuite » : elle refuse ce que la classe parente accepte
export class FreeReportService extends ReportService {
  generate(month, format, recipient) {
    if (format !== 'csv') throw new Error('Format réservé aux comptes Pro');
    if (recipient) throw new Error('Envoi par e-mail réservé aux comptes Pro');
    return super.generate(month, format);
  }
}
