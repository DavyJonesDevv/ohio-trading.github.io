// gun-skin-site: client-side viewer + lightweight editor
let skins = [];
const defaultSkins = [
  {"name":"Galaxy Reaper","worth":2500,"demand":"Very High","rarity":"legend","notes":"Collector favorite","image":""},
  {"name":"Crimson Fury","worth":1200,"demand":"High","rarity":"epic","notes":"Popular in comp play","image":""},
  {"name":"Neon Viper","worth":850,"demand":"Medium","rarity":"rare","notes":"Colorful and visible","image":""},
  {"name":"Ghost Iron","worth":300,"demand":"Low","rarity":"common","notes":"Budget option","image":""},
  {"name":"Urban Camo X","worth":150,"demand":"Low","rarity":"common","notes":"Cheap camo skin","image":""}
];

// DOM refs
const tbody = document.querySelector("#skinsTable tbody");
const searchInput = document.getElementById("search");
const filterDemand = document.getElementById("filterDemand");
const sortBy = document.getElementById("sortBy");
const emptyText = document.getElementById("empty");
const editor = document.getElementById("editor");
const editorArea = document.getElementById("editorArea");

// load data (attempt fetch skins.json; fall back to default)
async function loadData(){
  try{
    const res = await fetch("skins.json", {cache:"no-store"});
    if(!res.ok) throw new Error("no local JSON");
    skins = await res.json();
  }catch(e){
    skins = JSON.parse(JSON.stringify(defaultSkins));
  }
  render();
}

// render table
function render(){
  let list = skins.slice();

  // search
  const q = searchInput.value.trim().toLowerCase();
  if(q) list = list.filter(s => s.name.toLowerCase().includes(q) || (s.notes||"").toLowerCase().includes(q));

  // filter demand
  if(filterDemand.value) list = list.filter(s => s.demand === filterDemand.value);

  // sort
  const key = sortBy.value;
  if(key === "worth_desc") list.sort((a,b)=>b.worth - a.worth);
  else if(key === "worth_asc") list.sort((a,b)=>a.worth - b.worth);
  else if(key === "name_asc") list.sort((a,b)=>a.name.localeCompare(b.name));
  else if(key === "demand_desc"){
    const order = {"Very High":4,"High":3,"Medium":2,"Low":1};
    list.sort((a,b)=> (order[b.demand]||0) - (order[a.demand]||0));
  }

  tbody.innerHTML = "";
  if(list.length === 0){
    emptyText.style.display = "block";
    return;
  } else emptyText.style.display = "none";

  for(const s of list){
    const tr = document.createElement("tr");

    // preview cell
    const imgCell = document.createElement("td");
    const preview = document.createElement("div");
    preview.className = "preview";
    preview.textContent = s.name.split(" ").slice(0,2).map(w=>w[0]).join("") || "—";
    imgCell.appendChild(preview);
    tr.appendChild(imgCell);

    // name
    const nameCell = document.createElement("td");
    nameCell.textContent = s.name;
    tr.appendChild(nameCell);

    // worth
    const worthCell = document.createElement("td");
    worthCell.textContent = Number(s.worth).toLocaleString();
    tr.appendChild(worthCell);

    // demand
    const demandCell = document.createElement("td");
    demandCell.textContent = s.demand || "Unknown";
    tr.appendChild(demandCell);

    // rarity
    const rarityCell = document.createElement("td");
    const pill = document.createElement("span");
    pill.className = "rarity-pill rarity-" + (s.rarity || "common");
    pill.textContent = (s.rarity || "common").replace(/\b\w/g, c=>c.toUpperCase());
    rarityCell.appendChild(pill);
    tr.appendChild(rarityCell);

    // notes
    const notesCell = document.createElement("td");
    notesCell.textContent = s.notes || "";
    tr.appendChild(notesCell);

    tbody.appendChild(tr);
  }
}

// UI events
searchInput.addEventListener("input", render);
filterDemand.addEventListener("change", render);
sortBy.addEventListener("change", render);

// editor modal
document.getElementById("openEditor").addEventListener("click", ()=>{
  editor.setAttribute("aria-hidden","false");
  editorArea.value = JSON.stringify(skins, null, 2);
  editorArea.focus();
});
document.getElementById("closeEditor").addEventListener("click", ()=>editor.setAttribute("aria-hidden","true"));
document.getElementById("saveEditor").addEventListener("click", ()=>{
  try{
    const data = JSON.parse(editorArea.value);
    if(!Array.isArray(data)) throw new Error("JSON must be an array");
    skins = data;
    editor.setAttribute("aria-hidden","true");
    render();
    alert("Saved to page (client-side only). To persist, replace skins.json in the repo.");
  }catch(err){
    alert("Invalid JSON: " + err.message);
  }
});
document.getElementById("resetData").addEventListener("click", ()=>{
  if(confirm("Reset to sample dataset? This will replace the editor contents.")){
    editorArea.value = JSON.stringify(defaultSkins, null, 2);
  }
});

// download JSON
document.getElementById("downloadJson").addEventListener("click", ()=>{
  const blob = new Blob([JSON.stringify(skins, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "skins.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// keyboard: Esc closes editor
document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape") editor.setAttribute("aria-hidden","true");
});

// initial load
loadData();
