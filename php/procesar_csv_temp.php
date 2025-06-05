<?php
session_start();

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no iniciada."]);
    exit;
}

$id_usuario = $_SESSION['usuario_id'];

if ($_FILES['archivo_excel']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["error" => "Error al subir el archivo."]);
    exit;
}

$archivo = $_FILES['archivo_excel']['tmp_name'];
$contenido = file_get_contents($archivo);
$lineas = explode(PHP_EOL, $contenido);

// Saltar cabecera
array_shift($lineas);

$mysqli = new mysqli("localhost", "root", "", "demanda");
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida: " . $mysqli->connect_error]);
    exit;
}

$insertadas = 0;
foreach ($lineas as $linea) {
    if (trim($linea) === '') continue;

    $campos = str_getcsv($linea, ";");

    if (count($campos) < 5) continue;

    list($articulo, $variedad, $cultivo, $fecha, $cajas) = array_map('trim', $campos);

    // Transformar fecha si está en formato d/m/Y
    $fecha_mysql = DateTime::createFromFormat('d/m/Y', $fecha);
    if (!$fecha_mysql) continue;
    $fecha = $fecha_mysql->format('Y-m-d');

    $stmt = $mysqli->prepare("
        INSERT INTO ofertas_temp (articulo, variedad, cultivo, fecha, cajas, id_usuario)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("ssssdi", $articulo, $variedad, $cultivo, $fecha, $cajas, $id_usuario);
    if ($stmt->execute()) {
        $insertadas++;
    }
    $stmt->close();
}


$mysqli->close();

echo json_encode(["success" => true, "insertadas" => $insertadas]);
?>
