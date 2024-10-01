USE Health_connection;

CREATE USER 'Admin'@'localhost' IDENTIFIED BY '3312'
GRANT ALL PRIVILEGES ON Health_connection.* TO 'Admin'@'localhost';
FLUSH PRIVILEGES;

CREATE USER 'Visualizer'@'localhost' IDENTIFIED BY '1012';
GRANT SELECT ON Health_connection.* TO 'Visualizer'@'localhost';
FLUSH PRIVILEGES;


