
CREATE USER IF NOT EXISTS 'actest'@'%' IDENTIFIED BY 'actest'; 
GRANT ALL PRIVILEGES ON *.* TO 'actest'@'%'; 
FLUSH PRIVILEGES;