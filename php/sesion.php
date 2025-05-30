<?php
session_start();

if (isset($_SESSION['usuario_id'], $_SESSION['usuario_nombre'], $_SESSION['tipo'], $_SESSION['division'])) {
    echo json_encode([
        'id' => $_SESSION['usuario_id'],
        'nombre' => $_SESSION['usuario_nombre'],
        'tipo' => $_SESSION['tipo'],
        'division' => $_SESSION['division']
    ]);
} else {
    echo json_encode(['error' => 'No hay sesión activa']);
}


?>