function splitTextIntoWords(text) {
  // Use a regular expression to match words, including those with punctuation
  return text.match(/\b\w+\b|[.,!?;:()]/g) || [];
}

function processTextNode(textNode) {
  let text = textNode.nodeValue;

  // Check if the text is a JSON string
  let isJson = false;
  try {
    const json = JSON.parse(text);
    text = JSON.stringify(json, null, 2); // Format the JSON string
    isJson = true;
  } catch (e) {
    // Not a JSON string, proceed as normal
  }

  const words = splitTextIntoWords(text);
  const updatedWords = words.map(function (word) {
    if (/^\p{L}{6}$/u.test(word) && !/™$/.test(word)) {
      return word + '™';
    }
    return word;
  });

  let updatedText;
  if (isJson) {
    updatedText = updatedWords.join('');
  } else {
    updatedText = updatedWords.join(' ');
  }

  // Update the text node content
  textNode.nodeValue = updatedText;
}

function updateSixLetterWords() {
  const textNodes = [];
  const walk = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false,
  );

  let node;
  while ((node = walk.nextNode())) {
    textNodes.push(node);
  }

  textNodes.forEach(processTextNode);
}

(function () {
  function onLocationChange() {
    setTimeout(() => {
      updateSixLetterWords();
    }, 0);
  }

  const originalPushState = history.pushState;
  history.pushState = function () {
    const result = originalPushState.apply(this, arguments);
    onLocationChange();
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function () {
    const result = originalReplaceState.apply(this, arguments);
    onLocationChange();
    return result;
  };

  window.addEventListener('popstate', onLocationChange);
  window.addEventListener('hashchange', onLocationChange);
})();

window.onload = updateSixLetterWords;
