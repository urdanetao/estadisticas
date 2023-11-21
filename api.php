<?php
	// Si no se establecio el id del procedimiento en los parametros POST.
	if (!isset($_POST['idProc'])) {
		die();
	}

	// Toma el id del procedimiento.
	$idProc = $_POST['idProc'];

	// Si hay parametros adicionales.
	if (isset($_POST['jsonParams'])) {
		$jsonParams = $_POST['jsonParams'];
	} else {
		$jsonParams = '';
	}

	// Establece la respuesta por defecto.
	$response['status'] = false;
	$response['message'] = "Funcion no definida";

	// 
	// Incluye las librerias basicas.
	// 
	require_once __DIR__ . "/common.php";

	// Escapa los caracteres especiales.
	$jsonParams = escapeChars($jsonParams);

	// Libreria.
	require_once __DIR__ . '/apicode.php';
	require_once __DIR__ . '/apialgo.php';

	// 
	// Evalua el idProc en la libreria del sistema.
	// 

	switch ($idProc) {
		// Funciones generales de la api.
		case 'isOnline':
			$response = isOnline();
			break;
		
		// Prepara los datos del reporte.
		case 'prepare-report':
			$response = prepareReport($jsonParams);
			break;
		
		// Lee los ultimos 5 registros.
		case 'getLast5Records':
			$response = getLast5Records($jsonParams);
			break;

		// Carga las jornadas registradas en el sistema.
		case 'jornadasLoad':
			$response = jornadasLoad();
			break;

		// Carga las competencias registradas en una jornada.
		case 'competenciasLoad':
			$response = competenciasLoad($jsonParams);
			break;
		
		// Carga los datos de una competencia completa.
		case 'competenciasDetalleLoad':
			$response = competenciasDetalleLoad($jsonParams);
			break;

		// Guarda una jornada.
		case 'jornadasSave':
			$response = jornadasSave($jsonParams);
			break;

		// Guarda una jornada.
		case 'jornadasDelete':
			$response = jornadasDelete($jsonParams);
			break;

		// Guarda una competencia.
		case 'competenciasSave':
			$response = competenciasSave($jsonParams);
			break;

		// Elimina una competencia.
		case 'competenciasDelete':
			$response = competenciasDelete($jsonParams);
			break;

		// Busca un caballo.
		case 'caballosSearch':
			$response = caballosSearch($jsonParams);
			break;
		
		// Carga el registro de un caballo.
		case 'caballosLoad':
			$response = caballosLoad($jsonParams);
			break;

		// Guarda el registro de un caballo.
		case 'caballosSave':
			$response = caballosSave($jsonParams);
			break;

		// Elimina el registro de un caballo.
		case 'caballosDelete':
			$response = caballosDelete($jsonParams);
			break;

		// Busca un jinete.
		case 'jinetesSearch':
			$response = jinetesSearch($jsonParams);
			break;
		
		// Carga el registro de un jinete.
		case 'jinetesLoad':
			$response = jinetesLoad($jsonParams);
			break;

		// Guarda el registro de un caballo.
		case 'jinetesSave':
			$response = jinetesSave($jsonParams);
			break;

		// Elimina un jinete.
		case 'jinetesDelete':
			$response = jinetesDelete($jsonParams);
			break;

		// Busca un preparador.
		case 'preparadoresSearch':
			$response = preparadoresSearch($jsonParams);
			break;
		
		// Elimina un preparador.
		case 'preparadoresDelete':
			$response = preparadoresDelete($jsonParams);
			break;
		
		// Carga el registro de un preparador.
		case 'preparadoresLoad':
			$response = preparadoresLoad($jsonParams);
			break;

		// Guarda el registro de un preparador.
		case 'preparadoresSave':
			$response = preparadoresSave($jsonParams);
			break;

		// Guarda el detalle de una competencia.
		case 'detalleCompetenciaSave':
			$response = detalleCompetenciaSave($jsonParams);
			break;

		// Elimina el detalle de una competencia.
		case 'detalleCompetenciaDelete':
			$response = detalleCompetenciaDelete($jsonParams);
			break;

		// Guarda una carrera.
		case 'carrerasSave':
			$response = carrerasSave($jsonParams);
			break;

		// Elimina una carrera.
		case 'carrerasDelete':
			$response = carrerasDelete($jsonParams);
			break;
		
		// Busca una carrera por fecha y por codigo.
		case 'seekCarrera':
			$response = seekCarrera($jsonParams);
			break;
		
		// Busca el nombre de un caballo por texto.
		case 'caballosSearchText':
			$response = caballosSearchText($jsonParams);
			break;

		// Carga el registro de un algoritmo.
		case 'algoLoad':
			$response = algoLoad($jsonParams);
			break;

		// Guarda el registro de un algoritmo.
		case 'algoSave':
			$response = algoSave($jsonParams);
			break;

		// Elimina el registro de un algoritmo.
		case 'algoDelete':
			$response = algoDelete($jsonParams);
			break;

		// Busca un algoritmo.
		case 'algoSearch':
			$response = algoSearch($jsonParams);
			break;

		// Ejecuta un algoritmo.
		case 'algoExec':
			$response = algoExec($jsonParams);
			break;
		
		// Guarda los valores para omitir.
		case 'omitirSave':
			$response = omitirSave($jsonParams);
			break;

		// Guarda el ganador de una competencia.
		case 'ganadorSave':
			$response = ganadorSave($jsonParams);
			break;

		// Inserta o actualiza los valores de la carrera actual.
		case 'generarResultados':
			$response = generarResultados($jsonParams);
			break;

		// Carga la informacion de terceros.
		case 'addInfoTercerosLoad':
			$response = addInfoTercerosLoad($jsonParams);
			break;

		// Guarda la informacion de terceros.
		case 'addInfoTercerosSave':
			$response = addInfoTercerosSave($jsonParams);
			break;

		// Elimina la informacion de terceros.
		case 'addInfoTercerosDelete':
			$response = addInfoTercerosDelete($jsonParams);
			break;
		
		// Busca el historico de carreras para un ejemplar.
		case 'historicoLoad':
			$response = historicoLoad($jsonParams);
			break;
	}
	
	$jsonData = json_encode($response, JSON_INVALID_UTF8_IGNORE + JSON_UNESCAPED_UNICODE);
	echo($jsonData);
?>
