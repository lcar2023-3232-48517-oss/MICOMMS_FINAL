<?php
$conn = new mysqli("localhost", "root", "", "micomms_database");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');

$sql = "SELECT admin_id, admin_name, admin_email, admin_pass, admin_num, admin_address, admin_dateadd FROM admin_tb";
$result = $conn->query($sql);

$data = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);

$conn->close();
?>
