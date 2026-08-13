function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function search() {
  let q = document.getElementById("query").value.toLowerCase();
  if (!q) {
    document.getElementById("results").innerHTML = "Please enter a search term.";
    return;
  }

  try {
    let res = await fetch("data.json");
    let docs = await res.json();

    let scored = [];
    for (let title in docs) {
      let text = docs[title].toLowerCase();
      let safeQuery = escapeRegex(q);
      let score = 0;

      // Keyword frequency
      let count = (text.match(new RegExp(safeQuery, "gi")) || []).length;
      score += count;

      // Title boost
      if (title.toLowerCase().includes(q)) {
        score += 2;
      }

      scored.push({ title, score, snippet: docs[title] });
    }

    scored.sort((a, b) => b.score - a.score);

    let output = scored.filter(r => r.score > 0)
      .map(r => `<p><b>${r.title}</b>: ${r.snippet}</p>`)
      .join("") || "No results found.";

    document.getElementById("results").innerHTML = output;
  } catch (err) {
    document.getElementById("results").innerHTML = "Error loading search data.";
    console.error(err);
  }
}
