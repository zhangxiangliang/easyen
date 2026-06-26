/**
 * Irregular inflected forms -> base (dictionary) form.
 *
 * Rules alone cannot turn "went" into "go" or "children" into "child".
 * This small hand-made map covers the most common irregular words so the
 * lemmatizer does not wrongly mark them as "out of vocabulary".
 *
 * Keep keys lower-case. You can extend this map freely; nothing else needs
 * to change.
 */
export const IRREGULARS: Readonly<Record<string, string>> = {
  // be / have / do
  is: "be", am: "be", are: "be", was: "be", were: "be", been: "be", being: "be",
  has: "have", had: "have", having: "have",
  does: "do", did: "do", done: "do", doing: "do",

  // common irregular verbs (past / past participle)
  went: "go", gone: "go", going: "go",
  said: "say", saying: "say",
  made: "make", making: "make",
  came: "come", coming: "come",
  took: "take", taken: "take", taking: "take",
  knew: "know", known: "know",
  got: "get", gotten: "get", getting: "get",
  saw: "see", seen: "see", seeing: "see",
  gave: "give", given: "give", giving: "give",
  found: "find", finding: "find",
  thought: "think", thinking: "think",
  told: "tell", telling: "tell",
  became: "become", becoming: "become",
  left: "leave", leaving: "leave",
  felt: "feel", feeling: "feel",
  brought: "bring", bringing: "bring",
  began: "begin", begun: "begin", beginning: "begin",
  kept: "keep", keeping: "keep",
  held: "hold", holding: "hold",
  wrote: "write", written: "write", writing: "write",
  stood: "stand", standing: "stand",
  heard: "hear", hearing: "hear",
  met: "meet", meeting: "meet",
  ran: "run", running: "run",
  paid: "pay", paying: "pay",
  sat: "sit", sitting: "sit",
  spoke: "speak", spoken: "speak", speaking: "speak",
  led: "lead", leading: "lead",
  grew: "grow", grown: "grow", growing: "grow",
  drew: "draw", drawn: "draw", drawing: "draw",
  flew: "fly", flown: "fly", flying: "fly",
  drove: "drive", driven: "drive", driving: "drive",
  broke: "break", broken: "break", breaking: "break",
  chose: "choose", chosen: "choose", choosing: "choose",
  ate: "eat", eaten: "eat", eating: "eat",
  fell: "fall", fallen: "fall", falling: "fall",
  bought: "buy", buying: "buy",
  caught: "catch", catching: "catch",
  taught: "teach", teaching: "teach",
  sold: "sell", selling: "sell",
  sent: "send", sending: "send",
  built: "build", building: "build",
  spent: "spend", spending: "spend",
  lost: "lose", losing: "lose",
  won: "win", winning: "win",
  sang: "sing", sung: "sing", singing: "sing",
  swam: "swim", swimming: "swim",
  threw: "throw", thrown: "throw", throwing: "throw",
  wore: "wear", worn: "wear", wearing: "wear",
  woke: "wake", woken: "wake", waking: "wake",
  rose: "rise", risen: "rise", rising: "rise",
  shook: "shake", shaken: "shake", shaking: "shake",
  hid: "hide", hidden: "hide", hiding: "hide",
  bit: "bite", bitten: "bite", biting: "bite",
  fed: "feed", feeding: "feed",
  lit: "light", lighting: "light",
  put: "put", putting: "put",
  let: "let", letting: "let",
  cut: "cut", cutting: "cut",

  // irregular plurals
  children: "child",
  men: "man", women: "woman",
  feet: "foot", teeth: "tooth",
  geese: "goose", mice: "mouse",
  people: "person",
  lives: "life", knives: "knife", wives: "wife",
  leaves: "leaf", wolves: "wolf", shelves: "shelf",
  halves: "half", thieves: "thief", loaves: "loaf",
  selves: "self",

  // irregular function-word variants (articles, pronouns, determiners).
  // These have no suffix rule, so they must be mapped by hand.
  an: "a",
  me: "i", my: "i", mine: "i", myself: "i",
  him: "he", his: "he", himself: "he",
  her: "she", hers: "she", herself: "she",
  them: "they", their: "they", theirs: "they", themselves: "they",
  us: "we", our: "we", ours: "we", ourselves: "we",
  your: "you", yours: "you", yourself: "you",
  its: "it", itself: "it",
  these: "this", those: "that",
  whom: "who",

  // irregular comparatives / superlatives
  better: "good", best: "good",
  worse: "bad", worst: "bad",
  more: "much", most: "much",
  further: "far", furthest: "far", farther: "far", farthest: "far",
  less: "little", least: "little",
  elder: "old", eldest: "old",
};
