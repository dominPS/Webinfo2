# Sprawdzenie stanu bazy danych OcenaPlus
Write-Host "=== Sprawdzanie bazy danych OcenaPlus ===" -ForegroundColor Green

try {
    # Sprawdzenie planów IDP
    $plansCount = sqlcmd -S "(localdb)\MSSQLLocalDB" -d "OcenaPlusDb" -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM IDPPlans" -h -1
    Write-Host "Liczba planów IDP: $plansCount" -ForegroundColor Yellow

    # Sprawdzenie celów IDP
    $goalsCount = sqlcmd -S "(localdb)\MSSQLLocalDB" -d "OcenaPlusDb" -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM IDPGoals" -h -1
    Write-Host "Liczba celów IDP: $goalsCount" -ForegroundColor Yellow

    # Sprawdzenie użytkowników
    $usersCount = sqlcmd -S "(localdb)\MSSQLLocalDB" -d "OcenaPlusDb" -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM Users" -h -1
    Write-Host "Liczba użytkowników: $usersCount" -ForegroundColor Yellow

    # Szczegóły planów IDP
    Write-Host "`n=== Szczegóły planów IDP ===" -ForegroundColor Green
    sqlcmd -S "(localdb)\MSSQLLocalDB" -d "OcenaPlusDb" -Q "SELECT p.Id, p.Year, p.Status, u.FirstName + ' ' + u.LastName as Employee, p.CreatedAt FROM IDPPlans p JOIN Users u ON p.EmployeeId = u.Id ORDER BY p.CreatedAt DESC"

    # Szczegóły celów IDP
    Write-Host "`n=== Szczegóły celów IDP ===" -ForegroundColor Green
    sqlcmd -S "(localdb)\MSSQLLocalDB" -d "OcenaPlusDb" -Q "SELECT g.Id, g.IDPPlanId, g.Title, g.Category, g.Status FROM IDPGoals g ORDER BY g.CreatedAt DESC"

} catch {
    Write-Host "Błąd podczas sprawdzania bazy: $_" -ForegroundColor Red
}

Write-Host "`n=== Koniec sprawdzania ===" -ForegroundColor Green
