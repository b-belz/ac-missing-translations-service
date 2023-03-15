# Adjustments for Mysql8

# Make sure group by works like 5.7
# ER_WRONG_FIELD_WITH_GROUP: Expression #9 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'actest.b.clientId' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by
#set global sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

# UPDATE AUTH MECHANISM FOR actest user - see also docker run with --default-authentication-plugin=mysql_native_password
ALTER USER 'actest'@'%' IDENTIFIED WITH mysql_native_password BY 'actest';
GRANT ALL PRIVILEGES ON *.* TO 'actest'@'%'; 
FLUSH PRIVILEGES;