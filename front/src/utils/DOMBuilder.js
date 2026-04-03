export function el(tag, attributes = {}, ...children) {
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(attributes)) {
        if (key.startsWith("on") && typeof value === "function") {
            const eventName = key.substring(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else if (key === "className") {
            element.className = value;
        } else if (key === "dataset") {
            for (const [dataKey, dataValue] of Object.entries(value)) {
                element.dataset[dataKey] = dataValue;
            }
        } else if (key === "style" && typeof value === "object") {
            Object.assign(element.style, value);
        } else {
            if (value === true) element.setAttribute(key, "");
            else if (value !== false && value != null)
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

    children.flat(Infinity).forEach(appendChild);

    return element;
}
