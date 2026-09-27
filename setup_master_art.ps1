# PROJECT GUILDFALL - Sync Master Art Assets
$brainDir = "C:\Users\정현아\.gemini\antigravity-ide\brain\e315f9d0-c7f8-4c92-ae89-08a8677f50e8"
$targetDir = $PSScriptRoot

$dirs = @(
    "$targetDir\src\assets\scenes",
    "$targetDir\src\assets\heroes",
    "$targetDir\src\assets\enemies",
    "$targetDir\public\assets"
)

foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
}

$files = @(
    @{ Src = "$brainDir\camp_caravan_master_1790481940671.jpg"; Dest = "$targetDir\src\assets\scenes\camp_master.jpg" },
    @{ Src = "$brainDir\arena_battle_master_1790481960448.jpg"; Dest = "$targetDir\src\assets\scenes\arena_master.jpg" },
    @{ Src = "$brainDir\hero_vael_bust_1790482038319.jpg"; Dest = "$targetDir\src\assets\heroes\vael_master.jpg" },
    @{ Src = "$brainDir\hero_seris_bust_1790482138629.jpg"; Dest = "$targetDir\src\assets\heroes\seris_master.jpg" },
    @{ Src = "$brainDir\hero_mirel_bust_1790482154107.jpg"; Dest = "$targetDir\src\assets\heroes\mirel_master.jpg" },
    @{ Src = "$brainDir\boss_warden_bust_1790482169909.jpg"; Dest = "$targetDir\src\assets\enemies\boss_warden_master.jpg" },

    @{ Src = "$brainDir\camp_caravan_master_1790481940671.jpg"; Dest = "$targetDir\public\assets\camp_master.jpg" },
    @{ Src = "$brainDir\arena_battle_master_1790481960448.jpg"; Dest = "$targetDir\public\assets\arena_master.jpg" },
    @{ Src = "$brainDir\hero_vael_bust_1790482038319.jpg"; Dest = "$targetDir\public\assets\vael_master.jpg" },
    @{ Src = "$brainDir\hero_seris_bust_1790482138629.jpg"; Dest = "$targetDir\public\assets\seris_master.jpg" },
    @{ Src = "$brainDir\hero_mirel_bust_1790482154107.jpg"; Dest = "$targetDir\public\assets\mirel_master.jpg" },
    @{ Src = "$brainDir\boss_warden_bust_1790482169909.jpg"; Dest = "$targetDir\public\assets\boss_warden_master.jpg" }
)

foreach ($f in $files) {
    if (Test-Path $f.Src) {
        Copy-Item -Path $f.Src -Destination $f.Dest -Force
        Write-Host "Synced: $($f.Dest)" -ForegroundColor Green
    } else {
        Write-Warning "Source not found: $($f.Src)"
    }
}

Write-Host "`nAll 6 Master Art Assets successfully synced to project!" -ForegroundColor Cyan
