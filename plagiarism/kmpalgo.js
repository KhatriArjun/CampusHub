

function computeLPSArray(pat, M, lps) {
  // length of the previous longest prefix suffix
  var len = 0;
  var i = 1;
  lps[0] = 0; // lps[0] is always 0

  // the loop calculates lps[i] for i = 1 to M-1
  while (i < M) {
    if (pat.charAt(i) == pat.charAt(len)) {
      len++;
      lps[i] = len;
      i++;
    } // (pat[i] != pat[len])
    else {
      // This is tricky. Consider the example.
      // AAACAAAA and i = 7. The idea is similar
      // to search step.
      if (len != 0) {
        len = lps[len - 1];

        // Also, note that we do not increment
        // i here
      } // if (len == 0)
      else {
        lps[i] = len;
        i++;
      }
    }
  }
}

const KMPSearch = (pat, txt) => {
  var M = pat.length;
  var N = txt.length;
  let count = 0;

  // create lps[] that will hold the longest
  // prefix suffix values for pattern
  var lps = [];
  var j = 0; // index for pat[]

  // Preprocess the pattern (calculate lps[]
  // array)
  computeLPSArray(pat, M, lps);

  var i = 0; // index for txt[]
  while (N - i >= M - j) {
    if (pat.charAt(j) == txt.charAt(i)) {
      j++;
      i++;
    }
    if (j == M) {
      // document.write("Found pattern " + "at index " + (i - j) + "\n");
      j = lps[j - 1];

      count++;
      // console.log("count", count);
      // console.log("pattern found between: ", pat, txt);
    }

    // mismatch after j matches
    else if (i < N && pat.charAt(j) != txt.charAt(i)) {
      // Do not match lps[0..lps[j-1]] characters,
      // they will match anyway
      if (j != 0) j = lps[j - 1];
      else i = i + 1;
    }
  }
  return count;
};

const detectThreshold = (string1, string2) => {
  let total_len1 = string1.length;
  // console.log("pailo string", total_len1);
  let total_len2 = string2.length;
  // console.log("dosro string", total_len2);
  let match = 0;
  string1.map((token) => {
    string2.map((tokens) => {
      match += KMPSearch(tokens, token);
      // console.log("match", match);
    });
  });
  // console.log("this is match", match);
  let total_len = total_len1 + total_len2;
  // console.log("this is total len", total_len);
  let threshold = (match / total_len) * 100;
  // console.log("threshold fo kmp", threshold);
  return threshold;
};

export default detectThreshold;
