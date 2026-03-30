/**
 * * @param {string} tag - Le nom de la balise (ex: 'div', 'span')
 * @param {Object}
 * @param  {...any}
 * @returns {HTMLElement}
 */
export function createElement(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.toLowerCase().substring(2);
      element.addEventListener(eventName, value);
    } else if (key === "className") {
      element.className = value;
    } else if (key === "dataset") {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        element.dataset[dataKey] = dataValue;
      }
    } else if (key === "style" && typeof value === "object") {
      for (const [styleKey, styleValue] of Object.entries(value)) {
        element.style[styleKey] = styleValue;
      }
    } else {
      element.setAttribute(key, value);
    }
  }

  const appendChild = (child) => {
    if (child == null || child === false) return;

    if (typeof child === "string" || typeof child === "number") {
      element.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  };

  children.forEach((child) => {
    if (Array.isArray(child)) {
      child.forEach(appendChild);
    } else {
      appendChild(child);
    }
  });

  return element;
}
