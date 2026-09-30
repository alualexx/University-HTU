/**
 * Ethiopian Calendar Utility
 * Converts between Gregorian (ISO 8601) and Ethiopian 13-Month Calendar (E.C.)
 * 
 * Ethiopian Calendar characteristics:
 * - 12 months of 30 days each + 13th month (Pagumē / ጳጉሜ) of 5 days (6 in leap years)
 * - 7 or 8 years behind Gregorian calendar
 * - New Year (Enkutatash / እንቁጣጣሽ) falls on September 11 (or September 12 in Gregorian leap years)
 */

const ETHIOPIAN_MONTHS_EN = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yakatit',
  'Megabit', 'Miyazya', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];

const ETHIOPIAN_MONTHS_AM = [
  'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
  'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
];

/**
 * Approximate conversion from Gregorian Date to Ethiopian Date
 * @param {Date|string} dateInput 
 * @returns {object} { year, month, monthNameEn, monthNameAm, day, formattedEn, formattedAm }
 */
function gregorianToEthiopian(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;

  const gYear = date.getUTCFullYear();
  const gMonth = date.getUTCMonth(); // 0-11
  const gDay = date.getUTCDate();

  // Determine Ethiopian Year
  let ethYear = gYear - 8;
  const isEthLeap = (ethYear + 1) % 4 === 3;
  const newYearDay = 11; // Standard Sept 11

  // Day of year calculation for September 11 anchor
  const newYearDate = new Date(Date.UTC(gYear, 8, newYearDay));
  
  let ethMonth, ethDay;
  if (date >= newYearDate) {
    ethYear = gYear - 7;
    const diffDays = Math.floor((date - newYearDate) / (1000 * 60 * 60 * 24));
    ethMonth = Math.floor(diffDays / 30) + 1;
    ethDay = (diffDays % 30) + 1;
  } else {
    ethYear = gYear - 8;
    const prevNewYear = new Date(Date.UTC(gYear - 1, 8, newYearDay));
    const diffDays = Math.floor((date - prevNewYear) / (1000 * 60 * 60 * 24));
    ethMonth = Math.floor(diffDays / 30) + 1;
    ethDay = (diffDays % 30) + 1;
  }

  // Bound to 13 months
  if (ethMonth > 13) ethMonth = 13;

  const monthNameEn = ETHIOPIAN_MONTHS_EN[ethMonth - 1] || 'Unknown';
  const monthNameAm = ETHIOPIAN_MONTHS_AM[ethMonth - 1] || 'ያልታወቀ';

  return {
    year: ethYear,
    month: ethMonth,
    day: ethDay,
    monthNameEn,
    monthNameAm,
    formattedEn: `${monthNameEn} ${ethDay}, ${ethYear} E.C.`,
    formattedAm: `${monthNameAm} ${ethDay} ቀን ${ethYear} ዓ.ም.`
  };
}

module.exports = {
  gregorianToEthiopian,
  ETHIOPIAN_MONTHS_EN,
  ETHIOPIAN_MONTHS_AM
};
