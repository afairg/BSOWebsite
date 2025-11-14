<?php
require 'db_config.php'; // includes $conn setup

$sql = "INSERT INTO personnel (fullname, type, title, description, email, phone, imageurl, sortid) VALUES
('Jane Symphony', 'Board of Directors', 'President', 'Jane is the president of the board of directors.', 'janesymphony@gmail.com', 1234567890, 'https://bso.swollenhippo.com/media/jane-stockphoto.jpg', 1),
('John Symphony', 'Board of Directors', 'Vice President', 'John is the vice president of the board of directors.', 'johnsymphony@gmail.com', 1234567890, 'https://bso.swollenhippo.com/media/john-stockphoto.jpg', 2),
('Johntwo Symphony', 'Staff', 'Marketing and Outreach', 'Johntwo is the marketing and outreach professional.', 'john2symphony@gmail.com', 1234567890, 'https://bso.swollenhippo.com/media/john2-stockphoto.jpg', 3),
('Janetwo Symphony', 'Staff', 'Box Office Manager', 'Janetwo is the box office manager.', 'jane2symphony@gmail.com', 1234567890, 'https://bso.swollenhippo.com/media/jane2-stockphoto.jpg', 4);";

if ($conn->query($sql) === TRUE) {
  echo "Data inserted successfully!";
} else {
  echo "Error: " . $conn->error;
}

$conn->close();
?>