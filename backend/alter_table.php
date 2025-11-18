<?php
require 'db_config.php'; // includes $conn setup

$sql = "ALTER TABLE events MODIFY detailed_description TEXT;";

if ($conn->query($sql) === TRUE) {
  echo "Table modified successfully!";
} else {
  echo "Error: " . $conn->error;
}

$conn->close();
?>