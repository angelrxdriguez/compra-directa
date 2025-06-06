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

// Obtener todas las ofertas temporales del usuario
$stmt = $mysqli->prepare("SELECT articulo, variedad, cultivo, fecha, cajas FROM ofertas_temp WHERE id_usuario = ?");
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

$ofertas = [];
$variedades = [];
$cultivos = [];

while ($row = $result->fetch_assoc()) {
    $ofertas[] = $row;
    $variedades[] = $row['variedad'];
    $cultivos[] = $row['cultivo'];
}
$stmt->close();

// Filtrar únicos
$variedades = array_unique($variedades);
$cultivos = array_unique($cultivos);

// Insertar variedades que no existan
foreach ($variedades as $variedad) {
    $check = $mysqli->prepare("SELECT id FROM variedades WHERE nombre = ?");
    $check->bind_param("s", $variedad);
    $check->execute();
    $check->store_result();

    if ($check->num_rows === 0) {
        $insertVar = $mysqli->prepare("INSERT INTO variedades (nombre) VALUES (?)");
        $insertVar->bind_param("s", $variedad);
        $insertVar->execute();
        $insertVar->close();
    }
    $check->close();
}

// Insertar cultivos que no existan
foreach ($cultivos as $cultivo) {
    $check = $mysqli->prepare("SELECT id FROM cultivos WHERE nombre = ?");
    $check->bind_param("s", $cultivo);
    $check->execute();
    $check->store_result();

    if ($check->num_rows === 0) {
        $insertCult = $mysqli->prepare("INSERT INTO cultivos (nombre) VALUES (?)");
        $insertCult->bind_param("s", $cultivo);
        $insertCult->execute();
        $insertCult->close();
    }
    $check->close();
}

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

echo json_encode([
    "success" => $exito,
    "error" => $exito ? null : $errorMensaje
]);
