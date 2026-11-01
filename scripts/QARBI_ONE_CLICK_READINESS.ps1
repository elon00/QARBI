# QARBI Single-command evidence-first Windows PowerShell auditor
# Safe: read-only against GitHub; never deploys, pushes, merges or accesses signers.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$homePath = [Environment]::GetFolderPath('UserProfile')
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$root = Join-Path $homePath 'QARBI-Readiness'
$repo = Join-Path $root 'source'
$reports = Join-Path $root ('reports-' + $stamp)
New-Item -ItemType Directory -Force -Path $root,$reports | Out-Null
$results = New-Object System.Collections.ArrayList
$issues = New-Object System.Collections.ArrayList
function Record([string]$name,[string]$status,[string]$detail,[string]$evidence) {
    [void]$results.Add([pscustomobject]@{Layer=$name;Status=$status;Detail=$detail;Evidence=$evidence})
    Write-Host "[$status] $name : $detail"
}
function TestTool([string]$name) { return [bool](Get-Command $name -ErrorAction SilentlyContinue) }
if (-not (TestTool 'git')) {
    Write-Host 'BLOCKED: Git for Windows is missing. Install from https://git-scm.com/downloads/win' -ForegroundColor Red
    exit 2
}
if (-not (TestTool 'node') -or -not (TestTool 'npm')) {
    Write-Host 'BLOCKED: Node.js and npm are required. Install the LTS version from https://nodejs.org/' -ForegroundColor Red
    exit 2
}
function RunCheck([string]$name,[string]$program,[string[]]$argsList,[int]$minutes=15) {
    $safe = ($name -replace '[^a-zA-Z0-9_-]','-')
    $log = Join-Path $reports ($safe+'.log')
    $err = Join-Path $reports ($safe+'.stderr.log')
    Write-Host "Running $name ..."
    try {
        $p = Start-Process -FilePath $program -ArgumentList $argsList -WorkingDirectory $repo -RedirectStandardOutput $log -RedirectStandardError $err -NoNewWindow -PassThru
        $ok = $p.WaitForExit($minutes*60000)
        if (-not $ok) { try { $p.Kill() } catch {} ; Record $name 'BLOCKED' 'Timed out' $log; return }
        $p.Refresh()
        if ($p.ExitCode -eq 0) { Record $name 'PASS' 'Process exited 0' $log }
        else { Record $name 'FAIL' ('Exit code '+$p.ExitCode) $log }
    } catch { Record $name 'BLOCKED' $_.Exception.Message $log }
}
# Reuse a clean, separately managed checkout; never modify an existing user's checkout.
if (Test-Path $repo) {
    $origin = (& git -C $repo remote get-url origin 2>$null)
    if ($LASTEXITCODE -ne 0 -or "$origin" -notmatch '^https://github.com/elon00/QARBI(\.git)?$') {
        Write-Host 'BLOCKED: Existing checkout is not the intended repository.' -ForegroundColor Red; exit 3
    }
    $dirty = (& git -C $repo status --porcelain)
    if ($dirty) { Write-Host 'BLOCKED: Existing audit checkout contains local edits; not overwriting.' -ForegroundColor Red; exit 3 }
    & git -C $repo fetch --depth 1 origin main
    if ($LASTEXITCODE -ne 0) { throw 'Git fetch failed' }
    & git -C $repo checkout -B qarbi-audit-snapshot FETCH_HEAD
    if ($LASTEXITCODE -ne 0) { throw 'Git checkout failed' }
} else {
    & git clone --depth 1 --branch main https://github.com/elon00/QARBI.git $repo
    if ($LASTEXITCODE -ne 0) { throw 'Git clone failed' }
}
$sha = (& git -C $repo rev-parse HEAD).Trim()
Record 'Repository' 'PASS' ('Checked out main commit '+$sha) 'Git repository'
$pkgPath=Join-Path $repo 'package.json'
if (-not (Test-Path $pkgPath)) { throw 'Missing package.json' }
$pkg = Get-Content -Raw $pkgPath | ConvertFrom-Json
$scriptNames = @($pkg.scripts.PSObject.Properties.Name)
function WithNpm([string]$name,[string]$scriptName) {
    if ($scriptNames -contains $scriptName) { RunCheck $name 'cmd.exe' @('/d','/c',('npm run '+$scriptName)) }
    else { Record $name 'NOT_RUN' ('Script missing: '+$scriptName) 'package.json' }
}
RunCheck 'DependencyInstall' 'cmd.exe' @('/d','/c','npm ci') 20
$installed=($results | Where-Object {$_.Layer -eq 'DependencyInstall' -and $_.Status -eq 'PASS'}).Count -gt 0
if ($installed) {
    WithNpm 'Typecheck' 'typecheck'
    WithNpm 'ContractCompile' 'compile:contracts'
    WithNpm 'NISTVectors' 'test:nist'
    WithNpm 'CryptoAudit' 'audit:crypto'
    WithNpm 'ContractTests' 'test:contracts'
    WithNpm 'X402Tests' 'test:x402'
    WithNpm 'QuantumTests' 'test:quantum'
    WithNpm 'StaticAnalysis' 'audit:static'
    WithNpm 'TruthGate' 'check:truth'
    WithNpm 'Build' 'build'
    WithNpm 'REA_RSI_BoundedRunner' 'gate:rsi'
    RunCheck 'NpmSecurityAudit' 'cmd.exe' @('/d','/c','npm audit --audit-level=high') 10
} else {
    Record 'TechnicalVerification' 'BLOCKED' 'npm ci failed, dependent tests cannot run' 'DependencyInstall.log'
}
# Presence inventory is not proof of working integrations.
$inventory = @(
    @{Layer='QuickNode';Paths=@('scripts/quicknode-reality-gate.mjs','scripts/quicknode-automation.mjs')},
    @{Layer='REA_RSI';Paths=@('scripts/raven-rea-rsi-runner.mjs')},
    @{Layer='Conway';Paths=@('src/lib/conwayEngine.ts','contracts/ConwayEngine.sol')},
    @{Layer='PQC';Paths=@('src/crypto/tests/official-nist-vectors.test.ts')},
    @{Layer='x402';Paths=@('test/x402-and-quicknode-streams.test.ts')},
    @{Layer='Wallet';Paths=@('src/components/WalletModal.tsx','src/lib/web3.ts')},
    @{Layer='Token';Paths=@('contracts/QARBIToken.sol')},
    @{Layer='Web4';Paths=@('src/App.tsx')}
)
$inventoryResults = foreach($it in $inventory) {
    $found=@($it.Paths | Where-Object { Test-Path (Join-Path $repo $_) })
    [pscustomobject]@{Layer=$it.Layer;SourcePresent=($found.Count -gt 0);Paths=($found -join ', ');IntegrationVerified=$false}
}
$inventoryResults | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $reports 'TECHNOLOGY_MATRIX.json')
# The actual release gate is external proof, NOT inferred from these local checks.
Record 'LiveTestnetReceipts' 'BLOCKED' 'Must independently inspect real chain receipts and deployed bytecode' 'Arbitrum Sepolia explorer'
Record 'IndependentSecurityAudit' 'BLOCKED' 'CodeQL and unit tests do not replace external contract audit' 'External signed findings needed'
Record 'MarketLegalReview' 'BLOCKED' 'Tokenomics, product fit and jurisdictional legal review not verified' 'Approved launch dossier needed'
Record 'PR15Integration' 'BLOCKED' 'Conflicted historical production-hardening PR requires reviewed reconciliation' 'https://github.com/elon00/QARBI/pull/15'
Record 'MainnetRelease' 'BLOCKED' 'Explicit human approval and all evidence gates required; no funds spent' 'Not attempted'
$technicalChecks=@($results | Where-Object { $_.Layer -in @('DependencyInstall','Typecheck','ContractCompile','NISTVectors','CryptoAudit','ContractTests','X402Tests','QuantumTests','StaticAnalysis','TruthGate','Build','REA_RSI_BoundedRunner','NpmSecurityAudit') })
$passed=@($technicalChecks | Where-Object {$_.Status -eq 'PASS'}).Count
$technicalTotal=$technicalChecks.Count
$provisional=[math]::Floor(60*$passed/[math]::Max($technicalTotal,1))
$releaseReady=$false
$report=[ordered]@{Repository='elon00/QARBI';Commit=$sha;Timestamp=(Get-Date).ToUniversalTime().ToString('o');TechnicalChecksPassed=$passed;TechnicalChecksTotal=$technicalTotal;ProvisionalTechnicalPointsOutOf60=$provisional;VerifiedProductionReady=$releaseReady;Certified100OutOf100=$false;NoMainnetSpending=$true;Results=@($results);TechnologyInventory=@($inventoryResults)}
$report | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 (Join-Path $reports 'FINAL_SCORECARD.json')
$lines = @('# QARBI evidence-first readiness report','','Repository commit: '+$sha,'','Technical checks: '+$passed+' / '+$technicalTotal,'Provisional technical points: '+$provisional+' / 60','Production 100/100 certified: NO','','## Verification results','')
$lines += @($results | ForEach-Object {'- '+$_.Layer+': '+$_.Status+' — '+$_.Detail})
$lines += @('','## Technology inventory (presence only, not functionality proof)','')
$lines += @($inventoryResults | ForEach-Object {'- '+$_.Layer+': '+$(if($_.SourcePresent){'SOURCE PRESENT'}else{'NOT FOUND'})+' '+$_.Paths})
$lines += @('','## Hard release rule','No mainnet action performed. Missing live transactions, external security review and deployment signoff block certification.')
$lines | Set-Content -Encoding UTF8 (Join-Path $reports 'FINAL_SCORECARD.md')
Write-Host ""
Write-Host ('REPORT: '+(Join-Path $reports 'FINAL_SCORECARD.md')) -ForegroundColor Cyan
Write-Host ('TECHNICAL CHECKS: '+$passed+'/'+$technicalTotal+' — PRODUCTION NOT CERTIFIED') -ForegroundColor Yellow
Start-Process notepad.exe -ArgumentList @((Join-Path $reports 'FINAL_SCORECARD.md'))
