# Automated GitHub Repository Creator & Uploader for Zain Qazi
# Run this script in PowerShell to publish all projects to your public GitHub account in 1 click!

$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:Path

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "    ZAIN QAZI - AUTOMATIC GITHUB UPLOADER           " -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Cyan

# Check GitHub CLI Authentication
Write-Host "`n[1/3] Verifying GitHub authentication..." -ForegroundColor Cyan
$authCheck = & gh auth status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n⚠️ You are not logged into GitHub yet." -ForegroundColor Yellow
    Write-Host "Opening GitHub in your browser for 1-click authorization..." -ForegroundColor Green
    & gh auth login -w -p https -s repo
}

$username = (& gh api user --jq .login)
if (-not $username) {
    Write-Host "❌ Failed to retrieve GitHub username. Please run 'gh auth login' manually." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Logged in as: $username" -ForegroundColor Green

# Configure Git user identity locally
& git config --global user.name "Zain Qazi"
& git config --global user.email "qazizain253@gmail.com"

# Project definitions: Folder path -> Repo Name -> Description
$projects = @(
    @{
        Path = "D:\Desktop\zain-portfolio\demos\marco"
        Repo = "marco-web"
        Desc = "Structured static restaurant landing page with clean layout and styling built with HTML5 and CSS3."
    },
    @{
        Path = "D:\Desktop\zain-portfolio\demos\maison-doree"
        Repo = "moision-doree-web"
        Desc = "Responsive luxury jewelry website built with Bootstrap 5 grid system, carousel, and UI components."
    },
    @{
        Path = "D:\Desktop\zain-portfolio\demos\ios-calculator"
        Repo = "ios-calculator"
        Desc = "Browser-based calculator reproducing Apple iOS dark UI with JavaScript arithmetic engine."
    },
    @{
        Path = "D:\Desktop\zain-portfolio\demos\bank-system"
        Repo = "bank-management-system"
        Desc = "Console and web-based banking simulation application handling deposits, withdrawals, and balance tracking."
    },
    @{
        Path = "D:\Desktop\zain-portfolio\demos\admin-panel"
        Repo = "admin-panel"
        Desc = "adminZQ Restaurant Suite - Comprehensive restaurant management suite with Python (Flask) backend integration, Bootstrap 5 and jQuery."
    },
    @{
        Path = "D:\Desktop\zain-portfolio"
        Repo = "zain-qazi-portfolio"
        Desc = "Personal portfolio website of Zain Qazi - Front-end Developer with Job Matcher and Live Demos."
    }
)

# Update Portfolio links to point to the actual GitHub username BEFORE committing
Write-Host "`nUpdating portfolio code links with GitHub username: $username..." -ForegroundColor Cyan
$indexPath = "D:\Desktop\zain-portfolio\index.html"
if (Test-Path $indexPath) {
    $content = Get-Content $indexPath -Raw
    $content = $content -replace "https://github.com/qazizain253/", "https://github.com/$username/"
    $content = $content -replace "https://github.com/zainqazi/", "https://github.com/$username/"
    Set-Content -Path $indexPath -Value $content -Encoding utf8
    Write-Host "✅ Portfolio links updated to https://github.com/$username/..." -ForegroundColor Green
}

Write-Host "`n[2/3] Uploading projects to public GitHub repositories..." -ForegroundColor Cyan

foreach ($p in $projects) {
    Write-Host "`n-----------------------------------------------------" -ForegroundColor Gray
    Write-Host "Processing: $($p.Repo)..." -ForegroundColor Yellow

    Set-Location $p.Path

    if (-not (Test-Path ".git")) {
        & git init -b main
    }

    # Add .gitignore if not exists
    if (-not (Test-Path ".gitignore")) {
        "node_modules/`n.DS_Store`nThumbs.db" | Out-File -FilePath ".gitignore" -Encoding utf8
    }

    & git add -A
    & git commit -m "Initial commit - $($p.Repo) by Zain Qazi" --allow-empty

    # Create repo on GitHub if not existing, or push
    $repoExists = & gh repo view "$username/$($p.Repo)" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating public repo '$($p.Repo)' on GitHub..." -ForegroundColor Cyan
        & gh repo create "$($p.Repo)" --public --description "$($p.Desc)" --source=. --remote=origin --push
    } else {
        Write-Host "Repo already exists on GitHub, pushing latest commits..." -ForegroundColor Cyan
        & git push -u origin main --force
    }

    Write-Host "✅ Uploaded: https://github.com/$username/$($p.Repo)" -ForegroundColor Green
}

# Update Portfolio links to point to the actual GitHub username
Write-Host "`n[3/3] Updating portfolio code links with GitHub username: $username..." -ForegroundColor Cyan
Set-Location "D:\Desktop\zain-portfolio"

$indexPath = "D:\Desktop\zain-portfolio\index.html"
if (Test-Path $indexPath) {
    $content = Get-Content $indexPath -Raw
    $content = $content -replace "https://github.com/qazizain253/", "https://github.com/$username/"
    $content = $content -replace "https://github.com/zainqazi/", "https://github.com/$username/"
    Set-Content -Path $indexPath -Value $content -Encoding utf8
    Write-Host "✅ Portfolio links updated to https://github.com/$username/..." -ForegroundColor Green
}

$resumePath = "D:\Desktop\zain-portfolio\resume.html"
if (Test-Path $resumePath) {
    $rContent = Get-Content $resumePath -Raw
    $rContent = $rContent -replace "https://github.com/qazizain253/", "https://github.com/$username/"
    Set-Content -Path $resumePath -Value $rContent -Encoding utf8
    Write-Host "✅ Resume links updated." -ForegroundColor Green
}

Write-Host "`n🎉 ALL PROJECTS UPLOADED TO GITHUB SUCCESSFULLY!" -ForegroundColor Green
Write-Host "Your public repositories:" -ForegroundColor Cyan
foreach ($p in $projects) {
    Write-Host "👉 https://github.com/$username/$($p.Repo)" -ForegroundColor White
}
Write-Host "=====================================================" -ForegroundColor Cyan
