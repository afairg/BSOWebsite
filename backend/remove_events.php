<?php
require 'db_config.php';

$sql = "DELETE FROM personnel;";

if ($conn->query($sql) === TRUE) {
  echo "✅ Data deleted successfully!";
} else {
  echo "❌ Error: " . $conn->error;
}

$conn->close();
?>