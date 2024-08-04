# PowerShell script

$containerName = "mysql-db"

Write-Output "Stopping and removing existing container..."
docker stop $containerName
docker rm $containerName

Write-Output "Starting new container from docker-compose.yml..."
docker-compose up -d

Write-Output "Done."
