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

$id_usuario = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : 0;

$sql = "
SELECT 
    o.id,
    o.articulo,
    o.variedad,
    o.cultivo,
    o.fecha,
    o.cajas,
    o.cajas - IFNULL(SUM(r2.cajas_reservadas), 0) AS disponible,
    IFNULL(SUM(r2.cajas_reservadas), 0) AS reservado,
    r1.cajas_reservadas AS mi_reserva
FROM 
    ofertas o
LEFT JOIN reservas r1 ON r1.id_oferta = o.id AND r1.id_usuario = ?
LEFT JOIN reservas r2 ON r2.id_oferta = o.id
GROUP BY o.id
ORDER BY o.fecha DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

$ofertas = [];
while ($row = $result->fetch_assoc()) {
    $ofertas[] = $row;
}

header('Content-Type: application/json');
echo json_encode($ofertas);
