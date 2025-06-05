<?php
header('Content-Type: application/json');
$mysqli = new mysqli("localhost", "root", "", "demanda");
$mysqli->set_charset("utf8mb4");

$result = $mysqli->query("SELECT * FROM ofertas_temp ORDER BY id DESC");

$ofertas = [];
while ($row = $result->fetch_assoc()) {
    $ofertas[] = $row;
}

echo json_encode($ofertas);
