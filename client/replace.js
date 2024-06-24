function splitTextWithTrademark(text) {
  const words = text.split(/\b(?=\w*™\b)/);
  return words.map((word) => word.trim());
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

  textNodes.forEach(function (textNode) {
    const text = textNode.nodeValue;
    const words = splitTextWithTrademark(text);
    const updatedWords = words.map(function (word) {
      if (/^\p{L}{6}$/u.test(word)) {
        return word + '™';
      }
      return word;
    });

    const updatedText = updatedWords.join('');

    const span = document.createElement('span');
    span.innerHTML = updatedText;
    textNode.parentNode.replaceChild(span, textNode);
  });
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
