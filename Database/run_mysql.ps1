$containerName = "mysql-db"
$volumeName = "database_mysql-data"

Write-Output "Stopping and removing existing container..."
docker stop $containerName
docker rm $containerName

Write-Output "Removing existing volume..."
docker volume rm $volumeName

Write-Output "Starting new container from docker-compose.yml..."
docker-compose up -d

Write-Output "Done."
