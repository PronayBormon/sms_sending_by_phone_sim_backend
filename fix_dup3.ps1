$f = 'd:\www\Test\sms_backend\resources\js\routes\profile\index.ts'
$c = [System.IO.File]::ReadAllText($f, [System.Text.UTF8Encoding]::new($false))

# Ensure consistent LF throughout
$c = $c -replace "`r`n", "`n"

# Fix 1: edit.definition -> settingsEdit.definition in Settings block
# Only after Settings\\ProfileController::edit (not UserProfileController::edit)
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\n)edit\.definition =', "`$1settingsEdit.definition ="

# Fix 2: edit.definition.url -> settingsEdit.definition.url in Settings block
$c = $c -replace '(?s)(Settings\\ProfileController::edit.*?\* @route .*?\*/\nsettingsEdit\.url =.*?\n)\s*return edit\.definition\.url \+', "`$1    return settingsEdit.definition.url +"

# Fix 3: password block: export const update -> export const passwordUpdate
$c = $c -replace '(?s)(/user/password.*?\* @route .*?\*/\n)export const update =', "`$1export const passwordUpdate ="

# Fix 4: password block: update.definition = -> passwordUpdate.definition =
$c = $c -replace '(?s)(/user/password.*?\* @route .*?\*/\n)update\.definition =', "`$1passwordUpdate.definition ="

# Fix 5: password block: return update.definition.url -> return passwordUpdate.definition.url
$c = $c -replace '(?s)(/user/password.*?\* @route .*?\*/\npasswordUpdate\.url =.*?\n)\s*return update\.definition\.url \+', "`$1    return passwordUpdate.definition.url +"

# Fix 6: Settings update block: url: passwordUpdate.url -> url: settingsUpdate.url
$c = $c -replace '(?s)(Settings\\ProfileController::update[\s\S]*?\* @route .*?\*/\nexport const settingsUpdate =.*?\n)\s*url: passwordUpdate\.url\(', "`$1    url: settingsUpdate.url("

# Fix 7: Settings update block: update.definition = -> settingsUpdate.definition =
$c = $c -replace '(?s)(Settings\\ProfileController::update[\s\S]*?\* @route .*?\*/\n)update\.definition =', "`$1settingsUpdate.definition ="

# Fix 8: Settings update block: return update.definition.url -> return settingsUpdate.definition.url
$c = $c -replace '(?s)(Settings\\ProfileController::update[\s\S]*?\* @route .*?\*/\nsettingsUpdate\.url =.*?\n)\s*return update\.definition\.url \+', "`$1    return settingsUpdate.definition.url +"

[System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done"