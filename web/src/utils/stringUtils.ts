/**
 * Determines the correct Spanish preposition based on the name pattern
 *
 * @param name The recipient name to analyze
 * @returns Either 'para' or 'por' depending on the name pattern
 */
export const determineSpanishPreposition = (name: string): 'para' | 'por' => {
  const nameLower = name.trim().toLowerCase();

  const usesPorPreposition =
    nameLower.startsWith('la ') ||
    nameLower.startsWith('el ') ||
    nameLower.startsWith('las ') ||
    nameLower.startsWith('los ') ||
    nameLower.includes(' y ') ||
    nameLower.includes(' e ') ||
    nameLower.includes(', ');

  return usesPorPreposition ? 'por' : 'para';
};

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
 * Lowercases the first letter of a string
 *
 * @param str String to transform
 * @returns String with first letter lowercased
 */
export const lowercaseFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toLowerCase() + str.slice(1);
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
 * Formats a name for display when it appears after a preposition
 *
 * @param name The name to format
 * @returns Formatted name
 */
export const formatNameAfterPreposition = (name: string): string => {
  const cleanName = cleanRecipientName(name);
  return cleanName;
};

/**
 * Generates a formatted title for a bouquet based on recipient name
 *
 * @param name The recipient name
 * @returns Formatted title with correct preposition and capitalization
 */
export const formatRamilleteTitle = (name: string): string => {
  if (!name.trim()) return '';

  const cleanName = cleanRecipientName(name);
  const preposition = determineSpanishPreposition(cleanName);
  const formattedName = formatNameAfterPreposition(cleanName);

  return `Ramillete espiritual ${preposition} ${formattedName}`;
};
