<?php
$host = "db5018936778.hosting-data.io";
$user = "dbu827088";
$pass = "Mickey2025!Mickey2025!";
$dbname = "dbs14925390";

// Create connection
$conn = new mysqli($host, $user, $pass, 'dbs14925390');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>