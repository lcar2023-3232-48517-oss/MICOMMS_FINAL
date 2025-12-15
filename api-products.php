<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'micomms_database';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['error' => 'DB connection failed']));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO products_tb (admin_id, product_name, product_desc, product_price, product_stock, category_id, product_img, product_dateadd) VALUES (1, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$input['name'], $input['desc'], $input['price'], $input['stock'], $input['category'], $input['img']]);
    echo json_encode(['success' => true]);
} else {
    $stmt = $pdo->query("SELECT * FROM products_tb WHERE admin_id = 1 ORDER BY product_dateadd DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
?>
