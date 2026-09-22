/**
 * Match Engine
 * Calculates a possible-match score (0 - 100) between Lost and Found items.
 *
 * Scoring Breakdown:
 * - Category Match:       up to +30 pts
 * - Item Name Similarity: up to +30 pts
 * - Location Similarity:  up to +25 pts
 * - Date Similarity:      up to +15 pts
 * Total:                  up to 100 pts
 */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'to', 'from', 'up', 'down', 'of', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
  'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
  'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can',
  'will', 'just', 'don', 'should', 'now', 'and', 'or', 'is', 'was', 'are', 'were'
]);

/**
 * Clean and tokenize a string into significant keywords
 */
function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Calculates Jaccard similarity between two arrays of tokens
 */
function tokenSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++;
    }
  }

  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

/**
 * Compute similarity score between two items
 */
function calculateMatchScore(sourceItem, candidateItem) {
  let score = 0;
  const matchReasons = [];

  // 1. Category Match (30 points)
  const sourceCat = (sourceItem.category || '').trim().toLowerCase();
  const candCat = (candidateItem.category || '').trim().toLowerCase();

  if (sourceCat && candCat && sourceCat === candCat) {
    score += 30;
    matchReasons.push('Same Category (+30)');
  } else if (sourceCat === 'other' || candCat === 'other') {
    // Partial consideration if one is marked 'Other'
    score += 5;
    matchReasons.push('General Category (+5)');
  }

  // 2. Item Name Similarity (up to 30 points)
  const nameA = (sourceItem.itemName || '').trim().toLowerCase();
  const nameB = (candidateItem.itemName || '').trim().toLowerCase();

  if (nameA && nameB) {
    if (nameA === nameB) {
      score += 30;
      matchReasons.push('Exact Item Name Match (+30)');
    } else if (nameA.includes(nameB) || nameB.includes(nameA)) {
      score += 26;
      matchReasons.push('Very Similar Item Name (+26)');
    } else {
      const tokensA = tokenize(nameA);
      const tokensB = tokenize(nameB);
      const sim = tokenSimilarity(tokensA, tokensB);
      if (sim > 0) {
        const namePts = Math.min(30, Math.round(sim * 30));
        score += namePts;
        matchReasons.push(`Item Name Similarity (+${namePts})`);
      }
    }
  }

  // 3. Location Similarity (up to 25 points)
  const locA = (sourceItem.location || '').trim().toLowerCase();
  const locB = (candidateItem.location || '').trim().toLowerCase();

  if (locA && locB) {
    if (locA === locB) {
      score += 25;
      matchReasons.push('Exact Location Match (+25)');
    } else if (locA.includes(locB) || locB.includes(locA)) {
      score += 20;
      matchReasons.push('Near Same Location (+20)');
    } else {
      const locTokensA = tokenize(locA);
      const locTokensB = tokenize(locB);
      const locSim = tokenSimilarity(locTokensA, locTokensB);
      if (locSim > 0) {
        const locPts = Math.min(25, Math.round(locSim * 25));
        score += locPts;
        matchReasons.push(`Location Proximity (+${locPts})`);
      }
    }
  }

  // 4. Date Proximity (up to 15 points)
  if (sourceItem.date && candidateItem.date) {
    try {
      const dateA = new Date(sourceItem.date);
      const dateB = new Date(candidateItem.date);
      const diffMs = Math.abs(dateA.getTime() - dateB.getTime());
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let datePts = 0;
      if (diffDays === 0) {
        datePts = 15;
        matchReasons.push('Reported On Same Date (+15)');
      } else if (diffDays <= 1) {
        datePts = 13;
        matchReasons.push('Within 1 Day (+13)');
      } else if (diffDays <= 3) {
        datePts = 10;
        matchReasons.push('Within 3 Days (+10)');
      } else if (diffDays <= 7) {
        datePts = 6;
        matchReasons.push('Within 1 Week (+6)');
      } else if (diffDays <= 14) {
        datePts = 3;
        matchReasons.push('Within 2 Weeks (+3)');
      }

      score += datePts;
    } catch (_) {
      // Date parse error ignored safely
    }
  }

  return {
    score: Math.min(100, score),
    matchReasons
  };
}

/**
 * Finds matching items for a given item from the list of all items.
 * If item is 'lost', matches against 'found', and vice-versa.
 * Returns array of matches sorted by score descending.
 */
function findMatches(sourceItem, allItems, minThreshold = 25) {
  if (!sourceItem) return [];

  const targetType = sourceItem.type === 'lost' ? 'found' : 'lost';

  const matches = [];

  for (const candidate of allItems) {
    // Avoid matching with itself or the same type
    if (String(candidate.id) === String(sourceItem.id)) continue;
    if (candidate.type !== targetType) continue;

    const { score, matchReasons } = calculateMatchScore(sourceItem, candidate);

    if (score >= minThreshold) {
      matches.push({
        item: candidate,
        matchScore: score,
        matchPercentage: `${score}%`,
        reasons: matchReasons
      });
    }
  }

  // Sort by highest match score first
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches;
}

module.exports = {
  calculateMatchScore,
  findMatches
};
