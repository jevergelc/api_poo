/**
 * Utilidad para leer y escribir archivos JSON.
 */
const fs = require("fs").promises;

async function readJson(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await writeJson(filePath, []);
      return [];
    }
    throw err;
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = { readJson, writeJson };
