<?php
session_start();

if (isset($_SESSION['usuario']) && isset($_SESSION['tipo']) && isset($_SESSION['division'])) {
    echo json_encode([
        'nombre' => $_SESSION['usuario'],
        'tipo' => $_SESSION['tipo'],
        'division' => $_SESSION['division']
    ]);
} else {
    echo json_encode([
        'error' => 'No hay sesión activa'
    ]);
}
?>