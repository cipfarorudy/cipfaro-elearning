# Script de configuration des utilisateurs admin MinIO
# Usage: .\configure-minio-admin.ps1

Write-Host "Configuration des utilisateurs admin MinIO..." -ForegroundColor Green

# Attendre que MinIO soit prêt
Write-Host "Attente du démarrage de MinIO..." -ForegroundColor Yellow
Start-Sleep 10

# Configuration avec mc (MinIO Client)
Write-Host "Configuration de l'alias MinIO..." -ForegroundColor Yellow
docker exec cipfaro-elearning-minio-1 mc alias set local http://localhost:9000 cipfaro-admin cipfaro-admin-password-123

# Création d'un utilisateur admin dédié pour l'e-learning
Write-Host "Création de l'utilisateur admin e-learning..." -ForegroundColor Yellow
docker exec cipfaro-elearning-minio-1 mc admin user add local admin@cipfaro.fr admin123

# Attribution des permissions admin
Write-Host "Attribution des permissions admin..." -ForegroundColor Yellow
docker exec cipfaro-elearning-minio-1 mc admin policy attach local readwrite --user admin@cipfaro.fr

# Création d'un bucket pour l'e-learning
Write-Host "Configuration du bucket e-learning..." -ForegroundColor Yellow
docker exec cipfaro-elearning-minio-1 mc mb local/cipfaro-elearning --ignore-existing
docker exec cipfaro-elearning-minio-1 mc policy set public local/cipfaro-elearning

Write-Host "Configuration terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "Accès MinIO Console: http://localhost:9002" -ForegroundColor Cyan
Write-Host "Super Admin: cipfaro-admin / cipfaro-admin-password-123" -ForegroundColor Cyan
Write-Host "Admin E-Learning: admin@cipfaro.fr / admin123" -ForegroundColor Cyan
Write-Host "Bucket: cipfaro-elearning" -ForegroundColor Cyan