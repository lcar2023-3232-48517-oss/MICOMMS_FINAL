<?php
session_start();
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$db   = "micomms_database";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email    = $_POST['email']    ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode([
            'success' => false,
            'type'    => 'empty_fields',
            'message' => 'Please enter email and password'
        ]);
        exit();
    }

    session_unset();
    session_regenerate_id(true);

    $sqlAdmin  = "SELECT admin_id, admin_pass FROM admin_tb WHERE admin_email = ?";
    $stmtAdmin = $conn->prepare($sqlAdmin);
    $stmtAdmin->bind_param("s", $email);
    $stmtAdmin->execute();
    $resultAdmin = $stmtAdmin->get_result();

    if ($resultAdmin->num_rows > 0) {
        $row        = $resultAdmin->fetch_assoc();
        $dbPassword = $row['admin_pass'];

        if ($password !== $dbPassword) {
            echo json_encode([
                'success' => false,
                'type'    => 'incorrect_password',
                'message' => 'Incorrect password'
            ]);
        } else {
            $_SESSION['admin_id']  = $row['admin_id'];
            $_SESSION['user_type'] = 'admin';
            $_SESSION['email']     = $email;

            echo json_encode([
                'success' => true,
                'role'    => 'admin',
                'id'      => $row['admin_id']
            ]);
        }

        $stmtAdmin->close();
        $conn->close();
        exit();
    }
    $stmtAdmin->close();

    $sqlUser  = "SELECT user_id, user_pass FROM user_tb WHERE user_email = ?";
    $stmtUser = $conn->prepare($sqlUser);
    $stmtUser->bind_param("s", $email);
    $stmtUser->execute();
    $resultUser = $stmtUser->get_result();

    if ($resultUser->num_rows === 0) {
        echo json_encode([
            'success' => false,
            'type'    => 'invalid_email',
            'message' => 'Invalid email'
        ]);
        $stmtUser->close();
        $conn->close();
        exit();
    }

    $row        = $resultUser->fetch_assoc();
    $dbPassword = $row['user_pass'];

    if ($password !== $dbPassword) {
        echo json_encode([
            'success' => false,
            'type'    => 'incorrect_password',
            'message' => 'Incorrect password'
        ]);
    } else {
        $_SESSION['user_id']   = $row['user_id'];
        $_SESSION['user_type'] = 'user';
        $_SESSION['email']     = $email;

        echo json_encode([
            'success' => true,
            'role'    => 'user',
            'id'      => $row['user_id']
        ]);
    }

    $stmtUser->close();
}

$conn->close();
