<?php
session_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$conn = new mysqli("localhost", "root", "", "demanda");
$conn->set_charset("utf8mb4");

if (!isset($_FILES['archivo_excel']) || $_FILES['archivo_excel']['error'] !== 0) {
    die("Archivo no válido.");
}

$archivo = $_FILES['archivo_excel']['tmp_name'];

if (($handle = fopen($archivo, "r")) !== false) {
    $cabecera = fgetcsv($handle, 1000, ";");
    if ($cabecera && isset($cabecera[0])) {
        $cabecera[0] = preg_replace('/^\xEF\xBB\xBF/', '', $cabecera[0]); // Limpiar BOM si hay
    }

    while (($datos = fgetcsv($handle, 1000, ";")) !== false) {
        if (count($datos) < 5) continue;

        [$articulo, $variedad, $cultivo, $fecha, $cajas] = array_map('trim', $datos);

        if (!$articulo || !$fecha || !$cajas || !is_numeric($cajas)) continue;

        $fecha_mysql = DateTime::createFromFormat('d/m/Y', $fecha);
        if (!$fecha_mysql) continue;
        $fecha = $fecha_mysql->format('Y-m-d');

        try {
            $stmt = $conn->prepare("INSERT INTO ofertas (articulo, variedad, cultivo, fecha, cajas) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssd", $articulo, $variedad, $cultivo, $fecha, $cajas);
            $stmt->execute();
        } catch (Exception $e) {
            // Podrías guardar en un log si quieres: error_log("Error: " . $e->getMessage());
            continue;
        }
    }

    fclose($handle);
}

$conn->close();
header("Location: ../comprador.html");
exit;
