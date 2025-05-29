<?php
$host = "localhost";
$db = "demanda";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "SELECT id, articulo, variedad, cultivo, fecha, cajas, disponible, reservado FROM ofertas ORDER BY fecha DESC";
$result = $conn->query($sql);

$ofertas = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $ofertas[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($ofertas);
?>
