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
$articulo = $_POST['articulo'];
$variedad = $_POST['variedad'];
$cultivo = $_POST['cultivo'];
$fecha = $_POST['fecha'];
$cajas = $_POST['cajas'];

$stmt = $mysqli->prepare("UPDATE ofertas_temp SET articulo=?, variedad=?, cultivo=?, fecha=?, cajas=? WHERE id=? AND id_usuario=?");
$stmt->bind_param("ssssdii", $articulo, $variedad, $cultivo, $fecha, $cajas, $id, $_SESSION['usuario_id']);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$mysqli->close();
