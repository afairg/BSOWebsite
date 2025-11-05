<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow requests from any origin (for testing / dev)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight (OPTIONS) requests quickly
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db_config.php';

header("Content-Type: application/json");

$result = $conn->query("SELECT * FROM events");
$data = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($data);
?>