import mock from "../mock/page";

const pasreHTMLString = (string) => { // translate layout string to DOM-tree
  const parser = new DOMParser();
  return parser.parseFromString(string, "text/html");
};

const getNodes = (string) => { // get entire content from <body>-tag
  const doc = pasreHTMLString(string);
  return doc.querySelector("body");
};

const parseNodes = (string) => { // get all text nodes
  const strings = Array();
  const walking = (string) => {
    string.childNodes.forEach((element) => {
      if (
        element.nodeName === "#text" &&
        element.nodeType == 3 &&
        !/SCRIPT|STYLE/.test(element.parentNode.tagName)
      ) {
        strings.push(element.textContent);
        return;
      } else {
        walking(element);
      }
    });
  };
  walking(getNodes(string));
  return strings;
};

const parseStrings = (string) =>  // clean-up unnecessary symbols
  parseNodes(string).map(element =>
    element
      .replace(/[^A-Za-zА-Яа-я\s]/gi, " ")
      .trim()
      .replace(/\s+/g, " ")
  );

const parseWords = (string) => // filter for leave only unique and long words
  new Set( 
      parseStrings(string)
        .map((element) => element.split(" "))
        .flatMap((element) => element)
        .filter((element) => element.length > 3)
        .map((element) => element.toLowerCase()),
  );

const appendAnswer = (string) => {  // add answer in document
  const data = parseWords(string);
  const container = document.querySelector(".content") as Element;
  const template = document.querySelector(".template") as HTMLTemplateElement ;
  const templateConteiner = template.content.querySelector(".template__conteiner") as Element;
  const allWords = template.content.querySelector(".all-words") as Element;
  const wordsCount = template.content.querySelector(".words-count") as Element;

  allWords.childNodes[2].textContent = [...data].toString();
  wordsCount.childNodes[1].textContent = `Ответ: ${[...data].length} уникальных слов`;

  container.appendChild(templateConteiner);
};

window.addEventListener("load", () => {  // run script when content load
  appendAnswer(mock);
});