<?php
session_start();
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["success" => false, "error" => "Sesión no iniciada"]);
    exit;
}

$mysqli = new mysqli("localhost", "root", "", "demanda");
$mysqli->set_charset("utf8mb4");

$id_usuario = $_SESSION['usuario_id'];

// Obtener las ofertas temporales del usuario
$query = "SELECT articulo, variedad, cultivo, fecha, cajas FROM ofertas_temp WHERE id_usuario = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

$ofertas = [];
while ($row = $result->fetch_assoc()) {
    $ofertas[] = $row;
}
$stmt->close();

// Insertar en la tabla definitiva
$insert = $mysqli->prepare("INSERT INTO ofertas (articulo, variedad, cultivo, fecha, cajas) VALUES (?, ?, ?, ?, ?)");
$exito = true;
$errorMensaje = "";

foreach ($ofertas as $oferta) {
    $insert->bind_param(
        "ssssd",
        $oferta['articulo'],
        $oferta['variedad'],
        $oferta['cultivo'],
        $oferta['fecha'],
        $oferta['cajas']
    );
    if (!$insert->execute()) {
        $exito = false;
        $errorMensaje = $insert->error;
        break;
    }
}
$insert->close();

// Si todo fue bien, borrar temporales
if ($exito) {
    $delete = $mysqli->prepare("DELETE FROM ofertas_temp WHERE id_usuario = ?");
    $delete->bind_param("i", $id_usuario);
    $delete->execute();
    $delete->close();
}

$mysqli->close();

// Respuesta final
echo json_encode([
    "success" => $exito,
    "error" => $exito ? null : $errorMensaje
]);
