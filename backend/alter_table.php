<?php
require 'db_config.php'; // includes $conn setup

$sql = "ALTER TABLE personnel DROP COLUMN instrument;";

if ($conn->query($sql) === TRUE) {
  echo "Table modified successfully!";
} else {
  echo "Error: " . $conn->error;
}

$conn->close();
?>