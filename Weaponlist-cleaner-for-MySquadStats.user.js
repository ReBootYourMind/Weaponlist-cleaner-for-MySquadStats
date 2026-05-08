// ==UserScript==
// @name         Weaponlist cleaner for MySquadStats
// @version      2.8
// @description  Strips multiple suffixes (e.g. "M150" AND "Foregrip") from weapon names, groups some weapons like mines and different variants together, code by Gemini
// @author       ReBootYourMind
// @match        *://*.mysquadstats.com/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/ReBootYourMind/Weaponlist-cleaner-for-MySquadStats/main/Weaponlist-cleaner-for-MySquadStats.user.js
// @downloadURL  https://raw.githubusercontent.com/ReBootYourMind/Weaponlist-cleaner-for-MySquadStats/main/Weaponlist-cleaner-for-MySquadStats.user.js
// @supportURL   https://github.com/ReBootYourMind/YOUR_REPO/issues
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    // CATEGORY GROUPING (Matches keyword anywhere in name)
    // =========================================================
    const categoryMap = [
        { keywords: ["Destroyed", "Destroy", "Obliterated", "Obliterate", "Knockedout"], groupName: "Vehicle Destructions" },
        { keywords: ["Burning", "Burn", "Burned"], groupName: "Vehicle Burn-offs" },
        { keywords: ["Tandem", "NLAW"], groupName: "Tandem AT Hits" },
        { keywords: ["Ammocook"], groupName: "Ammorack explosions" },
        { keywords: ["Mine"], groupName: "AT Mines" },
        { keywords: ["Soldier","Soldiers"], groupName: "Soldier" },
        { keywords: ["Bayonet2000","SA80Bayonet","AKMBayonet","Knife"], groupName: "Knifes" },
        { keywords: ["C4","Explosive","Explosives","C4Explosive","TNT","Bangerite","IED"], groupName: "Deployable Explosive" },
        {
            keywords: ["Frag"],
            groupName: "Frag Grenades",
            exclude: ["Projectile", "125mm", "RPG", "SPG", "100mm", "73mm", "og9v", "120mm","BMD4M","ZBL08","76MM"]
        },
        { keywords: [" AP"], groupName: "Autocannon AP rounds" },
        { keywords: ["CROWS M2","EnforcerRWS M2","AAVP7A1 M2","PMV RWS M2","M1117 M2","M1A1 USMC Cmdr M2","CobraRWS M2","SancakRWS M2","50Cal M1151"], groupName: "Vehicle M2" },
        { keywords: ["Kord Tigr","Kord Safir","Kord BTR-D","Kord Kozak","Kord Cupola"], groupName: "Vehicle Kord",},
        { keywords: ["M252 HE"], groupName: "25mm HE" },
        { keywords: ["PKT"], groupName: "Vehicle PKT" }
    ];
        // Add more: { keywords: ["Logi", "Truck"], groupName: "Logistics Vehicles" },

    // =========================================================
    // 1. WEAPON ALIASES (Grouping variants into a master name)
    // Format: "Ugly Name": "Master Name"
    // =========================================================
    const weaponGroupMap = {
        "M4A1":"M4",
        "M4 Classic Fajr":"M4",
        "M4M203":"M4",
        "M16A4":"M16",
        "M16A2M203":"M16",
        "M16A2":"M16",
        "M16A4M203":"M16",
        "G3KA4":"G3",
        "G3A3":"G3",
        "G3A4":"G3",
        "G3A7":"G3",
        "G3Bayonet":"G3",
        "G3SG1":"G3",
        "G3A3HK79":"G3",
        "AK74Bayonet":"AK74",
        "AK74M":"AK74",
        "AKS74U":"AK74",
        "AKS74":"AK74",
        "C14":"C14 Timberwolf",
        "TW 338 SWS":"C14 Timberwolf",
        "AK12GP25":"AK12",
        "Soldier USA LAT AT4":"Soldier",
        "Soldier RU LAT Rpg26":"Soldier",
        "Soldier IMF HAT RPG29":"Soldier",
        "Soldier USMC LAT M72":"Soldier",
        "Soldier AFU LAT C90":"Soldier",
        "Soldiers":"Soldier",
        "40MM MK19":"40MM",
        "40MM VOG":"40MM",
        "AGS30 40MM VOG":"40MM",
        "AK74MGP25":"AK74",
        "New AK74":"AK74",
        "L85A2AG36":"L85A2"
    };

    // =========================================================
    // ADD NEW TERMS HERE
    // =========================================================
    const termsToRemove = [
        // --- Scopes & Sights ---
        "1P29", "1P63", "1P78", "1P78Picatinny", "A940", "ACOG", "Aimpoint",
        "Carryhandle", "C79", "C79A2", "CSK131", "CTM131", "Elcan", "ElcanLDS",
        "EOTech", "ET552", "EXPS", "Holo", "Ironsight", "IronSights", "M145",
        "M150", "M68", "MGO", "Meupold", "NoOptic", "OKP7", "Optic", "Optics",
        "PSO-1", "QMK171A", "RDS", "Reddot", "Sights", "Scope", "Specter",
        "SUSAT", "T800", "ZF48", "ZPoint", "QMK171A", "OKP-7", "QMK-191",
        "M1A", "Yoloson", "M68",

        // --- Attachments & Handling ---
        "AK40GL", "Bayonet", "Compensator", "Foregrip", "Frontgrip", "Grippod",
        "M203A1", "NoBipod", "PushCO", "QLG-10", "Semi", "SimonOffense",
        "SL40", "Wormpool", "Timed", "Suppressor", "Suppressed", "Bipod",

        // --- Ammo & Tracers ---
        "2Mag", "2mags", "3Mags", "4Mag", "4Mags", "4mags", "5Mags", "6Mag",
        "7mags", "45Rnd", "Drum", "LowAmmo", "Mag58", "Rarden", "Stick",
        "Tracer", "Red", "Green", "Blue", "Brown", "10mags", "ExtendedMag",
        "9Mag", "9mags", "Cmag", "1mag",

        // --- Camos & Environment ---
        "2D", "3D", "Arid", "Desert", "Naval", "Snow", "Winter", "Woodland", "Black",

        // --- Factions & Teams ---
        "ADF", "AFU", "BAF", "CAF", "CRF", "GFI", "IMF", "INS", "Insurgents", "IAR",
        "MEA", "MIL", "Militia", "PLA", "PLANMC", "RUS", "TLF", "USA", "USMC",
        "VDV", "WPMC", "RU",

        // --- Kits ---
        "AutomaticRifleman", "Autorifleman", "Crewman", "Crewman1", "CrewmanLeader",
        "Engineer", "Grenadier", "Grenadier01", "Grenadier1", "HAT", "HeavyAntiTank",
        "LAT", "LAT1", "LightAntiTank", "LightAntiTank2", "Machinegunner", "Marksman",
        "Marskman", "Medic", "Medic01", "Medic1", "Pilot", "Pro", "Raider",
        "Raider01", "Rifle", "Rifleman", "Rifleman1", "Rifleman2", "Rifleman5",
        "Rifleman6", "Sapper", "SL", "SLCrewman", "Sniper", "SquadLeader", "SquadLeader01",
        "SquadLeader02", "SquadLeader1", "Squadleader2", "Weapon","AT","Light","Recruit",

        // --- Obscure / Technical / Numbers ---
        "AR", "Classic", "HNA", "Proj", "Proj2", "gun", "01", "02", "03", "03a", "2", "3","33rd","DMR","Pro","LDS"
    ];
    //  CSS for Hover Tooltip
    const style = document.createElement('style');
    style.innerHTML = `
        .weapon-grouped {
            position: relative; cursor: help; color: #4CAF50 !important;
            font-weight: bold; text-decoration: underline dotted #4CAF50;
        }
        .weapon-grouped:hover::after {
            content: attr(data-breakdown);
            position: absolute;
            left: 100%;
            margin-left: 20px;
            top: 0;

            background: #1a1a1a;
            color: #ececec;
            padding: 10px;
            border-radius: 6px;
            font-size: 13px;
            white-space: pre;
            z-index: 9999;
            border: 1px solid #4CAF50;
            font-family: monospace;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6);

            pointer-events: none;
        }
    `;
    document.head.appendChild(style);


    function cleanWeaponTable() {
        // Target the table specifically
        const tables = document.querySelectorAll('table.w3-table-all');

        tables.forEach(table => {
            const header = table.querySelector('thead')?.innerText || "";
            if (!header.includes('Weapon')) return;

            const tbody = table.querySelector('tbody');
            if (!tbody || tbody.rows.length === 0) return;

            if (table.hasAttribute('data-is-clean') && tbody.querySelector('.weapon-grouped, .weapon-single')) {
                return;
            }

            const totals = {};
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const suffixPattern = new RegExp(`\\s+(${termsToRemove.join('|')})$`, 'i');

            rows.forEach(row => {
                const cells = row.cells;
                if (cells.length < 3) return;

                const originalFullName = cells[0].innerText.trim();
                let name = originalFullName.replace(/Projectile\s+/gi, '').split(' [')[0];

                // --- STEP 1: KEYWORD CATEGORY CHECK ---
                let categorized = false;
                for (const entry of categoryMap) {
                    const includeRegex = new RegExp(`(${entry.keywords.join('|')})`, 'i');

                    if (includeRegex.test(name)) {
                        // Check for exclusions
                        if (entry.exclude) {
                            const excludeRegex = new RegExp(`(${entry.exclude.join('|')})`, 'i');
                            if (excludeRegex.test(name)) {
                                continue; // Skip this category and let it hit the next one
                            }
                        }

                        name = entry.groupName;
                        categorized = true;
                        break;
                    }
                }

                // --- STEP 2: NORMAL CLEANING (Only if not already categorized) ---
                if (!categorized) {
                    let prev;
                    do { prev = name; name = name.replace(suffixPattern, '').trim(); } while (name !== prev);
                    if (weaponGroupMap[name]) name = weaponGroupMap[name];
                }

                const wounds = parseInt(cells[1].innerText.replace(/,/g, '')) || 0;
                const damage = parseInt(cells[2].innerText.replace(/,/g, '')) || 0;

                if (!totals[name]) totals[name] = { wounds: 0, damage: 0, variants: [] };
                totals[name].wounds += wounds;
                totals[name].damage += damage;
                totals[name].variants.push({ full: originalFullName, w: wounds });
            });

            // Rebuild the rows into a string
            let newHtml = '';
            Object.entries(totals)
                .sort((a, b) => b[1].wounds - a[1].wounds)
                .forEach(([name, stats]) => {
                const breakdown = "Source Variants:\n" + stats.variants.map(v => `• ${v.full} (${v.w})`).join("\n");
                newHtml += `<tr><td class="weapon-grouped" data-breakdown="${breakdown}">${name}</td><td>${stats.wounds.toLocaleString()}</td><td>${stats.damage.toLocaleString()}</td></tr>`;
            });

            // Apply the new HTML and mark the table as Clean
            tbody.innerHTML = newHtml;
            table.setAttribute('data-is-clean', 'true');
        });
    }

    // Checking frequently to "catch" when the site refreshes the data
    setInterval(cleanWeaponTable, 1000);
})();
