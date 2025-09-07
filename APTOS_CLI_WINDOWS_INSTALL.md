# 🛠️ Aptos CLI Installation Guide for Windows

## Option 1: Download Pre-built Binary (Recommended)

### Step 1: Download Aptos CLI
1. Visit: https://github.com/aptos-labs/aptos-core/releases
2. Download: `aptos-cli-windows-x86_64.zip` from the latest release
3. Extract the ZIP file to a folder (e.g., `C:\Tools\aptos`)

### Step 2: Add to PATH
1. Open System Properties → Advanced → Environment Variables
2. Add the extraction folder to your PATH environment variable
3. Or create a batch file:

```batch
# Create aptos.bat in a folder that's in your PATH
@echo off
C:\Tools\aptos\aptos.exe %*
```

### Step 3: Verify Installation
```bash
aptos --version
```

## Option 2: Use Python Installation (If Aptos CLI Binary Fails)

```bash
# Install via Python (requires Python 3.8+)
pip install aptos-cli
```

## Option 3: Manual Installation for Development

If you can't install Aptos CLI, you can still:

1. **Use online tools**: Aptos Explorer for contract interaction
2. **Docker approach**: Use Aptos CLI in Docker container
3. **WSL approach**: Use Windows Subsystem for Linux

```bash
# WSL/Ubuntu approach
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

## Next Steps

Once Aptos CLI is installed:

```bash
# Verify installation
aptos --version

# Continue with deployment
cd smart-contracts
python scripts/deploy.py
```

## Alternative: Skip CLI and Use Direct Integration

You can also proceed without CLI by:
1. Using the backend/frontend integration with Ankr RPC directly
2. Testing smart contracts through the frontend
3. Using Aptos Explorer for contract verification

The smart contracts are ready to be integrated with your backend and frontend using the Ankr RPC endpoints!
