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

// Handle GET requests to fetch all events
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/backend/api/events') {
    $result = $conn->query("SELECT * FROM events");
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    exit;
}

// Handle POST requests to add a new event
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/backend/api/events') {
    // Read the JSON body
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input
    if (!isset($input['title']) || !isset($input['date']) || !isset($input['description']) || !isset($input['location']) || !isset($input['imageurl'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid input. 'title', 'date', and 'description' are required."]);
        exit;
    }

    // Prepare and execute the SQL query
    $stmt = $conn->prepare("INSERT INTO events (title, date, description, location, imageurl) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $input['title'], $input['date'], $input['description'], $input['location'], $input['imageurl']);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Event added successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to add event."]);
    }

    $stmt->close();
    exit;
}

// Default response for undefined routes
http_response_code(404);
echo json_encode(["error" => "Route not found"]);
?>