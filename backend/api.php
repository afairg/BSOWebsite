<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow requests from any origin (for testing / dev)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE");
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
    $result = $conn->query("SELECT * FROM events ORDER BY date ASC");
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/backend/api/subscription-events') {
    $result = $conn->query("SELECT * FROM events WHERE type = 'Subscription' ORDER BY date ASC");
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/backend/api/education-events') {
    $result = $conn->query("SELECT * FROM events WHERE type = 'Education' ORDER BY date ASC");
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    exit;
}

// Handle POST requests to add a new event
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], '/backend/api/events') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['title']) || !isset($input['type']) || !isset($input['date']) || !isset($input['description']) || !isset($input['location']) || !isset($input['imageurl'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid input. All fields are required."]);
        exit;
    }

    $title = $input['title'];
    $type = $input['type'];
    $date = $input['date'];
    $description = $input['description'];
    $location = $input['location'];
    $imageurl = $input['imageurl'];

    $stmt = $conn->prepare("INSERT INTO events (title, type, date, description, location, imageurl) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $title, $type, $date, $description, $location, $imageurl);

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

// Handle image uploads when needed
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], '/backend/api/upload-image') !== false) {
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(["error" => "No file uploaded"]);
        exit;
    }

    $file = $_FILES['image'];
    $uploadDir = __DIR__ . '/../media/'; // adjust path to point to your /uploads directory
    $fileName = uniqid() . '-' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $fileUrl = "https://bso.swollenhippo.com/media/" . $fileName;
        echo json_encode(["url" => $fileUrl]);
        exit;
    } else {
        http_response_code(500);
        echo json_encode(["error" => "File upload failed"]);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' && strpos($_SERVER['REQUEST_URI'], '/backend/api/events') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['title']) || !isset($input['type']) || !isset($input['date']) || !isset($input['description']) || !isset($input['location']) || !isset($input['imageurl'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid input. All fields are required."]);
        exit;
    }

    $title = $input['title'];
    $type = $input['type'];
    $date = $input['date']; // Ensure this includes both date and time
    $description = $input['description'];
    $location = $input['location'];
    $imageurl = $input['imageurl'];

    $stmt = $conn->prepare("UPDATE events SET type = ?, date = ?, description = ?, location = ?, imageurl = ? WHERE title = ?");
    $stmt->bind_param("ssssss", $type, $date, $description, $location, $imageurl, $title);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Event updated successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Event not found."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update event."]);
    }

    $stmt->close();
    exit;
}

// Handle DELETE requests for a single event
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && strpos($_SERVER['REQUEST_URI'], '/backend/api/events') !== false) {
    // Parse the query string to get the title
    parse_str(parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY), $queryParams);

    if (!isset($queryParams['title'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing 'title' parameter"]);
        exit;
    }

    $title = $queryParams['title'];

    // Step 1: Retrieve the image URL for the event
    $stmt = $conn->prepare("SELECT imageurl FROM events WHERE title = ?");
    $stmt->bind_param("s", $title);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Event not found."]);
        $stmt->close();
        exit;
    }

    $event = $result->fetch_assoc();
    $imageUrl = $event['imageurl'];
    $stmt->close();

    // Step 2: Delete the event from the database
    $stmt = $conn->prepare("DELETE FROM events WHERE title = ?");
    $stmt->bind_param("s", $title);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Step 3: Delete the associated image file from the server
            $imagePath = __DIR__ . '/../media/' . basename($imageUrl);
            if (file_exists($imagePath)) {
                unlink($imagePath); // Delete the file
            }

            http_response_code(200);
            echo json_encode(["message" => "Event and associated image deleted successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Event not found."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete event."]);
    }

    $stmt->close();
    exit;
}

// GET all personnel
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/backend/api/personnel') {
    $result = $conn->query("SELECT * FROM personnel ORDER BY sortid, fullname ASC");
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    exit;
}

// GET all staff
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/backend/api/personnel/staff') {
    $result = $conn->query("SELECT * FROM personnel WHERE type = 'Staff' ORDER BY sortid, fullname ASC");
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    exit;
}

// GET all board of directors members
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/backend/api/personnel/board-of-directors') {
    $result = $conn->query("SELECT * FROM personnel WHERE type = 'Board of Directors' ORDER BY sortid, fullname ASC");
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    exit;
}

// GET sort IDs for all personnel
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/backend/api/personnel/sortid') {
    $result = $conn->query("SELECT sortid FROM personnel ORDER BY sortid ASC");
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    exit;
}

// GET the music director
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/backend/api/personnel/music-director') {
    $result = $conn->query("SELECT * FROM personnel WHERE title = 'Music Director'");
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    exit;
}

// Handle POST requests to create new personnel
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], '/backend/api/personnel') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['fullname']) || !isset($input['type']) || !isset($input['title']) || !isset($input['imageurl']) || !isset($input['sortid'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid input. Missing one or more required input fields."]);
        exit;
    }

    $fullname = $input['fullname'];
    $type = $input['type'];
    $title = $input['title'];
    $description = $input['description'];
    $email = $input['email'];
    $phone = $input['phone'];
    $imageurl = $input['imageurl'];
    $sortid = $input['sortid'];

    $stmt = $conn->prepare("INSERT INTO personnel (fullname, type, title, description, email, phone, imageurl, sortid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssisi", $fullname, $type, $title, $description, $email, $phone, $imageurl, $sortid);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Person added successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to add person."]);
    }

    $stmt->close();
    exit;
}

// Handle DELETE requests to delete personnel
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && strpos($_SERVER['REQUEST_URI'], '/backend/api/personnel') !== false) {
    // Parse the query string to get the title
    parse_str(parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY), $queryParams);

    if (!isset($queryParams['fullname'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing 'fullname' parameter"]);
        exit;
    }

    $fullname = $queryParams['fullname'];

    // Step 1: Retrieve the image URL for the person
    $stmt = $conn->prepare("SELECT imageurl FROM personnel WHERE fullname = ?");
    $stmt->bind_param("s", $fullname);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Person not found."]);
        $stmt->close();
        exit;
    }

    $person = $result->fetch_assoc();
    $imageUrl = $person['imageurl'];
    $stmt->close();

    // Step 2: Delete the person from the database
    $stmt = $conn->prepare("DELETE FROM personnel WHERE fullname = ?");
    $stmt->bind_param("s", $fullname);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Step 3: Delete the associated image file from the server
            $imagePath = __DIR__ . '/../media/' . basename($imageUrl);
            if (file_exists($imagePath)) {
                unlink($imagePath); // Delete the file
            }

            http_response_code(200);
            echo json_encode(["message" => "Person and associated image deleted successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Person not found."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete Person."]);
    }

    $stmt->close();
    exit;
}

// Handle PUT requests to update existing personnel
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && strpos($_SERVER['REQUEST_URI'], '/backend/api/personnel') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['fullname']) || !isset($input['type']) || !isset($input['title'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid input. One or more required fields are missing."]);
        exit;
    }

    $fullname = $input['fullname'];
    $type = $input['type'];
    $title = $input['title'];
    $description = $input['description'];
    $email = $input['email'];
    $phone = $input['phone'];
    $imageurl = $input['imageurl'];
    $sortid = $input['sortid'];

    $stmt = $conn->prepare("UPDATE personnel SET type = ?, title = ?, description = ?, email = ?, phone = ?, imageurl = ?, sortid = ? WHERE fullname = ?");
    $stmt->bind_param("ssssisis", $type, $title, $description, $email, $phone, $imageurl, $sortid, $fullname);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Person updated successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Person not found."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update person."]);
    }

    $stmt->close();
    exit;
}

// Default response for undefined routes
http_response_code(404);
echo json_encode(["error" => "Route not found"]);