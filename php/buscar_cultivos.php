<?php
$host = "localhost";
$db = "demanda";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Error conexión: " . $conn->connect_error);
}

$termino = $_GET['term'] ?? '';

$sql = "SELECT nombre FROM cultivos WHERE nombre LIKE ?";
$stmt = $conn->prepare($sql);
$likeTerm = "%$termino%";
$stmt->bind_param("s", $likeTerm);
$stmt->execute();
$result = $stmt->get_result();

$sugerencias = [];
while ($row = $result->fetch_assoc()) {
    $sugerencias[] = $row['nombre'];
}

header('Content-Type: application/json');
echo json_encode($sugerencias);
?>
