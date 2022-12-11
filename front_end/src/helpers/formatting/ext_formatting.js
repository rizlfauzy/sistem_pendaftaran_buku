export const ext_exclude = (text, ...exts) => {
  try {
    if (exts.length === 0) throw new Error("No extension provided");
    const ext = text.split(".").pop();
    if (!ext) throw new Error("No extension found");
    return exts.includes(ext.toLowerCase());
  } catch (e) {
    console.error(e.message);
  }
 };