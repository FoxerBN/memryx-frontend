// Method to clean storage after login to avoid overuse and filling up memory

export function cleanStorage() {
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("flashcard:")) {
        localStorage.removeItem(key);
      }
    }
    console.log("Flashcard storage cleaned successfully.");
  } catch (error) {
    console.error("Failed to clean flashcard storage:", error);
  }
}