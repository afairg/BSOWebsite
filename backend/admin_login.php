<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database configuration
include 'db_config.php';

// Handle POST requests for admin login
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

    // Query the database for the admin user
    $stmt = $conn->prepare("SELECT id, password FROM admins WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // User not found
        http_response_code(401);
        echo json_encode(["error" => "Invalid username or password."]);
        exit;
    }

    $admin = $result->fetch_assoc();
    $hashedPassword = $admin['password'];

    // Verify the password
    if (password_verify($password, $hashedPassword)) {
        // Password is correct, return success response
        http_response_code(200);
        echo json_encode(["message" => "Login successful.", "adminId" => $admin['id']]);
    } else {
        // Password is incorrect
        http_response_code(401);
        echo json_encode(["error" => "Invalid username or password."]);
    }

    $stmt->close();
    exit;
}

// Default response for unsupported methods
http_response_code(405);
echo json_encode(["error" => "Method not allowed."]);
?>