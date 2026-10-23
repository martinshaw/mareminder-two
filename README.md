# Mareminder Two

A lean rewrite of [Mareminder](https://github.com/martinshaw/mareminder): a macOS-friendly Electron app that watches for mouse idle time, then surfaces a customisable reminder.

## Features

- Idle mouse detection (default: 3 minutes still)
- Editable rich-text reminder
- Persist timeout, message, optional shell command, and optional JS snippet
- Hides from the Dock; dismisses on blur

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Package a local macOS build:

```bash
npm run dist
```

## Release

Push a version tag. The release workflow builds an unsigned macOS app and publishes it to GitHub Releases.

```bash
git tag v0.2.0
git push origin v0.2.0
```
