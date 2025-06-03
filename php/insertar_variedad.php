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

$variedad = $_POST["variedad"] ?? "";

if ($variedad !== "") {
    $stmt = $conn->prepare("INSERT INTO variedades (nombre) VALUES (?)");
    $stmt->bind_param("s", $variedad);
    $stmt->execute();
    $stmt->close();
}

echo json_encode(["success" => true]);
$conn->close();
?>
