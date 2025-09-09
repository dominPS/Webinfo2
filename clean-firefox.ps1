# Skrypt do czyszczenia wszystkich source map i cache dla Firefox

Write-Host "Czyszczenie cache i source map dla Firefox..." -ForegroundColor Green

# Usuń wszystkie pliki .map jeśli istnieją
Get-ChildItem -Path . -Filter "*.map" -Recurse | Remove-Item -Force -ErrorAction SilentlyContinue

# Usuń cache Vite
if (Test-Path "node_modules\.vite") {
    Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Usunięto cache Vite" -ForegroundColor Yellow
}

# Usuń cache build
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Usunięto katalog dist" -ForegroundColor Yellow
}

# Wyczyść npm cache
npm cache clean --force

Write-Host "Czyszczenie zakończone. Uruchamianie serwera..." -ForegroundColor Green

# Ustaw zmienne dla Firefox
$env:BROWSER = "firefox"
$env:DISABLE_SOURCEMAPS = "true"

# Uruchom serwer
npm run dev
