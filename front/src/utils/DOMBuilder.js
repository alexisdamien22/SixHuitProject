/**
 * Construit un élément DOM de manière 100% sécurisée.
 * Aucun texte n'est évalué comme du HTML.
 * * @param {string} tag - Le nom de la balise (ex: 'div', 'span')
 * @param {Object} attributes - Les attributs, classes et événements
 * @param  {...any} children - Les enfants (texte, nœuds DOM, ou tableaux)
 * @returns {HTMLElement} Le nœud DOM prêt à être inséré
 */
export function el(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);

  // 1. Application sécurisée des attributs
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith("on") && typeof value === "function") {
      // Événements : onClick -> click
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === "className") {
      element.className = value;
    } else if (key === "dataset") {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        element.dataset[dataKey] = dataValue;
      }
    } else if (key === "style" && typeof value === "object") {
      // Uniquement pour les styles dynamiques calculés en JS
      Object.assign(element.style, value);
    } else {
      // Attributs standards (ex: type, placeholder, disabled)
      if (value === true) element.setAttribute(key, "");
      else if (value !== false && value != null)
        element.setAttribute(key, value);
    }
  }

  // 2. Insertion inerte des enfants (protection XSS)
  const appendChild = (child) => {
    if (child == null || child === false) return;
    if (typeof child === "string" || typeof child === "number") {
      element.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  };

  // flat(Infinity) permet de passer des .map() qui retournent des tableaux
  children.flat(Infinity).forEach(appendChild);

  return element;
}
