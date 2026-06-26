/**
 * A tiny, controlled word list used only by the unit tests.
 *
 * Tests need a small dictionary so expected ratios stay exact and readable.
 * Using a real built-in (2800+ words) would make assertions fragile. These
 * are BASE forms only (go, study, child) — never inflected forms.
 */
export const SAMPLE_WORDS: readonly string[] = [
  // function words
  "a", "an", "the", "and", "or", "but", "not", "no", "yes",
  "i", "you", "he", "she", "it", "we", "they", "this", "that", "these", "those",
  "to", "of", "in", "on", "at", "for", "with", "by", "from", "about", "as",
  "is", "be", "have", "do", "will", "can", "would", "should", "may", "must",
  "very", "so", "too", "more", "much", "many", "some", "any", "all", "every",
  // common verbs (base form)
  "go", "come", "make", "take", "give", "get", "see", "look", "know", "think",
  "say", "tell", "find", "feel", "work", "play", "study", "read", "write",
  "run", "walk", "eat", "drink", "sleep", "help", "want", "need", "like", "love",
  "use", "try", "begin", "stop", "open", "close", "live", "leave", "stay", "move",
  // common nouns (base form)
  "child", "man", "woman", "person", "people", "friend", "family", "home",
  "school", "book", "word", "language", "english", "day", "time", "year",
  "water", "food", "city", "country", "world", "life", "story", "thing",
  "hand", "foot", "head", "eye", "dog", "cat", "tree", "house",
  // common adjectives (base form)
  "good", "bad", "big", "small", "happy", "sad", "new", "old", "easy", "hard",
  "quick", "slow", "high", "low", "long", "short", "hot", "cold", "tall",
];
