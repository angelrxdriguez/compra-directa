<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["success" => false, "error" => "Sesión no iniciada."]);
    exit;
}

$mysqli = new mysqli("localhost", "root", "", "demanda");
$mysqli->set_charset("utf8mb4");

$id = $_POST['id'];
$id_usuario = $_SESSION['usuario_id'];

$stmt = $mysqli->prepare("DELETE FROM ofertas_temp WHERE id = ? AND id_usuario = ?");
$stmt->bind_param("ii", $id, $id_usuario);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>