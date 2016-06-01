/**
 * Created by kyle on 4/10/16.
 */

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/project2';

module.exports = connectionString;