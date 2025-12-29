# ⚠️ EXISTING DATABASE TABLES - DO NOT MODIFY

## Table: `id` (Product/Item Catalog)
**Purpose**: Existing product/item catalog table (DO NOT DROP OR MODIFY)

### Schema:
```sql
- id (uuid, PRIMARY KEY)
- slug (text)
- title (text)
- description (text)
- category (text)
- image (text)
- price (text)
- features (jsonb)
- createdAt (timestamptz)
- updatedAt (timestamptz)
```

### Notes:
- This table was created before the Smart Farm IoT Platform schema
- All new schema changes MUST avoid conflicts with this table
- Use `CREATE TABLE IF NOT EXISTS` for safety
- Never use `DROP TABLE` commands in migration scripts

---

## Safe Migration Strategy:
1. Always check existing tables before creating new ones
2. Use unique table names that don't conflict (e.g., `iot_*` prefix if needed)
3. Test migrations in a separate Supabase project first
4. Create backups before running any schema changes
