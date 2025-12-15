<?php
session_start();
$host = "localhost";
$user = "root";
$pass = "";
$db   = "micomms_database";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$fullName  = $_POST['full_name']  ?? '';
$birthdate = $_POST['birthdate']  ?? '';
$email     = $_POST['email']      ?? '';
$password  = $_POST['password']   ?? '';
$role      = $_POST['role']       ?? '';
$phone     = $_POST['phone']      ?? '';
$address   = $_POST['address']    ?? '';

if (empty($fullName) || empty($birthdate) || empty($email) || empty($password) || empty($role) || empty($phone) || empty($address)) {
    die("All fields are required.");
}

$passwordToStore = $password;
$today = date('Y-m-d');
$checkSql = "SELECT COUNT(*) as count FROM admin_tb WHERE admin_email = ? UNION SELECT COUNT(*) as count FROM user_tb WHERE user_email = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$counts = [];
while ($row = $checkResult->fetch_assoc()) {
    $counts[] = $row['count'];
}
$checkStmt->close();

if (in_array(1, $counts)) {
    die("Email already exists.");
}

$id = null;
if ($role === 'user') {
    $sql = "INSERT INTO user_tb (user_name, user_email, user_pass, user_num, user_address, user_datereg, user_birthdate)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssss", $fullName, $email, $passwordToStore, $phone, $address, $today, $birthdate);
    $stmt->execute();
    $id = $conn->insert_id;
    $_SESSION['user_id'] = $id;
    
} elseif ($role === 'admin') {
    $sql = "INSERT INTO admin_tb (admin_name, admin_email, admin_pass, admin_num, admin_address, admin_dateadd, admin_birthdate)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssss", $fullName, $email, $passwordToStore, $phone, $address, $today, $birthdate);
    $stmt->execute();
    $id = $conn->insert_id;
    $_SESSION['admin_id'] = $id;
    
} else {
    die("Invalid role selection.");
}

$_SESSION['user_type'] = $role;
$_SESSION['email'] = $email;

$stmt->close();
$conn->close();
header("Location: landing-basket.htm");
exit;

?>
