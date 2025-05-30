<?php
session_start();

$host = "localhost";
$db = "demanda";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$response = [];

if (!isset($_SESSION['usuario'])) {
    $response['success'] = false;
    $response['error'] = 'Sesión no iniciada.';
    echo json_encode($response);
    exit;
}

$id_usuario = $_SESSION['usuario'];
$id_oferta = $_POST['id_oferta'];
$cajas_reservadas = $_POST['cajas'];

$stmt = $conn->prepare("INSERT INTO reservas (id_usuario, id_oferta, cajas_reservadas) VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE cajas_reservadas = VALUES(cajas_reservadas)");

$stmt->bind_param("iid", $id_usuario, $id_oferta, $cajas_reservadas);

if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
    $response['error'] = $stmt->error;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
