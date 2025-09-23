param([string]$Domain = "cipfaro.fr")

Write-Host "🔍 Vérification DNS pour $Domain" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

function Test-DNS {
    param([string]$hostname)
    Write-Host "🌐 Test DNS pour $hostname..." -ForegroundColor Yellow
    try {
        $dnsResult = Resolve-DnsName -Name $hostname -Type A -ErrorAction Stop
        $ip = $dnsResult.IPAddress
        Write-Host "   ✅ $hostname -> $ip" -ForegroundColor Green
        return $ip
    }
    catch {
        Write-Host "   ❌ DNS non résolu pour $hostname" -ForegroundColor Red
        return $null
    }
}

Write-Host "`n📋 TESTS DNS" -ForegroundColor Magenta
$mainIP = Test-DNS -hostname $Domain
$wwwIP = Test-DNS -hostname "www.$Domain"
$apiIP = Test-DNS -hostname "api.$Domain"

if ($mainIP) {
    Write-Host "`n✅ DNS configuré pour $Domain" -ForegroundColor Green
} else {
    Write-Host "`n❌ DNS non configuré pour $Domain" -ForegroundColor Red
    Write-Host "`n🚀 Prochaines étapes :" -ForegroundColor Yellow
    Write-Host "1. Commandez le VPS Cloud LWS" -ForegroundColor White
    Write-Host "2. Configurez DNS dans le panneau LWS" -ForegroundColor White
}

Write-Host "`n🔗 Panneau LWS : https://panel.lws.fr" -ForegroundColor Cyan
Write-Host "✅ Vérification terminée !" -ForegroundColor Green