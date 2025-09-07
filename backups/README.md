# Backups Directory

This directory contains database backups for the Dobby Cafe application.

## Automatic Backups

Backups are automatically created:
- Before each production deployment
- Daily via CI/CD pipeline (if configured)
- Manual backups via backup script

## Backup Files

Naming convention: `backup_YYYYMMDD_HHMMSS.sql`

Example:
- `backup_20240907_140530.sql` - Backup from Sept 7, 2024 at 14:05:30

## Manual Backup Commands

### Create Backup
```bash
# Production
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U $DB_USER $DB_NAME > backups/manual_backup_$(date +%Y%m%d_%H%M%S).sql

# Development
docker-compose exec -T db pg_dump -U postgres dobby_cafe > backups/dev_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Backup
```bash
# Production
docker-compose -f docker-compose.prod.yml exec -T db psql -U $DB_USER $DB_NAME < backups/backup_file.sql

# Development  
docker-compose exec -T db psql -U postgres dobby_cafe < backups/backup_file.sql
```

## Backup Retention

- Keep daily backups for 30 days
- Keep weekly backups for 3 months
- Keep monthly backups for 1 year

## Security Note

Backup files contain sensitive data. Ensure this directory is:
- Not committed to version control (added to .gitignore)
- Properly secured with appropriate file permissions
- Regularly transferred to secure offsite storage
