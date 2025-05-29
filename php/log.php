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

    // Verificación simple de contraseña (sin hash aún)
    if ($usuario['pass'] === $password) {
        $_SESSION['usuario'] = $usuario['nombre'];
        $_SESSION['tipo'] = $usuario['tipo'];
        $_SESSION['division'] = $usuario['division'];

        // Redirección según tipo de usuario
        switch ($usuario['tipo']) {
            case 'administrador':
                header("Location: ../admin.html");
                break;
            case 'comprador':
                header("Location: ../comprador.html");
                break;
            case 'comercial':
                header("Location: ../comercial.html");
                break;
            case 'almacen':
                header("Location: ../almacen.html");
                break;
            default:
                header("Location: ../index.html"); // Fallback
        }
        exit();
    } else {
        echo "Contraseña incorrecta.";
    }
} else {
    echo "Usuario no encontrado.";
}

$conn->close();
?>
