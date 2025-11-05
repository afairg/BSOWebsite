<?php
if (preg_match('/\.(?:png|jpg|jpeg|gif|css|js|ico)$/', $_SERVER['REQUEST_URI'])) {
    // Serve static files directly
    return false;
} else {
    // Route all other requests to server.php
    include __DIR__ . '/server.php';
}