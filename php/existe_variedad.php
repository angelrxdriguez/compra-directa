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

$variedad = $_POST["variedad"];

$stmt = $conn->prepare("SELECT COUNT(*) FROM variedades WHERE nombre = ?");
$stmt->bind_param("s", $variedad);
$stmt->execute();
$stmt->bind_result($existe);
$stmt->fetch();
$stmt->close();

echo json_encode(["existe" => $existe > 0]);

$conn->close();
?>
