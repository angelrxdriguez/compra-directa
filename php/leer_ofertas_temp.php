<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["error" => "Sesión no iniciada"]);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];

$mysqli = new mysqli("localhost", "root", "", "demanda");
$mysqli->set_charset("utf8mb4");

// Obtener cultivos y variedades existentes
$cultivos_existentes = [];
$variedades_existentes = [];

$res_cultivos = $mysqli->query("SELECT nombre FROM cultivos");
while ($row = $res_cultivos->fetch_assoc()) {
    $cultivos_existentes[] = $row['nombre'];
}

$res_variedades = $mysqli->query("SELECT nombre FROM variedades");
while ($row = $res_variedades->fetch_assoc()) {
    $variedades_existentes[] = $row['nombre'];
}

$stmt = $mysqli->prepare("SELECT * FROM ofertas_temp WHERE id_usuario = ? ORDER BY id DESC");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$ofertas = [];
while ($row = $result->fetch_assoc()) {
    $row['nuevo_cultivo'] = !in_array($row['cultivo'], $cultivos_existentes);
    $row['nueva_variedad'] = !in_array($row['variedad'], $variedades_existentes);
    $ofertas[] = $row;
}

$stmt->close();
$mysqli->close();

echo json_encode($ofertas);
