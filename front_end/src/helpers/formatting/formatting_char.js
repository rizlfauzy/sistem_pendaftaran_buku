export const exc_char = ["@", "#", "!", "$", "%", "^", "&", "*", "<", ">", "?", " ",":",";"];

export function including_char(text) {
  return exc_char.some((char) => text.includes(char));
}

export function replace_char(text) {
  return text.replace(/[\.|@|!|#|$|%|^|&|*|<|>| |:|;]/gi, "_");
}
