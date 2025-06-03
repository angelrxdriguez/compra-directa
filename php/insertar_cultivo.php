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

$cultivo = $_POST["cultivo"] ?? "";

if ($cultivo !== "") {
    $stmt = $conn->prepare("INSERT INTO cultivos (nombre) VALUES (?)");
    $stmt->bind_param("s", $cultivo);
    $stmt->execute();
    $stmt->close();
}

echo json_encode(["success" => true]);
$conn->close();
?>
