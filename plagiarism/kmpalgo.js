const KMP = (text, pattern) => {
  let count = 0;
  let lps = new Array(pattern.length).fill(0);
  count = 0;
  lps = computeLPS(pattern, lps);

  let i = 0;
  let j = 0;

  while (i < text.length) {
    if (pattern[j] == text[i]) {
      j++;
      i++;
    }

    if (j == pattern.length) {
      //   console.log("Pattern found at index " + (i - j));
      count++;

      j = lps[j - 1];
    } else if (i < text.length && pattern[j] != text[i]) {
      if (j != 0) j = lps[j - 1];
      else i = i + 1;
    }
  }
  return count;
};

const computeLPS = (pattern, lps) => {
  let len = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] == pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len != 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
};

let string1 = [
  "allow",
  "instantly",
  "stranger",
  "applaud",
  "course",
  "separate",
  "trance",
  "welcome",
  "laugh",
  "moderate",
  "shy",
  "pique",
  "garden",
  "merry",
  "ye",
  "stand",
  "cold",
  "son",
  "deliver",
  "middleton",
  "attach",
  "companion",
  "man",
  "excel",
  "pianoforteperhaps",
  "pose",
  "ag",
  "effect",
  "trust",
  "deliver",
  "applaud",
  "affect",
  "sincere",
  "tolerably",
  "commend",
  "shameless",
  "feel",
  "object",
  "consist",
  "cheer",
  "perceive",
  "screen",
  "throw",
  "meet",
  "eat",
  "stance",
  "view",
  "hastily",
  "write",
  "dearest",
  "elderly",
  "weather",
  "direct",
  "sweet",
  "extreme",
  "daughter",
  "provide",
  "pack",
  "bringingdispatched",
  "treaty",
  "boisterous",
  "stimulate",
  "forbid",
  "picture",
  "vent",
  "carry",
  "sit",
  "limit",
  "month",
  "inhabit",
  "sex",
  "excuse",
  "chatty",
  "warmth",
  "add",
  "sweet",
  "earnestly",
  "dejectiongay",
  "walk",
  "demesne",
  "mention",
  "promise",
  "justice",
  "arrive",
  "increase",
  "inquietude",
  "companion",
  "accept",
  "admire",
  "weigh",
  "family",
  "stance",
  "wander",
  "ye",
  "unsatiable",
  "literature",
  "connect",
  "favour",
  "neglect",
  "perfectly",
  "continue",
  "dependentbut",
  "smile",
  "man",
  "imagine",
  "marry",
  "chiefly",
  "man",
  "manner",
  "cottage",
  "colonel",
  "know",
  "solicitude",
  "introduce",
  "companion",
  "inquietude",
  "remark",
  "friendship",
  "hors",
  "period",
  "motionless",
  "terminate",
  "man",
  "possess",
  "attach",
  "pleas",
  "melancholy",
  "sir",
  "smile",
  "arise",
  "share",
  "abroad",
  "easily",
  "lie",
  "lover",
  "temper",
  "look",
  "wisdom",
  "mon",
  "length",
  "mrsing",
  "long",
  "size",
  "wait",
  "mutual",
  "sed",
  "sister",
  "point",
  "chicken",
  "cheer",
  "spirit",
  "invite",
  "mariann",
  "laughter",
  "civil",
  "handsome",
  "sex",
  "prospect",
  "door",
  "rapid",
  "scale",
  "difficult",
  "ye",
  "deliver",
  "behaviour",
  "woman",
  "wind",
  "folly",
  "taste",
  "hope",
  "butdelightful",
  "remark",
  "announce",
  "treaty",
  "favour",
  "term",
  "voice",
  "equal",
  "friendship",
  "sufficient",
  "terminate",
  "frequent",
  "roof",
  "loud",
  "case",
  "lay",
  "music",
  "live",
  "noise",
  "genius",
  "pass",
  "upresolution",
  "possess",
  "cover",
  "round",
  "advantage",
  "add",
  "wall",
  "time",
  "spoil",
  "serve",
  "contempt",
  "render",
  "smallest",
  "study",
  "passage",
  "mention",
  "call",
  "horrible",
  "member",
  "pleasure",
  "vicinity",
  "estimable",
  "extreme",
  "middleton",
  "conceal",
  "perceive",
  "principle",
  "pleasure",
  "trance",
  "pare",
  "hereffect",
  "depend",
  "ecstatic",
  "elegy",
  "gai",
  "pose",
  "rend",
  "conclude",
  "sportsman",
  "ding",
  "vision",
  "educe",
  "be",
  "commonly",
  "cover",
  "estimate",
  "equal",
  "minute",
  "hastily",
  "hang",
  "st",
  "half",
  "pain",
  "fort",
  "mannerstwo",
  "assure",
  "edward",
  "worthy",
  "boil",
  "note",
  "wooks",
  "view",
  "sight",
  "tear",
  "additusons",
  "suspect",
  "conceal",
  "furnish",
  "meet",
  "devonshire",
  "decisively",
  "consider",
  "partial",
  "wait",
  "enter",
  "pass",
  "easy",
  "shy",
  "polite",
  "deny",
  "girl",
  "walk",
  "spot",
  "viewfrom",
  "httpswwwrandomtextgeneratorcom",
  "tuesday",
  "august",
  "20231111",
  "amnew",
];

let string2 = [
  "allow",
  "instantly",
  "stranger",
  "applaud",
  "course",
  "separate",
  "trance",
  "welcome",
  "laugh",
  "moderate",
  "shy",
  "pique",
  "garden",
  "merry",
  "ye",
  "stand",
  "cold",
  "son",
  "deliver",
  "middleton",
  "attach",
  "companion",
  "man",
  "excel",
  "pianoforteperhaps",
  "pose",
  "ag",
  "effect",
  "trust",
  "deliver",
  "applaud",
  "affect",
  "sincere",
  "tolerably",
  "commend",
  "shameless",
  "feel",
  "object",
  "consist",
  "cheer",
  "perceive",
  "screen",
  "throw",
  "meet",
  "eat",
  "stance",
  "view",
  "hastily",
  "write",
  "dearest",
  "elderly",
  "weather",
  "direct",
  "sweet",
  "extreme",
  "daughter",
  "provide",
  "pack",
  "bringingdispatched",
  "treaty",
  "boisterous",
  "stimulate",
  "forbid",
  "picture",
  "vent",
  "carry",
  "sit",
  "limit",
  "month",
  "inhabit",
  "sex",
  "excuse",
  "chatty",
  "warmth",
  "add",
  "sweet",
  "earnestly",
  "dejectiongay",
  "walk",
  "demesne",
  "mention",
  "promise",
  "justice",
  "arrive",
  "increase",
  "inquietude",
  "companion",
  "accept",
  "admire",
  "weigh",
  "family",
  "stance",
  "wander",
  "ye",
  "unsatiable",
  "literature",
  "connect",
  "favour",
  "neglect",
  "perfectly",
  "continue",
  "dependentusing",
  "tool",
  "excel",
  "practice",
  "student",
  "study",
  "english",
  "language",
  "liter",
  "mean",
  "phrase",
  "phrase",
  "mean",
  "time",
  "long",
  "m",
  "list",
  "online",
  "navigate",
  "single",
  "daunt",
  "create",
  "act",
  "number",
  "random",
  "idiom",
  "suit",
  "learn",
  "advantage",
  "tool",
  "standard",
  "phrase",
  "list",
  "tool",
  "excel",
  "learn",
  "english",
  "practice",
  "knowledge",
  "english",
  "idiom",
  "learn",
  "processsing",
  "long",
  "size",
  "wait",
  "mutual",
  "sed",
  "sister",
  "point",
  "chicken",
  "cheer",
  "spirit",
  "invite",
  "mariann",
  "laughter",
  "civil",
  "handsome",
  "sex",
  "prospect",
  "door",
  "rapid",
  "scale",
  "difficult",
  "ye",
  "deliver",
  "behaviour",
  "woman",
  "wind",
  "folly",
  "taste",
  "hope",
  "butdelightful",
  "remark",
  "announce",
  "treaty",
  "favour",
  "term",
  "voice",
  "equal",
  "friendship",
  "sufficient",
  "terminate",
  "frequent",
  "roof",
  "loud",
  "case",
  "lay",
  "music",
  "live",
  "noise",
  "genius",
  "pass",
  "upresolution",
  "possess",
  "cover",
  "round",
  "advantage",
  "add",
  "wall",
  "time",
  "spoil",
  "serve",
  "contempt",
  "render",
  "smallest",
  "study",
  "passage",
  "mention",
  "call",
  "horrible",
  "member",
  "pleasure",
  "vicinity",
  "estimable",
  "extreme",
  "middleton",
  "conceal",
  "perceive",
  "principle",
  "pleasure",
  "trance",
  "pare",
  "hereffect",
  "depend",
  "ecstatic",
  "elegy",
  "gai",
  "pose",
  "rend",
  "conclude",
  "sportsman",
  "ding",
  "vision",
  "educe",
  "be",
  "commonly",
  "cover",
  "estimate",
  "equal",
  "minute",
  "hastily",
  "hang",
  "st",
  "half",
  "pain",
  "fort",
  "mannerstwo",
  "assure",
  "edward",
  "worthy",
  "boil",
  "note",
  "wooks",
  "view",
  "sight",
  "tear",
  "additusons",
  "suspect",
  "conceal",
  "furnish",
  "meet",
  "devonshire",
  "decisively",
  "consider",
  "partial",
  "wait",
  "enter",
  "pass",
  "easy",
  "shy",
  "polite",
  "deny",
  "girl",
  "walk",
  "spot",
  "viewfrom",
  "httpswwwrandomtextgeneratorcom",
  "tuesday",
  "august",
  "20231111",
  "amnew",
];

const detectThreshold = (string1, string2) => {
  let total_len1 = string1.length;
  let total_len2 = string2.length;
  let match = 0;
  string1.map((token) => {
    string2.map((tokens) => {
      match += KMP(tokens, token);
    });
  });
  let total_len = total_len1 + total_len2;
  let threshold = (match / total_len) * 100;
  // console.log("total matched pattern is: ", count);

  // console.log("threshold is: ", threshold);
  // console.log(match);
  return threshold;
};
// const res = detectThreshold(string1, string2);
// console.log(res);
export default detectThreshold;
