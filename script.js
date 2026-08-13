async function search() {
  // Get the query from the input box
  let q = document.getElementById("query").value.toLowerCase();

  // Load the JSON data file
  let res = await fetch("data.json");
  let docs = await res.json();

  // Score each document
  let scored = [];
  for (let title in docs) {
    let text = docs[title].toLowerCase();
    let score = 0;

    // Keyword frequency
    let count = (text.match(new RegExp(q, "g")) || []).length;
    score += count;

    // Title boost
    if (title.toLowerCase().includes(q)) {
      score += 2;
    }

    // Push into results
    scored.push({ title, score, snippet: docs[title] });
  }

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  // Display results
  let output = "";
  for (let r of scored) {
    if (r.score > 0) {
      output += `<p><b>${r.title}</b>: ${r.snippet}</p>`;
    }
  }

  document.getElementById("results").innerHTML =
    output || "No results found.";
}
