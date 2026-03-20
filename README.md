# Weaponlist cleaner for MySquadStats

A Tampermonkey userscript for [MySquadStats](https://mysquadstats.com) that cleans up massive weapon lists by aggregating variants (scopes, camos, kits) into unified, easy-to-read entries.

---

## 🚀 Key Features

* **Smart Aggregation:** Automatically merges weapon variants (e.g., `M4A1 M150 Foregrip`, `M4 Classic`, and `M4 Carryhandle 2Mags`) into a single **M4** entry.
* **Hover Breakdown:** Hover over any aggregated (green) weapon name to see exactly which variants made up that total and how many wounds each contributed.
* **Custom Categories:** Groups specific game actions like **Vehicle Destructions**, **Tandem Hits**, and **Frag Grenades** into logical sections.
* **Smart Exclusions:** Prevents "Frag Projectiles" (like Tank shells) from being mixed into "Frag Grenades."
* **Persistent UI:** Built to handle the site's dynamic loading; the script stays active even when switching tabs or loading new player data.

---

## 🛠️ Installation

1.  Install the **Tampermonkey** extension for your browser:
    * [Chrome / Brave / Edge](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    * [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
2.  [**Click here to install the script**](https://github.com/ReBootYourMind/Weaponlist-cleaner-for-MySquadStats/raw/refs/heads/main/Weaponlist-cleaner-for-MySquadStats.user.js) .
3.  Click **Install** when the Tampermonkey tab opens.
4.  Refresh your MySquadStats page and navigate to your weapon stats.
5.  If the filtering doesn't work make sure developer mode is enabled for extensions and user scripts are allowed for that extesion (Chrome)

---

## 📖 How to Customize

The script is designed to be easily expandable. Open the script in your Tampermonkey Dashboard to make changes:

### 1. Adding New Suffixes
If you see a new scope or tag (e.g., `M68` or `Desert`) appearing in your list, simply add it to the `termsToRemove` array:
```javascript
const termsToRemove = [
    "ACOG", "M150", "Desert", "NewScopeTag"
];
```

### 2. Creating Custom Groups
You can group entirely different strings into one category using the categoryMap. For example, to group all "Burning" states:

```JavaScript
{ 
    keywords: ["Burning", "Burn", "Burned"], 
    groupName: "Vehicle Burn-offs" 
}
```
### 3. Using Exclusions
Use the exclude feature to prevent items from being grouped incorrectly (like separating Hand Grenades from Heavy Projectiles):

```JavaScript
{ 
    keywords: ["Frag"], 
    groupName: "Frag Grenades", 
    exclude: ["Projectile", "125mm", "RPG"] // These won't be called "Grenades"
}
```
### ⚖️ License
Distributed under the MIT License. See LICENSE for more information.

### 🤝 Contributing
Found a weapon variant or faction tag the script missed?

1. Open an Issue.
2. Submit a Pull Request with the updated termsToRemove list.
