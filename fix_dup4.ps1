$f = 'd:\www\Test\sms_backend\resources\js\routes\profile\index.ts'
$c = [System.IO.File]::ReadAllText($f, [System.Text.UTF8Encoding]::new($false))

# Ensure LF
$c = $c -replace "`r`n", "`n"

# Settings edit block: edit.definition -> settingsEdit.definition
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\n)edit\.definition =', '$1settingsEdit.definition ='

# Settings edit block: return edit.definition.url -> return settingsEdit.definition.url
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\nsettingsEdit\.url =.*?\n)\s*return edit\.definition\.url \+', '$1    return settingsEdit.definition.url +'

# Password block: export const update -> export const passwordUpdate
$c = $c -replace '(?s)(/user/password.*?\* @route .*?\*/\n)export const update =', '$1export const passwordUpdate ='

# Password block: update.definition -> passwordUpdate.definition
$c = $c -replace '(?s)(/user/password.*?\* @route .*?\*/\n)update\.definition =', '$1passwordUpdate.definition ='

# Password block: return update.definition.url -> return passwordUpdate.definition.url
$c = $c -replace '(?s)(/user/password.*?\* @route .*?\*/\npasswordUpdate\.url =.*?\n)\s*return update\.definition\.url \+', '$1    return passwordUpdate.definition.url +'

# Settings update: url: passwordUpdate.url -> url: settingsUpdate.url
$c = $c -replace '(?s)(Settings\\ProfileController::update.*?\* @route .*?\*/\nexport const settingsUpdate =.*?\n)\s*url: passwordUpdate\.url\(', '$1    url: settingsUpdate.url('

# Settings update: update.definition -> settingsUpdate.definition
$c = $c -replace '(?s)(Settings\\ProfileController::update.*?\* @route .*?\*/\n)update\.definition =', '$1settingsUpdate.definition ='

# Settings update: return update.definition.url -> return settingsUpdate.definition.url
$c = $c -replace '(?s)(Settings\\ProfileController::update.*?\* @route .*?\*/\nsettingsUpdate\.url =.*?\n)\s*return update\.definition\.url \+', '$1    return settingsUpdate.definition.url +'

[System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
Write-Host 'Done'