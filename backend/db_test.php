<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "db5018936778.hosting-data.io";
$user = "dbu827088";
$pass = "Mickey2025!Mickey2025!";

$conn = new mysqli($host, $user, $pass);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

echo "<h3>✅ Connected successfully.</h3><p>Available databases:</p><ul>";

$result = $conn->query("SHOW DATABASES;");
while ($row = $result->fetch_array()) {
  echo "<li>" . htmlspecialchars($row[0]) . "</li>";
}

echo "</ul>";
?>