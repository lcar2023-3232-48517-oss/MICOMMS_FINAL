<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_type'])) {
    echo json_encode([
        'loggedIn' => true,
        'role'     => $_SESSION['user_type'],
        'email'    => $_SESSION['email'] ?? ''
    ]);
} else {
    echo json_encode([
        'loggedIn' => false
    ]);
}