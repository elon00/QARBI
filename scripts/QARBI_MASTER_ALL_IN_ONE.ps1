# QARBI one-paste engineering gate. Windows PowerShell 5.1+
# Safe by design: no deployment, no spending, no GitHub push/merge or signer access.
$ErrorActionPreference='Stop'
$root=Join-Path $env:USERPROFILE 'QARBI-Readiness'
$src=Join-Path $root 'source'
$out=Join-Path $root ('master-'+(Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Force -Path $out | Out-Null
function Require($x,$link) { if(-not (Get-Command $x -ErrorAction SilentlyContinue)){throw "Missing $x. Install: $link"} }
Require git 'https://git-scm.com/downloads/win'
Require node 'https://nodejs.org/'
Require npm 'https://nodejs.org/'
if(Test-Path $src) {
  $origin=(& git -C $src remote get-url origin 2>$null)
  if($LASTEXITCODE -ne 0 -or "$origin" -notmatch '^https://github.com/elon00/QARBI(\.git)?$'){throw 'Existing source is not elon00/QARBI'}
  if((& git -C $src status --porcelain)){throw 'Source folder has local edits; preserving them. Move folder and retry.'}
  & git -C $src fetch origin main
  if($LASTEXITCODE -ne 0){throw 'Git fetch failed'}
  & git -C $src checkout -B qarbi-audit-snapshot FETCH_HEAD
  if($LASTEXITCODE -ne 0){throw 'Checkout failed'}
} else {
  & git clone --branch main https://github.com/elon00/QARBI.git $src
  if($LASTEXITCODE -ne 0){throw 'Clone failed'}
}
$sha=(& git -C $src rev-parse HEAD).Trim()
$pkg=Get-Content -Raw (Join-Path $src 'package.json')|ConvertFrom-Json
$scripts=@($pkg.scripts.PSObject.Properties.Name)
$checks=New-Object System.Collections.ArrayList
function Check($label,$command,$enabled=$true){
  $log=Join-Path $out (($label -replace '[^a-zA-Z0-9-]','_')+'.log')
  if(-not $enabled){[void]$checks.Add([pscustomobject]@{name=$label;status='NOT_RUN';log='';reason='Command unavailable'});return}
  Write-Host "Running $label" -ForegroundColor Cyan
  Push-Location $src
  try { & cmd.exe /d /c $command *> $log; $exit=$LASTEXITCODE }
  catch { $exit=1; $_ | Out-File -Append -FilePath $log }
  finally { Pop-Location }
  $status=if($exit -eq 0){'PASS'}else{'FAIL'}
  Write-Host "$label : $status"
  [void]$checks.Add([pscustomobject]@{name=$label;status=$status;log=$log;exit_code=$exit})
}
Check 'npm-ci' 'npm ci'
$depOK=$checks[0].status -eq 'PASS'
foreach($name in @('typecheck','compile:contracts','test:nist','test:quantum','test:contracts','test:x402','audit:static','audit:crypto','check:truth','build','gate:rsi')){
  $enabled=$depOK -and $scripts.Contains($name)
  Check $name ("npm run "+$name) $enabled
}
Check 'npm-audit-high' 'npm audit --audit-level=high' $depOK
$paths=[ordered]@{
'Conway'=@('src/lib/conwayEngine.ts','contracts/ConwayEngine.sol')
'PQC'=@('src/crypto/tests/official-nist-vectors.test.ts')
'x402'=@('test/x402-and-quicknode-streams.test.ts')
'QuickNode'=@('scripts/quicknode-reality-gate.mjs')
'REA-RSI'=@('scripts/raven-rea-rsi-runner.mjs')
'Wallet'=@('src/lib/web3.ts')
'Token'=@('contracts/QARBIToken.sol')
'Security'=@('.github/workflows/codeql.yml')
}
$matrix=foreach($item in $paths.Keys){$present=@($paths[$item]|Where-Object{Test-Path (Join-Path $src $_)});[pscustomobject]@{layer=$item;source_present=($present.Count -gt 0);paths=($present -join ', ');integration_verified=$false}}
$matrix|ConvertTo-Json -Depth 5|Set-Content -Encoding UTF8 (Join-Path $out 'TECHNOLOGY_MATRIX.json')
$passed=@($checks|Where-Object status -eq 'PASS').Count
$total=$checks.Count
$blockers=@('PR #15 conflict not resolved','Live Arbitrum Sepolia contract and E2E receipts not independently verified','Independent smart contract security review missing','Market/legal and launch readiness not approved','Human mainnet approval not granted')
$report=[ordered]@{repo='elon00/QARBI';commit=$sha;time=(Get-Date).ToUniversalTime().ToString('o');verified_tests_passed=$passed;tests_total=$total;checks=@($checks);technology_inventory=@($matrix);hard_blockers=$blockers;production_certified=$false;mainnet_deployed_by_this_script=$false;scorecard_100_verified=$false}
$report|ConvertTo-Json -Depth 8|Set-Content -Encoding UTF8 (Join-Path $out 'SCORECARD.json')
$md=@("# QARBI Real Readiness Report","","Commit: $sha","","Test commands passed: $passed / $total","","## Technical gates")
$md+=@($checks|ForEach-Object{"- $($_.name): $($_.status); log: $($_.log)"})
$md+=@('','## Blockers')
$md+=@($blockers|ForEach-Object{"- $_"})
$md+=@('','## Final outcome','Production/market 100/100: NOT CERTIFIED. No funds or cycles spent.')
$md|Set-Content -Encoding UTF8 (Join-Path $out 'SCORECARD.md')
Write-Host ("Report: "+(Join-Path $out 'SCORECARD.md')) -ForegroundColor Yellow
Start-Process notepad.exe -ArgumentList (Join-Path $out 'SCORECARD.md')
