/**
 * Currency Utility: Ethiopian Birr Santim Standard
 * Per HTTU Technical Specifications, all monetary values (salaries, allowances, fines, fees)
 * are stored as BIGINT in Santim (1 ETB = 100 santim) to avoid floating point precision issues.
 */

function santimToETB(santim) {
  if (santim === null || santim === undefined) return 0;
  return Number(santim) / 100;
}

function etbToSantim(etb) {
  if (etb === null || etb === undefined) return 0;
  return Math.round(Number(etb) * 100);
}

function formatETB(santim) {
  const etb = santimToETB(santim);
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2
  }).format(etb);
}

module.exports = {
  santimToETB,
  etbToSantim,
  formatETB
};
