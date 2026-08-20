$f = 'd:\www\Test\sms_backend\resources\js\routes\profile\index.ts'
$c = [System.IO.File]::ReadAllText($f, [System.Text.UTF8Encoding]::new($false))

# Replace Settings\ProfileController::edit block (second edit block)
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\s*\n)export const edit =', "`$1export const settingsEdit ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\s*\n)edit\.definition =', "`$1settingsEdit.definition ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\s*\n)edit\.url =', "`$1settingsEdit.url ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\s*\n)edit\.get =', "`$1settingsEdit.get ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\s*\n)edit\.head =', "`$1settingsEdit.head ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\s*\n    )const editForm =', "`$1const settingsEditForm ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\s*\n        )editForm\.get =', "`$1settingsEditForm.get ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::edit.*?\* @route .*?\*/\s*\n        )editForm\.head =', "`$1settingsEditForm.head ="
$c = $c -replace '(?m)^    edit\.form = editForm$', '    settingsEdit.form = settingsEditForm'

# Replace Settings\ProfileController::update block (third update block)
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::update.*?\* @route .*?\*/\s*\n)export const update =', "`$1export const settingsUpdate ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::update.*?\* @route .*?\*/\s*\n)update\.definition =', "`$1settingsUpdate.definition ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::update.*?\* @route .*?\*/\s*\n)update\.url =', "`$1settingsUpdate.url ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::update.*?\* @route .*?\*/\s*\n)update\.patch =', "`$1settingsUpdate.patch ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::update.*?\* @route .*?\*/\s*\n    )const updateForm =', "`$1const settingsUpdateForm ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Settings\\ProfileController::update.*?\* @route .*?\*/\s*\n        )updateForm\.patch =', "`$1settingsUpdateForm.patch ="
$c = $c -replace '(?m)^    update\.form = updateForm$', '    settingsUpdate.form = settingsUpdateForm'

# Replace Web\Frontend\User\UserProfileController::update /user/password block (second update block)
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Web\\Frontend\\User\\UserProfileController::update.*?/user/password.*?\* @route .*?\*/\s*\n)export const update =', "`$1export const passwordUpdate ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Web\\Frontend\\User\\UserProfileController::update.*?/user/password.*?\* @route .*?\*/\s*\n)update\.definition =', "`$1passwordUpdate.definition ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Web\\Frontend\\User\\UserProfileController::update.*?/user/password.*?\* @route .*?\*/\s*\n)update\.url =', "`$1passwordUpdate.url ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Web\\Frontend\\User\\UserProfileController::update.*?/user/password.*?\* @route .*?\*/\s*\n)update\.post =', "`$1passwordUpdate.post ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Web\\Frontend\\User\\UserProfileController::update.*?/user/password.*?\* @route .*?\*/\s*\n    )const updateForm =', "`$1const passwordUpdateForm ="
$c = $c -replace '(?s)(\* @see \\App\\Http\\Controllers\\Web\\Frontend\\User\\UserProfileController::update.*?/user/password.*?\* @route .*?\*/\s*\n        )updateForm\.post =', "`$1passwordUpdateForm.post ="
$c = $c -replace '(?m)^    update\.form = updateForm$', '    passwordUpdate.form = passwordUpdateForm'

# Fix default export
$c = $c -replace "edit: Object.assign\(edit, edit\)", "edit: Object.assign(edit, edit),`n    settingsEdit: Object.assign(settingsEdit, settingsEdit)"
$c = $c -replace "update: Object.assign\(update, update\)", "update: Object.assign(update, update),`n    settingsUpdate: Object.assign(settingsUpdate, settingsUpdate),`n    passwordUpdate: Object.assign(passwordUpdate, passwordUpdate)"

[System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done"