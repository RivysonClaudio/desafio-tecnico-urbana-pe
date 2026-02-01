-- Script para limpar o banco de dados e histórico do Flyway
-- Execute este script conectado ao banco 'urbana_pe' como superusuário

-- 1. Limpar histórico do Flyway
TRUNCATE TABLE flyway_schema_history;

-- 2. Dropar tabelas (na ordem correta devido às foreign keys)
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 4. Dropar sequences
DROP SEQUENCE IF EXISTS card_number_seq CASCADE;

-- 5. Verificar se limpou tudo (opcional - apenas para conferência)
-- SELECT * FROM flyway_schema_history;
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public';