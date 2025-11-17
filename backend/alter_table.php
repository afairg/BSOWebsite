<?php
require 'db_config.php'; // includes $conn setup

$sql = "ALTER TABLE events ADD detailed_description VARCHAR(255), ADD general_ticket_price DECIMAL(6,2), ADD senior_ticket_price DECIMAL(6,2);";

if ($conn->query($sql) === TRUE) {
  echo "Table added successfully!";
} else {
  echo "Error: " . $conn->error;
}

$conn->close();
?>