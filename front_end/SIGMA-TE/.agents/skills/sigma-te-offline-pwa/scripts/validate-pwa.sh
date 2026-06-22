#!/usr/bin/env bash
set -euo pipefail

# SIGMA-TE - PWA validation script
# Purpose:
# Validate the minimum structure required for the SIGMA-TE offline-first web app.

ROOT_DIR="${1:-$(pwd)}"

echo "SIGMA-TE | Validating PWA structure..."
echo "Project root: ${ROOT_DIR}"
echo

missing=0

check_file() {
  local path="$1"
  local label="$2"

  if [[ -f "${ROOT_DIR}/${path}" ]]; then
    echo "[OK] ${label}: ${path}"
  else
    echo "[MISSING] ${label}: ${path}"
    missing=1
  fi
}

check_dir() {
  local path="$1"
  local label="$2"

  if [[ -d "${ROOT_DIR}/${path}" ]]; then
    echo "[OK] ${label}: ${path}"
  else
    echo "[MISSING] ${label}: ${path}"
    missing=1
  fi
}

# Required or strongly expected files for a PWA-oriented frontend
check_file "index.html" "Main entry"
check_file "manifest.webmanifest" "Web manifest"
check_file "service-worker.js" "Service worker"

# Common frontend structure
check_dir "src" "Source folder"
check_dir "public" "Public assets folder"
check_dir "assets" "Assets folder"

# Optional but useful files
if [[ -f "${ROOT_DIR}/package.json" ]]; then
  echo "[OK] package.json found"
else
  echo "[WARN] package.json not found"
fi

if [[ -f "${ROOT_DIR}/vite.config.js" || -f "${ROOT_DIR}/vite.config.ts" ]]; then
  echo "[OK] Vite config found"
else
  echo "[INFO] Vite config not found"
fi

echo
if [[ "${missing}" -eq 0 ]]; then
  echo "Validation result: PWA structure looks acceptable."
  exit 0
else
  echo "Validation result: some required PWA files or folders are missing."
  exit 1
fi