<?php
require 'db_config.php'; // includes $conn setup

$sql = "INSERT INTO events (title, type, description, location, date, imageurl) VALUES
('Event 1', 'Subscription', 'Description for Event 1', 'Wattenbarger Auditorium', '2025-12-11', 'https://bso.swollenhippo.com/media/NEC-Philharmonia.jpg'),
('Event 2', 'Standard', 'Description for Event 2', 'Wattenbarger Auditorium', '2025-12-12', 'https://bso.swollenhippo.com/media/orchestra.jpg'),
('Event 3', 'Subscription', 'Description for Event 3', 'Wattenbarger Auditorium', '2025-12-13', 'https://bso.swollenhippo.com/media/performer-2.jpg'),
('Event 4', 'Standard', 'Description for Event 4', 'Wattenbarger Auditorium', '2025-12-14', 'https://bso.swollenhippo.com/media/performer-3.jpg');";

if ($conn->query($sql) === TRUE) {
  echo "✅ Data inserted successfully!";
} else {
  echo "❌ Error: " . $conn->error;
}

$conn->close();
?>