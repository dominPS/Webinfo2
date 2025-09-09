# Firefox-specific development server with HTTPS
# Uruchamia serwer deweloperski z HTTPS dla Firefox

Write-Host "Uruchamianie bezpiecznego serwera deweloperskiego dla Firefox..." -ForegroundColor Green
Write-Host "Używane będzie HTTPS z samopodpisanym certyfikatem" -ForegroundColor Yellow
Write-Host "W Firefox może być potrzebne zaakceptowanie certyfikatu" -ForegroundColor Yellow

# Wyczyść cache przed uruchomieniem
if (Test-Path "node_modules\.vite") {
    Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Usunięto cache Vite" -ForegroundColor Yellow
}

# Ustaw zmienne środowiskowe dla Firefox
$env:BROWSER = "firefox"
$env:DISABLE_SOURCEMAPS = "true"
$env:HTTPS = "true"

# Uruchom serwer deweloperski
Write-Host "Serwer będzie dostępny na https://localhost:5173/" -ForegroundColor Cyan
npm run dev:firefox
