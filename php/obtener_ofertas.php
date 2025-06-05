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

$id_usuario = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : 0;

$sql = "
SELECT 
    o.id,
    o.articulo,
    o.variedad,
    o.cultivo,
    o.fecha,
    o.cajas,
    o.cajas - IFNULL(r_total.total_reservado, 0) AS disponible,
    IFNULL(r_total.total_reservado, 0) AS reservado,
    IFNULL(r_mias.cajas_reservadas, 0) AS mi_reserva
FROM 
    ofertas o
LEFT JOIN (
    SELECT id_oferta, SUM(cajas_reservadas) AS total_reservado
    FROM reservas
    GROUP BY id_oferta
) r_total ON r_total.id_oferta = o.id
LEFT JOIN (
    SELECT id_oferta, cajas_reservadas
    FROM reservas
    WHERE id_usuario = ?
) r_mias ON r_mias.id_oferta = o.id
ORDER BY o.id DESC
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
?>
