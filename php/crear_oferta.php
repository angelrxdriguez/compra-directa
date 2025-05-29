<?php
$host = "localhost";
$db = "demanda";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$articulo = $_POST['articulo'];
$variedad = $_POST['variedad'];
$cultivo = $_POST['cultivo'];
$fecha = $_POST['fecha'];
$cajas = $_POST['cajas'];

// Insertar en la tabla ofertas
$sql = "INSERT INTO ofertas (articulo, variedad, cultivo, fecha, cajas) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssd", $articulo, $variedad, $cultivo, $fecha, $cajas);

$response = [];

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
