# dvoix-plugins

Die Liste der Plugins im Plugin-Store von [dvoix](https://github.com/DamavoiZ/dvoix). Die App liest [`registry.json`](registry.json) aus dem Branch `main` und zeigt die Einträge unter **Einstellungen → Plugin-Store**.

Hier liegt nur die Liste. Der Code jedes Plugins liegt in seinem eigenen Repository, die App lädt ihn aus dessen GitHub-Releases.

## Offiziell und Community

- **Offizielle Plugins** pflegt dvoix selbst. Sie liegen in Repositories von `DamavoiZ` und lassen sich in der App immer installieren.
- **Community-Plugins** schreiben andere. Nutzer müssen sie in der App erst mit dem Schalter „Community-Plugins erlauben“ freigeben und sehen vorher eine Warnung.

`"channel": "official"` gilt nur für Repositories von `DamavoiZ`. Die App stuft alles andere auf Community herab, die Prüfung hier in der CI lehnt es ab.

## Ein Plugin eintragen

1. Plugin schreiben. Die Anleitung mit Beispiel steht im App-Repo unter [`docs/plugins/`](https://github.com/DamavoiZ/dvoix/tree/main/docs/plugins).
2. Ein Release im Plugin-Repository anlegen. Der Tag ist die Version aus `manifest.json` ohne `v` (z. B. `1.0.0`), als Dateien kommen `manifest.json`, `main.js` und optional `styles.css` dazu.
3. Hier einen Pull Request aufmachen, der `registry.json` um einen Eintrag ergänzt:

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

| Feld | Bedeutung |
| --- | --- |
| `id` | genau die `id` aus `manifest.json`: klein, `a-z0-9-`, nie ändern |
| `name` | Anzeigename im Store |
| `author` | wer das Plugin pflegt |
| `description` | ein Satz, auf Deutsch |
| `repo` | GitHub-Repository `owner/name` mit den Releases |
| `channel` | `official` (nur `DamavoiZ`) oder `community` |

Updates brauchen keinen neuen Pull Request: Die App findet neue Releases selbst.

## Prüfen

```sh
node scripts/validate.mjs
```

Dieselbe Prüfung läuft in der CI bei jedem Pull Request.
