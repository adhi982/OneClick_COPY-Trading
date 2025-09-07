try {
    Write-Host "Attempting to fund Aptos account via web API..."
    Write-Host "Account: 0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260"
    
    $headers = @{
        'Content-Type' = 'application/json'
        'Accept' = 'application/json'
    }
    
    $body = @{
    address = "0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260"
        amount = 100000000
    } | ConvertTo-Json
    
    Write-Host "Sending request to faucet..."
    
    # Try different faucet endpoints
    $faucets = @(
        "https://faucet.testnet.aptoslabs.com/mint",
        "https://faucet.testnet.aptoslabs.com/v1/mint"
    )
    
    foreach ($faucet in $faucets) {
        try {
            Write-Host "Trying faucet: $faucet"
            $response = Invoke-RestMethod -Uri $faucet -Method POST -Body $body -Headers $headers -TimeoutSec 30
            Write-Host "Success! Response: $response" -ForegroundColor Green
            break
        }
        catch {
            Write-Host "Failed with faucet $faucet : $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    # Alternative: Try direct GET request format
    try {
        Write-Host "Trying alternative GET request format..."
    $getUrl = "https://faucet.testnet.aptoslabs.com/mint?amount=100000000&address=0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260"
        $response = Invoke-WebRequest -Uri $getUrl -Method GET -TimeoutSec 30
        Write-Host "GET request response: $($response.StatusCode) - $($response.Content)" -ForegroundColor Green
    }
    catch {
        Write-Host "GET request also failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}
catch {
    Write-Host "Script error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== MANUAL FUNDING OPTIONS ===" -ForegroundColor Cyan
Write-Host "1. Web Faucet: https://aptoslabs.com/testnet-faucet"
Write-Host "2. Discord: https://discord.gg/aptoslabs (#testnet-faucet channel)"
Write-Host "3. Use command: !faucet 0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260"
Write-Host "4. Alternative faucets:"
Write-Host "   - Pontem: https://faucet.pontem.network/"
Write-Host "   - Martian: https://www.martianwallet.xyz/faucet"
Write-Host ""
Write-Host "Your address: 0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260" -ForegroundColor Yellow
