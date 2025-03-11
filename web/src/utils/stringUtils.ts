/**
 * Cleans a recipient name by removing any leading prepositions
 *
 * @param name The recipient name to clean
 * @returns The cleaned name without leading prepositions
 */
export const cleanRecipientName = (name: string): string => {
  let cleanName = name.trim();

  if (/^por\s+/i.test(cleanName)) {
    cleanName = cleanName.replace(/^por\s+/i, '');
  } else if (/^para\s+/i.test(cleanName)) {
    cleanName = cleanName.replace(/^para\s+/i, '');
  }

  return cleanName;
};

/**
 * Capitalizes the first letter of a string
 *
 * @param str String to capitalize
 * @returns String with first letter capitalized
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Formats a name for display when it appears standalone (e.g., in listings)
 * Always capitalizes the first letter
 *
 * @param name The name to format
 * @returns Formatted name with first letter capitalized
 */
export const formatNameForStandalone = (name: string): string => {
  const cleanName = cleanRecipientName(name);
  return capitalizeFirstLetter(cleanName);
};

/**
 * Generates a formatted title for a bouquet based on recipient name
 *
 * @param name The recipient name
 * @returns Formatted title with correct preposition and capitalization
 */
export const formatRamilleteTitle = (name: string): string => {
  if (!name.trim()) return '';

  return `Ramillete espiritual por ${cleanRecipientName(name)}`;
};
