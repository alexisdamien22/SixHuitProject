export function setSecureHTML(targetElement, htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  doc.querySelectorAll("script").forEach((script) => script.remove());

  doc.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.toLowerCase().startsWith("on"))
        el.removeAttribute(attr.name);
    });
  });

  targetElement.replaceChildren(...doc.body.childNodes);
}
