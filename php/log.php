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

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM usuarios WHERE nombre = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $usuario = $result->fetch_assoc();

    //(por ahora sin hash, pero recomendable usar hash en producción)
    if ($usuario['pass'] === $password) {
        $_SESSION['usuario'] = $usuario['nombre'];
        $_SESSION['tipo'] = $usuario['tipo'];

        if ($usuario['tipo'] === 'administrador') {
            header("Location: ../administrador.html");
            exit();
        } else {
            header("Location: ../index.html");
            exit();
        }
    } else {
        echo "Contraseña incorrecta.";
    }
} else {
    echo "Usuario no encontrado.";
}

$conn->close();
?>
