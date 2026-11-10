# AGENTS.md

Feste Regeln für alle KI-Agents (Claude, Codex, Copilot, …), die in diesem Repo arbeiten. Diese Datei ist die Hauptquelle; `CLAUDE.md` verweist nur hierher.

## Was das hier ist

Die Liste der Plugins im Plugin-Store von [dvoix](https://github.com/dvoi-dev/dvoix). Die App lädt `registry.json` vom Branch `main` und zeigt die Einträge unter **Einstellungen → Plugin-Store**. Hier liegt nur diese Liste und ihre Prüfung, kein Code von Plugins.

## Die Repos von dvoix

dvoix verteilt sich auf mehrere Repositories. Dieser Abschnitt steht gleich in der `AGENTS.md` jedes Repos. Wer ihn ändert, ändert ihn in allen.

| Repo | Wofür | Was dort hingehört |
| --- | --- | --- |
| [`dvoi-dev/dvoix`](https://github.com/dvoi-dev/dvoix) | die App | Rust-Kern, Tauri-Hülle, Svelte-Frontend, Core-Plugins, Plugin-API, Plugin-Store in der App, Entwickler-Anleitung für Store-Plugins (`docs/plugins/`), README für Entwickler |
| [`dvoi-dev/dvoix-website`](https://github.com/dvoi-dev/dvoix-website) | Produktseite und Doku | Produktseite unter `/`, Doku für Nutzer und Plugin-Entwickler unter `/docs`, Screenshots für die Seite, Docker-Image für den Server |
| [`dvoi-dev/dvoix-plugins`](https://github.com/dvoi-dev/dvoix-plugins) | Liste des Plugin-Stores | nur `registry.json` und ihre Prüfung (`scripts/validate.mjs`). Kein Plugin-Code |
| `dvoi-dev/dvoix-<name>` | je ein offizielles Store-Plugin | Code, `manifest.json`, Releases mit `manifest.json`, `main.js`, `styles.css` |

### Wo gehört was hin?

| Aufgabe | Repo |
| --- | --- |
| Grundfunktion für Notizen und Editor, die immer da ist (Explorer, Suche, Tags, Backlinks, Tabs, Ansichten, …) | `dvoix`, als Core-Feature unter `src/lib/features/` |
| Abschaltbare Funktion, die mit der App kommt (Aufgaben, Projekte, Graph, Git, …) | `dvoix`, als Core-Plugin unter `src/lib/plugins/core/` |
| Zusatzfunktion, die nicht jeder will (Kanban, Tracking, …) | eigenes Repo `dvoi-dev/dvoix-<name>` als Store-Plugin, dazu ein Eintrag in `dvoix-plugins` |
| Plugin-API erweitern (`PluginContext`, Berechtigungen) | `dvoix`, dazu `docs/plugins/README.md` dort und die Seite `plugin-api.md` der Website |
| Erklären, wie man dvoix bedient | `dvoix-website`, Seite in `src/content/docs/` |
| Plugin im Store anbieten oder entfernen | `dvoix-plugins`, `registry.json` |
| Fehler in einem Store-Plugin | im Repo des Plugins, nicht in der App |

### Was über Repo-Grenzen zusammenhängt

- **Format der Plugin-Liste:** festgelegt in `crates/dvoix-core/src/store.rs` (`parse_registry`) der App, Beispiel in `docs/plugins/registry.example.json`, geprüft von `scripts/validate.mjs` in `dvoix-plugins`. Ändert sich das Format, ändern sich alle drei Stellen.
- **Adresse der Plugin-Liste:** Die App liest `https://raw.githubusercontent.com/dvoi-dev/dvoix-plugins/main/registry.json`. Repo-Name, Branch `main` und Dateiname nie ändern, sonst findet keine installierte App mehr Plugins.
- **Offiziell:** `"channel": "official"` gilt nur für Repos von `dvoi-dev`. Die App und die Prüfung in `dvoix-plugins` setzen das beide durch.
- **Plugin-API:** `src/lib/plugins/store/api.ts` in der App, `docs/plugins/README.md` in der App und `src/content/docs/plugin-api.md` auf der Website beschreiben dieselbe API und müssen zusammenpassen.
- **Funktionen der App:** Was die Website-Doku über die App sagt, muss zum Code in `dvoix` passen. Ändert sich die App für Nutzer sichtbar, wird die Doku nachgezogen.

### Änderungen über mehrere Repos

- Ein PR pro Repo. Die PRs verlinken sich gegenseitig in der Beschreibung.
- Reihenfolge beim Mergen: zuerst die App (`dvoix`), dann `dvoix-plugins` und `dvoix-website`. Eine Doku oder Plugin-Liste darf nichts versprechen, was die App auf `main` noch nicht kann.
- Für alle Repos gilt gleich: Code, Kommentare und Commit-Messages auf Englisch, alles für Nutzer auf Deutsch; immer die neuesten stabilen Versionen von Node.js, Abhängigkeiten und GitHub Actions; nie direkt auf `main` pushen.

## Grundregeln

1. **Nur die Liste.** In dieses Repo kommen `registry.json`, die Prüfung und Doku dazu. Plugin-Code, Releases und Issues zu einem Plugin gehören in das Repo des Plugins.
2. **Die App entscheidet über das Format.** Maßgeblich ist `parse_registry` in `crates/dvoix-core/src/store.rs` im App-Repo. `scripts/validate.mjs` prüft dieselben Regeln, nur strenger: Was die App still überspringt, lässt hier die CI scheitern. Ändert sich das eine, wird das andere im selben Zug angepasst.
3. **Die Adresse bleibt fest.** Repo-Name, Branch `main` und Dateiname `registry.json` ändern sich nicht. Die App wertet `"version"` heute nicht aus: Ein inkompatibles Format geht erst live, wenn eine App-Version es lesen kann, und alte Apps dürfen daran nicht kaputtgehen.
4. **Offiziell heißt `dvoi-dev`.** `"channel": "official"` nur für Repos von `dvoi-dev`. Alles andere ist `community`.
5. **Eine `id` nie ändern.** Sie ist die `id` aus dem `manifest.json` des Plugins und der Ordnername in `<vault>/.dvoix/plugins/<id>/`. Umbenennen heißt für Nutzer: Plugin weg, Einstellungen weg.
6. **Immer die neuesten Versionen.** Node.js (aktuelle Version, nicht eine ältere LTS) in `.nvmrc` und alle GitHub Actions auf der jeweils neuesten stabilen Version. Ältere Versionen nur mit Begründung im PR.

## Aufbau

```
registry.json                  die Plugin-Liste, die die App lädt
scripts/validate.mjs           prüft registry.json wie die App (ohne Abhängigkeiten)
.github/workflows/validate.yml führt die Prüfung bei jedem PR und auf main aus
.nvmrc                         Node-Version für CI und lokal
README.md                      Anleitung für Plugin-Autoren: wie man ein Plugin einträgt
```

## Einträge in `registry.json`

```json
{
  "id": "word-count",
  "name": "Wortzähler",
  "author": "dein-name",
  "description": "Ein Satz, was das Plugin macht.",
  "repo": "dein-name/dvoix-word-count",
  "channel": "community"
}
```

- Alle sechs Felder sind Pflicht und nicht leer.
- `id`: klein, `a-z0-9-`, höchstens 64 Zeichen, nur einmal in der Liste, gleich der `id` im `manifest.json`.
- `name` und `description` auf Deutsch, die Beschreibung ist ein Satz.
- `repo`: `owner/name` auf GitHub. Das Repo muss ein Release haben, dessen Tag die Version aus `manifest.json` ohne `v` ist, mit `manifest.json`, `main.js` und optional `styles.css` als Dateien.
- Neue Einträge ans Ende der Liste. Keine Versionen eintragen: Die App findet neue Releases selbst.
- Ein Plugin entfernen nur mit Grund im PR (kaputt, verlassen, schädlich). Installierte Kopien bei Nutzern bleiben davon unberührt.

## Einen Eintrag prüfen

Vor dem Merge eines neuen Eintrags:

- Das Repo existiert, ist öffentlich und hat ein passendes Release mit `manifest.json` und `main.js`.
- `id` im Eintrag und im `manifest.json` stimmen überein.
- Die Berechtigungen im `manifest.json` (`vault:read`, `vault:write`, `editor`) passen zu dem, was das Plugin laut Beschreibung tut.
- Bei Community-Plugins `main.js` des Releases kurz durchsehen: kein Netzwerkzugriff ohne erkennbaren Grund, kein verschleierter Code. Die Berechtigungen sind keine Sandbox, diese Durchsicht ist der einzige Schutz vor der Aufnahme.

## Befehle

```sh
node scripts/validate.mjs   # prüft registry.json, so wie die CI
```

Vor jedem Commit muss die Prüfung grün sein. Es gibt keine npm-Abhängigkeiten und kein `npm install`. Wenn die Prüfung lokal nicht laufen kann, sag das ausdrücklich, statt Erfolg zu behaupten.

## Konventionen

- **Sprache:** Code, Bezeichner, Kommentare und Commit-Messages auf Englisch. Alles, was Nutzer oder Plugin-Autoren sehen (README, `name`, `description`, Fehlermeldungen in der Doku), auf Deutsch. Die Meldungen von `validate.mjs` sind für Entwickler und bleiben Englisch.
- **Kommentare** erklären das Warum, nicht das Was. Jede Datei beginnt mit einem kurzen Kommentar, wofür sie da ist.
- **Keine Abhängigkeiten.** `validate.mjs` läuft mit reinem Node.js. Soll das so bleiben, damit die CI ohne `npm ci` auskommt.
- **`registry.json`** mit zwei Leerzeichen eingerückt, ein Objekt pro Eintrag, Schlüssel in der Reihenfolge `id`, `name`, `author`, `description`, `repo`, `channel`.

## Arbeitsablauf

- Nie direkt auf `main` pushen.
- Commit-Messages auf Englisch, im Imperativ, eine Zeile Zusammenfassung (z. B. „Add kanban plugin to the registry“).
- PR-Beschreibung: welches Plugin, Link zum Repo und zum Release, wie geprüft.
- README und diese Regeln aktualisieren, wenn sich Format, Prüfung oder Ablauf ändern.
