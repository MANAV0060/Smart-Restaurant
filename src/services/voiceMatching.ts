/**
 * Phonetic & Fuzzy Search Engine for Gourmet Voice & Search Input
 * Maps mispronunciations (e.g. "burgir", "pisa", "pneer", "chiken") to correct dish categories & items.
 */

const PHONETIC_ALIASES: Record<string, string[]> = {
  burger: ['burgir', 'boorgir', 'birger', 'burgar', 'burgre', 'ham burger', 'smash burger'],
  pizza: ['pisa', 'piza', 'pissa', 'peezza', 'pitza', 'neapolitan'],
  indian: ['paneer', 'pneer', 'panner', 'butter chicken', 'makhani', 'curry', 'handi', 'tikka', 'chiken', 'dum pukht'],
  pasta: ['pasta', 'fettuccine', 'alfredo', 'macaroni', 'noodle'],
  chinese: ['dim sum', 'dumpling', 'bao', 'momos', 'wok'],
  starters: ['appetizer', 'starter', 'starteres', 'kurkure', 'fries'],
  desserts: ['sweet', 'dessert', 'lava cake', 'ice cream', 'gelato', 'chocolate'],
  beverages: ['drink', 'smoothie', 'mojito', 'elixir', 'coffee', 'juice', 'soda'],
  healthy: ['salad', 'quinoa', 'buddha bowl', 'diet', 'keto', 'low cal'],
  spicy: ['spicy', 'tikhat', 'masaledar', 'hot', 'chili'],
};

// Levenshtein Distance for fuzzy string matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function matchVoiceSearch(rawInput: string): { normalizedKeyword: string; categoryHint?: string } {
  const clean = rawInput.toLowerCase().trim();

  // Check direct alias dictionary match
  for (const [category, aliases] of Object.entries(PHONETIC_ALIASES)) {
    if (aliases.some(alias => clean.includes(alias) || alias.includes(clean))) {
      return { normalizedKeyword: category, categoryHint: category };
    }
  }

  // Fuzzy Levenshtein check against main categories
  const words = clean.split(/\s+/);
  for (const word of words) {
    if (word.length < 3) continue;
    for (const [key, aliases] of Object.entries(PHONETIC_ALIASES)) {
      for (const alias of aliases) {
        if (levenshteinDistance(word, alias) <= 2) {
          return { normalizedKeyword: key, categoryHint: key };
        }
      }
    }
  }

  return { normalizedKeyword: clean };
}
