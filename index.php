<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Required meta tags. -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="CodigoWeb.net - Casa de Software">
    <meta name="author" content="Oscar Urdaneta">

    <!-- Evita el cache (Solo para Produccion) -->
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="Last-Modified" content="0">
    <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
    <meta http-equiv="Pragma" content="no-cache">

    <!-- Hojas de estilos. -->
    <link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="./css/iziToast.min.css">
    <link rel="stylesheet" type="text/css" href="./css/icons.css">
    <link rel="stylesheet" type="text/css" href="./css/common.css">
    <link rel="stylesheet" type="text/css" href="./css/core.css">

    <link rel="icon" href="#">
    <title translate="no">Estadisticas</title>

    <!-- Javascript. -->
    <script type="text/javascript" src="./js/jquery-3.5.1.min.js"></script>
    <script type="text/javascript" src="./js/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="./js/iziToast.min.js"></script>
    <script type="text/javascript" src="./js/uuid.min.js"></script>
    <script type="text/javascript" src="./js/qrcode.js"></script>
    <script type="text/javascript" src="./js/chart.min.js"></script>
</head>

<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/index.css'; ?>
</style>

<body>

    <!-- Core. -->
    <script>
        <?php include __DIR__ . '/js/core.js'; ?>

        var core = new Core();
    </script>

    <!-- Cuerpo principal. -->
    <div class="main-content">
        <!-- Header. -->
        <div class="main-header">
            <div class="mh-left-side">
                <div class="title">
                    <span translate="no">Sistema de Estadisticas</span>
                </div>
                <div class="sub-title">
                    <span translate="no">J-00000000-0</span>
                </div>
            </div>
            <div class="mh-right-side">
                <div class="title">
                    <span translate="no">Estadisticas</span>
                </div>
            </div>
        </div>

        <!-- Area de trabajo principal. -->
        <div class="main-work-area">
            <!-- Incluye la pagina de inicio. -->
            <?php
                include __DIR__ . '/start.php';
            ?>
        </div>
    </div>
</body>
</html>
