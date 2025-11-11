<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

// Include database configuration
include 'db_config.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the JSON body
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input
    if (!isset($input['username']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(["error" => "Username and password are required."]);
        exit;
    }

    $username = $input['username'];
    $password = $input['password'];

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert the admin user into the database
    $stmt = $conn->prepare("INSERT INTO admins (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $hashedPassword);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Admin user created successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to create admin user."]);
    }

    $stmt->close();
    exit;
}

// Default response for unsupported methods
http_response_code(405);
echo json_encode(["error" => "Method not allowed."]);
?>