let skins = [];

async function loadData() {
  try {
    const res = await fetch("skins.json");
    if (res.ok) skins = await res.json();
  } catch {}
  if (skins.length === 0 && typeof embeddedSkins !== "undefined") skins = embeddedSkins;
  render();
}

const formatWorth = n => n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1e3 ? Math.floor(n/1e3)+"K" : n;
const tbody = document.querySelector("#skinsTable tbody");
const searchInput = document.getElementById("search");
const sortBy = document.getElementById("sortBy");

function render() {
  let list = skins.slice();
  const q = searchInput.value.trim().toLowerCase();
  if (q) list = list.filter(s => s.name.toLowerCase().includes(q));

  switch (sortBy.value) {
    case "worth_desc":  list.sort((a,b) => b.worth - a.worth); break;
    case "worth_asc":   list.sort((a,b) => a.worth - b.worth); break;
    case "demand_desc": list.sort((a,b) => parseFloat(b.demand || 0) - parseFloat(a.demand || 0)); break;
    case "name_asc":    list.sort((a,b) => a.name.localeCompare(b.name)); break;
  }

  tbody.innerHTML = "";
  for (const s of list) {
    const demandNum = s.demand === "?" ? 0 : parseFloat(s.demand);
    const demandClass = demandNum >= 8 ? "high" : demandNum >= 6 ? "med" : demandNum >= 4 ? "low" : "very-low";
    const demandText = s.demand === "?" ? "Unknown" : s.demand + "/10";

    const worthText = s.worth === 0 ? "Unrated" : "$" + formatWorth(s.worth);
    const worthClass = s.worth === 0 ? "unrated" : "worth";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="text-align:left;padding-left:1.5rem;">${s.name}</td>
      <td class="${worthClass}">${worthText}</td>
      <td class="demand ${demandClass}">${demandText}</td>
    `;
    tbody.appendChild(row);
  }
}

searchInput.addEventListener("input", render);
sortBy.addEventListener("change", render);

loadData();
