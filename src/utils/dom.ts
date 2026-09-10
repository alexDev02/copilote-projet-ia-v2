type Attrs = Readonly<Record<string, string>>;

/** Crée un élément DOM avec attributs et enfants, sans jamais passer par innerHTML. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: readonly (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') node.className = value;
    else node.setAttribute(key, value);
  });
  children.forEach((child) => {
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

export function clearChildren(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function mount(root: Element, node: Node): void {
  clearChildren(root);
  root.appendChild(node);
}
