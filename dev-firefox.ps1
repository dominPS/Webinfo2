# Firefox-specific development server
# Uruchamia serwer deweloperski z wyłączonymi source mapami dla Firefox

Write-Host "Uruchamianie serwera deweloperskiego dla Firefox..." -ForegroundColor Green
Write-Host "Source mapy będą wyłączone aby uniknąć błędów w konsoli Firefox" -ForegroundColor Yellow

# Ustaw zmienną środowiskową dla Firefox
$env:BROWSER = "firefox"
$env:DISABLE_SOURCEMAPS = "true"

# Uruchom serwer deweloperski
npm run dev
