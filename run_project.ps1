# Change to Database directory and execute run_mysql.ps1
Write-Output "Navigating to Database directory..."
Set-Location -Path "./Database"
Write-Output "Executing run_mysql.ps1..."
./run_mysql.ps1

# Wait for 5 seconds
Write-Output "Waiting for 10 seconds..."
Start-Sleep -Seconds 10

# Change to API directory and install dependencies
Write-Output "Navigating to API directory..."
Set-Location -Path "../API"
Write-Output "Installing API dependencies..."
npm install

# Kill the API process if it's already running
$process = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($process) {
    Write-Output "Killing existing API process..."
    $process | Stop-Process -Force
}

# Start the API in a new cmd window
Write-Output "Starting the API in a new cmd window..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/k npm start"

# Wait for the API to start (you can adjust the sleep duration if necessary)
Write-Output "Waiting for the API to start..."
Start-Sleep -Seconds 10

# Change to Front directory and install dependencies
Write-Output "Navigating to Front directory..."
Set-Location -Path "../Front"
Write-Output "Installing Frontend dependencies..."
npm install

# Start the Frontend development server in a new cmd window
Write-Output "Starting the Frontend development server in a new cmd window..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/k npm run dev"
