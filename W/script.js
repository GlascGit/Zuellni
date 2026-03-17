(() => {

    const DB_NAME = "ZuellniSearchDB";
    const STORE_NAME = "databases";

    let dbInstance = null;
    let loadedDBs = {};

    let keywords = {};
    let indexDB = {};

    let allResults = [];
    let currentPage = 1;
    const RESULTS_PER_PAGE = 10;

    // ---------------- DB ----------------

    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);

            request.onerror = () => reject(request.error);

            request.onsuccess = () => {
                dbInstance = request.result;
                resolve();
            };

            request.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "name" });
                }
            };
        });
    }

    function saveDB(name, data, version) {
        return new Promise((resolve, reject) => {
            const tx = dbInstance.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            const req = store.put({ name, data, version });

            req.onsuccess = resolve;
            req.onerror = () => reject(req.error);
        });
    }

    function getStoredDB(name) {
        return new Promise(resolve => {
            const tx = dbInstance.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(name);

            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    }

    async function fetchJSON(url) {
        const r = await fetch(url);
        return await r.json();
    }

    // ---------------- VERSION SYSTEM ----------------

    async function checkCoreUpdate() {
        const remoteVersion = await fetchJSON("https://www.db.zuellni.com/version.json");
        const stored = await getStoredDB("core");

        if (!stored || stored.version !== remoteVersion.core) {
            // download fresh core files
            keywords = await fetchJSON("https://www.db.zuellni.com/keywords.json");
            indexDB = await fetchJSON("https://www.db.zuellni.com/index.json");

            await saveDB("keywords.json", keywords, remoteVersion.core);
            await saveDB("index.json", indexDB, remoteVersion.core);
            await saveDB("core", {}, remoteVersion.core);
        } else {
            // use cached
            const k = await getStoredDB("keywords.json");
            const i = await getStoredDB("index.json");

            keywords = k.data;
            indexDB = i.data;
        }
    }

    // ---------------- SEARCH HELPERS ----------------

    function tokenize(text) {
        return text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
    }

    function tokensToIDs(tokens) {
        return tokens.map(t => keywords[t]).filter(id => id !== undefined);
    }

    function detectTech(ids) {
        return Object.keys(indexDB).filter(tech => ids.includes(indexDB[tech][0]));
    }

    // ---------------- DB LOADER ----------------

    async function loadDB(tech, dbEntry) {
        const dbName = dbEntry[0];
        const dbVersion = dbEntry[2] || "1.0";

        const key = `${tech}/${dbName}`;

        if (loadedDBs[key]) return loadedDBs[key];

        const stored = await getStoredDB(key);

        if (stored && stored.version === dbVersion) {
            loadedDBs[key] = stored.data;
            return stored.data;
        }

        const url = `https://www.db.zuellni.com/${tech}/${dbName}`;

        document.getElementById("dbStatus").textContent = `DB: downloading ${dbName}`;

        const data = await fetchJSON(url);

        await saveDB(key, data, dbVersion);

        loadedDBs[key] = data;

        document.getElementById("dbStatus").textContent = "DB: ready";

        return data;
    }

    // ---------------- MAIN SEARCH ----------------

    async function search() {
        const query = document.getElementById("searchInput").value.trim();
        if (!query) return;

        const tokens = tokenize(query);
        const ids = tokensToIDs(tokens);
        const techs = detectTech(ids);

        let results = [];
        const seen = new Set();

        const isTechOnly = techs.length > 0 && ids.length === techs.length;

        for (const tech of Object.keys(indexDB)) {

            if (isTechOnly && !techs.includes(tech)) continue;

            const dbs = indexDB[tech][1];

            for (const dbEntry of dbs) {

                const dbKeywords = dbEntry[1];

                if (!isTechOnly && !ids.some(id => dbKeywords.includes(id))) continue;

                const dbData = await loadDB(tech, dbEntry);

                for (const entry of dbData.data) {

                    if (seen.has(entry.link)) continue;

                    let matchCount;

                    if (isTechOnly) {
                        matchCount = 1;
                    } else {
                        matchCount = ids.filter(id => entry.ids.includes(id)).length;
                        if (matchCount === 0) continue;
                    }

                    const hasAll = !isTechOnly && matchCount === ids.length;

                    const score =
                    (matchCount * 1000) +
                    (hasAll ? 5000 : 0) +
                    (entry.rank || 0);

                    results.push({ ...entry, score });
                    seen.add(entry.link);
                }
            }
        }

        results.sort((a, b) => b.score - a.score);

        allResults = results;
        currentPage = 1;

        renderPage();

        loadedDBs = {};
    }

    // ---------------- RENDER ----------------

    function renderPage() {
        const start = (currentPage - 1) * RESULTS_PER_PAGE;
        const pageResults = allResults.slice(start, start + RESULTS_PER_PAGE);

        const list = document.getElementById("resultList");
        const stats = document.getElementById("resultStats");
        const pagination = document.getElementById("pagination");
        const pageInfo = document.getElementById("pageInfo");

        if (!allResults.length) {
            stats.textContent = "No results";
            list.innerHTML = "";
            pagination.style.display = "none";
            return;
        }

        stats.textContent = `${allResults.length} result(s)`;

        list.innerHTML = pageResults.map(r => `
        <div class="result-item">
        <a href="${r.link}" target="_blank" style="display:flex; gap:8px;">
        ${r.icon ? `<img src="${r.icon}" style="width:16px;height:16px;">` : ""}
        ${r.title || r.name || r.link}
        </a>
        <div>${r.description || ""}</div>
        <div class="result-link">
        <a href="${r.link}" target="_blank">${r.link}</a>
        </div>

        ${r.date ? `<div class="result-category">${r.date}</div>` : ""}
        </div>
        `).join("");

        const totalPages = Math.ceil(allResults.length / RESULTS_PER_PAGE);
        pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;

        pagination.style.display = totalPages > 1 ? "block" : "none";
    }

    // ---------------- EVENTS ----------------

    document.getElementById("searchBtn").addEventListener("click", search);

    document.getElementById("searchInput").addEventListener("keypress", e => {
        if (e.key === "Enter") search();
    });

        document.getElementById("nextBtn").onclick = () => {
            if (currentPage * RESULTS_PER_PAGE < allResults.length) {
                currentPage++;
                renderPage();
            }
        };

        document.getElementById("prevBtn").onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage();
            }
        };
        document.getElementById('menuBtn').addEventListener('click', function() {
            document.getElementById('dropdownMenu').classList.toggle('show');
        });

        window.addEventListener('click', function(event) {
            if (!event.target.matches('.menu-button')) {
                var dropdowns = document.getElementsByClassName('dropdown-menu');
                for (var i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        });
        // ---------------- INIT ----------------

        initDB().then(checkCoreUpdate);

})();
