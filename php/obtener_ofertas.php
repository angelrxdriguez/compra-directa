<?php
session_start();
header('Content-Type: application/json');

$host = "localhost";
$db = "demanda";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

$id_usuario = $_SESSION['usuario'] ?? null;

$sql = "
SELECT o.*, 
       o.cajas - IFNULL(SUM(r.cajas_reservadas), 0) AS disponible,
       IFNULL(SUM(r.cajas_reservadas), 0) AS reservado,
       (SELECT cajas_reservadas FROM reservas WHERE id_usuario = ? AND id_oferta = o.id) AS mi_reserva
FROM ofertas o
LEFT JOIN reservas r ON r.id_oferta = o.id
GROUP BY o.id
ORDER BY o.fecha DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

$ofertas = [];
while ($row = $result->fetch_assoc()) {
    $row['mi_reserva'] = $row['mi_reserva'] !== null ? (float) $row['mi_reserva'] : null;
    $ofertas[] = $row;
}

echo json_encode($ofertas);
$stmt->close();
$conn->close();
