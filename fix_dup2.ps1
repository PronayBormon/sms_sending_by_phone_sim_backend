$f = 'd:\www\Test\sms_backend\resources\js\routes\profile\index.ts'
$c = [System.IO.File]::ReadAllText($f, [System.Text.UTF8Encoding]::new($false))

# ====== Settings edit block (after UserProfileController::edit block) ======
# Fix: export const settingsEdit ... but uses edit.url inside
# Replace the internal references: 
# Within the Settings::ProfileController::edit region, change:
#   url: edit.url(options) -> url: settingsEdit.url(options)
#   edit.definition -> settingsEdit.definition
#   edit.url = -> settingsEdit.url =
#   edit.get = -> settingsEdit.get =
#   edit.head = -> settingsEdit.head =
#   action: edit.url -> action: settingsEdit.url
#   edit.form = editForm -> settingsEdit.form = settingsEditForm

# First, isolate the Settings::ProfileController::edit block and fix its internals
# Use string splitting to be precise
$parts = $c -split '(?=\r?\n/\*\*\r?\n\* @see \\App\\Http\\Controllers)', 0, 'RegexMatch'
# But easier: just do targeted replacements that only match in the Settings::ProfileController section

# Replace the pair "edit.definition" that appears right after "Settings::ProfileController::edit\n...\n*/\n"
$c = $c -replace '(?s)(Settings\\ProfileController::edit.*?\* @route .*?\*/\r?\n)edit\.definition ', "`$1settingsEdit.definition "

# Fix: "url: edit.url" within Settings edit queries
$c = $c -replace '(?s)(?<=Settings\\ProfileController::edit.*?url: )edit\.url\(', 'settingsEdit.url('

# Fix: "edit.url = (options" within Settings section
$c = $c -replace '(?s)(Settings\\ProfileController::edit.*?\* @route .*?\*/\r?\n)edit\.url = ', "`$1settingsEdit.url = "

# Fix: "edit.get = (options" within Settings section
$c = $c -replace '(?s)(Settings\\ProfileController::edit.*?\* @route .*?\*/\r?\n)edit\.get = ', "`$1settingsEdit.get = "

# Fix: "edit.head = (options" within Settings section
$c = $c -replace '(?s)(Settings\\ProfileController::edit.*?\* @route .*?\*/\r?\n)edit\.head = ', "`$1settingsEdit.head = "

# Fix: "action: edit.url" within Settings section (for form)
$c = $c -replace '(?s)(Settings\\ProfileController::edit.*?action: )edit\.url\(', "`$1settingsEdit.url("

# Fix: "edit.form = editForm" within Settings section
$c = $c -replace '(?s)(Settings\\ProfileController::edit[\s\S]*?)\r?\n    edit\.form = editForm', "`$1`r`n    settingsEdit.form = settingsEditForm"

# ====== password update block ======
# Fix: "url: update.url" inside passwordUpdate
$c = $c -replace '(?s)(/user/password[\s\S]*?url: )update\.url\(', "`$1passwordUpdate.url("

# Fix: "update.definition =" inside password block
$c = $c -replace '(?s)(/user/password[\s\S]*?\* @route .*?\*/\r?\n)update\.definition = ', "`$1passwordUpdate.definition = "

# Fix: "update.url = (options" inside password block
$c = $c -replace '(?s)(/user/password.*?\* @route .*?\*/\r?\n)update\.url = ', "`$1passwordUpdate.url = "

# Fix: "update.post = (options" inside password block
$c = $c -replace '(?s)(/user/password.*?\* @route .*?\*/\r?\n)update\.post = ', "`$1passwordUpdate.post = "

# Fix: "action: update.url" inside password block form
$c = $c -replace '(?s)(/user/password.*?action: )update\.url\(', "`$1passwordUpdate.url("

# Fix: "update.form = updateForm" inside password block
$c = $c -replace '(?s)(/user/password[\s\S]*?)\r?\n    update\.form = updateForm', "`$1`r`n    passwordUpdate.form = passwordUpdateForm"

# ====== Settings update block ======
# Fix: "url: update.url" inside settingsUpdate
$c = $c -replace '(?s)(Settings\\ProfileController::update[\s\S]*?url: )update\.url\(', "`$1settingsUpdate.url("

# Fix: "update.definition =" inside settings update block
$c = $c -replace '(?s)(Settings\\ProfileController::update[\s\S]*?\* @route .*?\*/\r?\n)update\.definition = ', "`$1settingsUpdate.definition = "

# Fix: "update.url = (options" inside settings update block
$c = $c -replace '(?s)(Settings\\ProfileController::update[\s\S]*?\* @route .*?\*/\r?\n)update\.url = ', "`$1settingsUpdate.url = "

# Fix: "update.patch = (options" inside settings update block
$c = $c -replace '(?s)(Settings\\ProfileController::update[\s\S]*?\* @route .*?\*/\r?\n)update\.patch = ', "`$1settingsUpdate.patch = "

# Fix: "action: update.url" inside settings update block form
$c = $c -replace '(?s)(Settings\\ProfileController::update[\s\S]*?action: )update\.url\(', "`$1settingsUpdate.url("

# Fix: "update.form = updateForm" inside settings update block
$c = $c -replace '(?s)(Settings\\ProfileController::update[\s\S]*?)\r?\n    update\.form = updateForm', "`$1`r`n    settingsUpdate.form = settingsUpdateForm"

[System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done"