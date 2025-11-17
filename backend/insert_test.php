<?php
require 'db_config.php'; // includes $conn setup

$sql = "INSERT INTO season_sponsors (name, imageurl, sortid) VALUES
('Jane Symphony', 'https://bso.swollenhippo.com/media/jane-stockphoto.jpg', 1),
('John Symphony', 'https://bso.swollenhippo.com/media/john-stockphoto.jpg', 2),
('Johntwo Symphony', 'https://bso.swollenhippo.com/media/john2-stockphoto.jpg', 3),
('Janetwo Symphony', 'https://bso.swollenhippo.com/media/jane2-stockphoto.jpg', 4);";

if ($conn->query($sql) === TRUE) {
  echo "Data inserted successfully!";
} else {
  echo "Error: " . $conn->error;
}

$conn->close();
?>