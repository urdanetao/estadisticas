<?php
	require_once __DIR__ . '/mysql-data-manager.php';

	define('__mysql_host', 'localhost');
	define('__mysql_prefix', '');
	define('__mysql_user', 'root');
	define('__mysql_pwd', 'admin');
	
	// Configuración de conexión a MySQL.
	function getMySqlDbInfo($dbName) {
		$dbInfo = array();
		$dbInfo['host'] = __mysql_host;
		$dbInfo['prefix'] = __mysql_prefix;
		$dbInfo['dbname'] = $dbName;
		$dbInfo['user'] = __mysql_user;
		$dbInfo['pwd'] = __mysql_pwd;

		return $dbInfo;
	}

	/**
	 * Devuelve true en señal de que el server esta en linea.
	 */
    function isOnline() {
        return getResultObject(true, '');
    }

	/**
	 * Guarda los datos del reporte en la sesion del usuario.
	 */
	function prepareReport($jsonParams) {
		$_SESSION['reportData'] = $jsonParams;
		return getResultObject(true, "");
	}

	/**
	 * Devuelve los ultimos 5 registros de una tabla.
	 */
	function getLast5Records($jsonParams) {
		// Valida los parametros.
		if (!isset($jsonParams['tableName'])) {
			return getResultObject(false, "getLast5Records: No se indico: 'tableName'");
		}

		$tableName = $jsonParams['tableName'];

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand = "select t.* from  $tableName as t order by t.id desc limit 5";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, '', $result);
	}

	/**
	 * Carga las jornadas registradas en el sistema.
	 */
	function jornadasLoad() {
		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand = "select t.* from jornadas as t order by t.fecha desc";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, '', $result);
	}

	/**
	 * Carga las competencias registradas en una jornada.
	 */
	function competenciasLoad($jsonParams) {
		$idJornada = $jsonParams['idJornada'];
		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand =
			"select
				t.id,
				t.idparent,
				t.carrera,
				t.descrip,
				t.fecha,
				t.codigo,
				t.distancia,
				t.omitir,
				t.ganador,
				coalesce(c.nombre, '') as nombreganador
			from
				competencias as t
				left join caballos as c
				on c.id = t.ganador
			where
				t.idparent = '$idJornada'
			order by
				t.carrera";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, '', $result);
	}

	/**
	 * Carga los datos de una competencia completa.
	 */
	function competenciasDetalleLoad($jsonParams) {
		$idcomp = $jsonParams['id'];

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Busca el registro de la competencia.
		$sqlCommand =
			"select
				t.*,
				coalesce(c.nombre, '') as nombreganador
			from
				competencias as t
				left join caballos as c
				on c.id = t.ganador
			where
				t.id = '$idcomp';";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) == 0) {
			$conn->Close();
			return getResultObject(false, 'No se encontró el registro de la competencia');
		}

		$fecha = $result[0]['fecha'];
		$distancia = $result[0]['distancia'];

		// Caballos de una carrera (Cabecera).
		$sqlCommand =
			"select
				t.numero,
				t.id as id,
				t.idparent,
				t.idcab,
				c.nombre as nomcab,
				t.idjin,
				j.nombre as nomjin,
				t.pesojin,
				t.efectividadjin,
				t.idprep,
				p.nombre as nomprep,
				t.puntos
			from
				dcompetencias as t
				left join caballos as c
				on c.id = t.idcab
				left join jinetes as j
				on j.id = t.idjin
				left join preparadores as p
				on p.id = t.idprep
			where
				t.idparent = '$idcomp'
			order by
				t.numero";

		$r = $conn->Query($sqlCommand);

		if ($r === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Busca el tiempo y el rating promedio para cada ejemplar en la distancia.
		for ($i = 0; $i < count($r); $i++) {
			$idcab = $r[$i]['idcab'];
			$calculadoConOtrasDistancias = false;

			$sqlCommand =
				"select
					t.*
				from
					carreras as t
				where
					t.idcab = '$idcab' and
					t.distancia = '$distancia' and
					t.rating <> 0 and
					t.fecha < '$fecha'
				order by
					t.fecha";
			$temp = $conn->Query($sqlCommand);

			if ($temp === false) {
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			$totalTiempo = 0;
			$totalCarreras = 0;
			$totalRating = 0;
			for ($k = 0; $k < count($temp); $k++) {
				$tiempoe = 0;

				// Si no tiene tiempo del ejemplar.
				if (floatval($temp[$k]['tiempoe']) == 0) {
					// Si no tiene posicion final.
					if (intval($temp[$k]['pfinal']) == 0) {
						$temp[$k]['pfinal'] = 12;
					}

					// Si no tiene cuerpos.
					if (intval($temp[$k]['cuerpos']) == 0) {
						$temp[$k]['cuerpos'] = 12;
					}

					$temp[$k]['tiempoe'] = floatval($temp[$k]['tiempog']) + (($temp[$k]['pfinal'] + $temp[$k]['cuerpos']) / 5);
					$tiempoe = $temp[$k]['tiempoe'];
				} else {
					$tiempoe = floatval($temp[$k]['tiempoe']);
				}

				// Acumula el tiempo y el rating.
				$totalTiempo += $tiempoe;
				$totalRating += intval($temp[$k]['rating']);
				$totalCarreras++;
			}

			if ($totalCarreras > 0) {
				$totalTiempo /= $totalCarreras;
				$totalRating /= $totalCarreras;
			} else {
				/**
				 * Si el totalTiempo == 0 el caballo no tiene carreras en la distanca.
				 * 
				 * Se calcula el tiempo en base a 200 metros mas y 200 metros menos a la
				 * distancia de la carrera.
				 */
				
				$min = intval($distancia) - 200;
				$max = intval($distancia) + 200;
				$sqlCommand =
					"select
						t.*
					from
						carreras as t
					where
						t.idcab = '$idcab' and
						t.distancia >= '$min' and
						t.distancia <= '$max' and
						t.rating <> 0 and
						t.fecha < '$fecha'
					order by
						t.fecha";
				$temp = $conn->Query($sqlCommand);
	
				if ($temp === false) {
					$conn->Close();
					return getResultObject(false, $conn->GetErrorMessage());
				}
	
				$totalTiempo = 0;
				$totalCarreras = 0;
				$totalRating = 0;
				for ($k = 0; $k < count($temp); $k++) {
					$tiempoe = 0;
	
					// Si no tiene tiempo del ejemplar.
					if (floatval($temp[$k]['tiempoe']) == 0) {
						// Si no tiene posicion final.
						if (intval($temp[$k]['pfinal']) == 0) {
							$temp[$k]['pfinal'] = 12;
						}
	
						// Si no tiene cuerpos.
						if (intval($temp[$k]['cuerpos']) == 0) {
							$temp[$k]['cuerpos'] = 12;
						}
	
						$temp[$k]['tiempoe'] = floatval($temp[$k]['tiempog']) + (($temp[$k]['pfinal'] + $temp[$k]['cuerpos']) / 5);
						$tiempoe = $temp[$k]['tiempoe'];
					} else {
						$tiempoe = floatval($temp[$k]['tiempoe']);
					}
	
					// Lleva el tiempo a la distancia.
					$tiempoe = ($tiempoe * intval($distancia)) / intval($temp[$k]['distancia']);
	
					// Acumula el tiempo y el rating.
					$totalTiempo += $tiempoe;
					$totalRating += intval($temp[$k]['rating']);
					$totalCarreras++;
				}
	
				if ($totalCarreras > 0) {
					$totalTiempo /= $totalCarreras;
					$totalRating /= $totalCarreras;
					$calculadoConOtrasDistancias = true;
				}
			}

			$r[$i]['tiempo'] = $totalTiempo;
			$r[$i]['tcalc'] = $calculadoConOtrasDistancias;
			$r[$i]['rating'] = $totalRating;
			
			/**
			 * Dias sin correr.
			 */
			$sqlCommand =
				"select
					t.*
				from
					carreras as t
				where
					t.idcab = '$idcab' and
					t.fecha < '$fecha'
				order by
					t.fecha desc
				limit 1";
			$lastRace = $temp = $conn->Query($sqlCommand);

			if ($lastRace === false) {
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			$dias = '';
			if (count($temp) != 0) {
				$f1 = new DateTime($fecha);
				$f2 = new DateTime($lastRace[0]['fecha']);
				$dias = strval(getDaysBetween2Dates($f1, $f2, false)) . ' dias';
			}

			$r[$i]['diassincorrer'] = $dias;
		}

		// 4 ultimas competencias de cada caballo.
		$d = array();
		$di = 0;

		for ($i = 0; $i < count($r); $i++) {
			$idcab = $r[$i]['idcab'];

			$sqlCommand =
				"select
					t.*
				from
					(select
						t.*,
						c.nombre as nomcab,
						j.nombre as nomjin
					from
						carreras as t
						left join caballos as c
						on c.id = t.idcab
						left join jinetes as j
						on j.id = t.idjin
					where
						t.idcab = '$idcab' and
						t.fecha < '$fecha'
					order by
						t.fecha desc
					limit 4) as t
				order by
					t.fecha";

			$row = $conn->Query($sqlCommand);
	
			if ($row === false) {
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			$d[$di] = $row;
			$di++;
		}

		// Busca los 5 mejores tiempos registrados para la distancia.
		$sqlCommand =
			"select
				t.fecha,
				t.distancia,
				t.idcab,
				c.nombre as nomcab,
				t.idjin,
				j.nombre as nomjin,
				t.tiempog,
				t.rating
			from
				carreras as t
				left join caballos as c
				on c.id = t.idcab
				left join jinetes as j
				on j.id = t.idjin
			where
				t.distancia = '$distancia' and
				t.pfinal = '1' and
				t.tiempog > 0
			order by
				t.tiempog
			limit 5";
		$mt = $conn->Query($sqlCommand);

		if ($mt === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($mt) == 0) {
			$mt[0]['fecha'] = '';
			$mt[0]['idcab'] = '';
			$mt[0]['nomcab'] = '';
			$mt[0]['idjin'] = '';
			$mt[0]['nomjin'] = '';
			$mt[0]['tiempog'] = '';
			$mt[0]['rating'] = '';
		}
		if (count($mt) == 1) {
			$mt[1]['fecha'] = '';
			$mt[1]['idcab'] = '';
			$mt[1]['nomcab'] = '';
			$mt[1]['idjin'] = '';
			$mt[1]['nomjin'] = '';
			$mt[1]['tiempog'] = '';
			$mt[1]['rating'] = '';
		}
		if (count($mt) == 2) {
			$mt[2]['fecha'] = '';
			$mt[2]['idcab'] = '';
			$mt[2]['nomcab'] = '';
			$mt[2]['idjin'] = '';
			$mt[2]['nomjin'] = '';
			$mt[2]['tiempog'] = '';
			$mt[2]['rating'] = '';
		}
		if (count($mt) == 3) {
			$mt[3]['fecha'] = '';
			$mt[3]['idcab'] = '';
			$mt[3]['nomcab'] = '';
			$mt[3]['idjin'] = '';
			$mt[3]['nomjin'] = '';
			$mt[3]['tiempog'] = '';
			$mt[3]['rating'] = '';
		}
		if (count($mt) == 4) {
			$mt[4]['fecha'] = '';
			$mt[4]['idcab'] = '';
			$mt[4]['nomcab'] = '';
			$mt[4]['idjin'] = '';
			$mt[4]['nomjin'] = '';
			$mt[4]['tiempog'] = '';
			$mt[4]['rating'] = '';
		}

		// Busca el ganador con el peor tiempo registrado para la distancia.
		$sqlCommand =
			"select
				t.fecha,
				t.distancia,
				t.idcab,
				c.nombre as nomcab,
				t.idjin,
				j.nombre as nomjin,
				t.tiempog,
				t.rating
			from
				carreras as t
				left join caballos as c
				on c.id = t.idcab
				left join jinetes as j
				on j.id = t.idjin
			where
				t.distancia = '$distancia' and
				t.pfinal = '1' and
				t.tiempog > 0
			order by
				t.tiempog desc
			limit 2";
		$pt = $conn->Query($sqlCommand);

		if ($pt === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($pt) == 0) {
			$pt[0]['fecha'] = '';
			$pt[0]['idcab'] = '';
			$pt[0]['nomcab'] = '';
			$pt[0]['idjin'] = '';
			$pt[0]['nomjin'] = '';
			$pt[0]['tiempog'] = '';
			$pt[0]['rating'] = '';
		}
		if (count($pt) == 1) {
			$pt[1]['fecha'] = '';
			$pt[1]['idcab'] = '';
			$pt[1]['nomcab'] = '';
			$pt[1]['idjin'] = '';
			$pt[1]['nomjin'] = '';
			$pt[1]['tiempog'] = '';
			$pt[1]['rating'] = '';
		}

		$conn->Close();

		$data['r'] = $r;
		$data['d'] = $d;
		$data['e']['id'] = $result[0]['id'];
		$data['e']['fecha'] = $fecha;
		$data['e']['distancia'] = $result[0]['distancia'];
		$data['e']['omitir'] = $result[0]['omitir'];
		$data['e']['ganador'] = $result[0]['ganador'];
		$data['e']['nombreganador'] = $result[0]['nombreganador'];
		$data['mt'] = $mt;
		$data['pt'] = $pt;

		return getResultObject(true, '', $data);
	}

	/**
	 * Guarda una jornada.
	 */
	function jornadasSave($jsonParams) {
		$id = $jsonParams['id'];
		$fecha = $jsonParams['fecha'];
		$descrip = $jsonParams['descrip'];

		// Valida los parametros.
		if ($fecha == '') {
			return getResultObject(false, 'Debe especificar una fecha');
		}

		if ($descrip == '') {
			return getResultObject(false, 'Debe indicar una descripción');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no existe otra jornada para la misma fecha con la misma descripcion.
		$sqlCommand = "select t.* from jornadas as t where t.fecha = '$fecha' and t.descrip = '$descrip'";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe una jornada para esta fecha con la misma descipción');
		}

		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from jornadas as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into jornadas (
					id, fecha, descrip)
				values (
					'$id', '$fecha', '$descrip');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update jornadas set
					fecha = '$fecha',
					descrip = '$descrip'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro guardado con exito');
	}

	/**
	 * Elimina una jornada y todas sus competencias.
	 */
	function jornadasDelete($jsonParams) {
		$id = $jsonParams['id'];

		if ($id == '') {
			return getResultObject(false, 'Debe seleccionar una jornada');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Busca las competencias de la jornada.
		$sqlCommand = "select t.* from competencias as t where t.idparent = '$id'";
		$competencias = $conn->Query($sqlCommand);

		if ($competencias === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Recorre las competencias.
		for ($i = 0; $i < count($competencias); $i++) {
			$idcomp = $competencias[$i]['id'];

			// Elimina el detalle de las competencias de la jornada.
			$sqlCommand = "delete from dcompetencias where idparent = '$idcomp'";
			if ($conn->Query($sqlCommand) === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			// Elimina la competencia.
			$sqlCommand = "delete from competencias where id = '$idcomp'";
			if ($conn->Query($sqlCommand) === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}
		}

		// Elimina la jornada.
		$sqlCommand = "delete from jornadas where id = '$id'";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}

	/**
	 * Guarda una competencia.
	 */
	function competenciasSave($jsonParams) {
		$id = $jsonParams['id'];
		$idparent = $jsonParams['idparent'];
		$carrera = $jsonParams['carrera'];
		$descrip = $jsonParams['descrip'];
		$fecha = $jsonParams['fecha'];
		$codigo = $jsonParams['codigo'];
		$distancia = $jsonParams['distancia'];

		// Valida los parametros.
		if ($idparent == '0') {
			return getResultObject(false, 'No hay clave del objeto padre');
		}

		if ($carrera == '') {
			return getResultObject(false, 'Debe especificar una carrera');
		}

		if ($descrip == '') {
			return getResultObject(false, 'Debe indicar una descripción');
		}

		if ($fecha == '') {
			return getResultObject(false, 'Debe especificar una fecha');
		}

		if ($codigo == '') {
			return getResultObject(false, 'Debe indicar el codigo de la carrera');
		}

		if (intval($distancia) == 0) {
			return getResultObject(false, 'Debe especificar la distancia');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no exista otra competencia con el mismo numero.
		$sqlCommand = "select t.* from competencias as t where t.idparent = '$idparent' and t.carrera = '$carrera'";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe una competencia con este mismo numero de carrera');
		}

		// Valida que no exista una carrera para la misma fecha con el mismo codigo.
		$sqlCommand = "select t.* from competencias as t where t.fecha = '$fecha' and t.codigo = '$codigo'";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe una competencia registrada para esta fecha con este codigo');
		}

		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from competencias as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into competencias (
					id, idparent, carrera, descrip, fecha, codigo, distancia)
				values (
					'$id', '$idparent', '$carrera', '$descrip', '$fecha', '$codigo', '$distancia');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update competencias set
					carrera = '$carrera',
					descrip = '$descrip',
					fecha = '$fecha',
					codigo = '$codigo',
					distancia = '$distancia'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$data['idcomp'] = $id;
		return getResultObject(true, 'Registro guardado con exito', $data);		
	}

	/**
	 * Elimina una competencia.
	 */
	function competenciasDelete($jsonParams) {
		$idcomp = $jsonParams['id'];

		if ($idcomp == '') {
			return getResultObject(false, 'Sin id del objeto padre');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Elimina el detalle de la competencia.
		$sqlCommand = "delete from dcompetencias where idparent = '$idcomp';";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Elimina la competencia.
		$sqlCommand = "delete from competencias where id = '$idcomp';";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}

	/**
	 * Busca un caballo.
	 */
    function caballosSearch($jsonParams) {
        $textToFind = $jsonParams['textToFind'];
        
		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "select t.* from caballos as t where t.nombre like '%$textToFind%' order by t.nombre";
        $cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        $msg = strval(count($cursor)) . ' Registros encontrados';
        return getResultObject(true, $msg, $cursor);
    }

	/**
	 * Busca un jinete.
	 */
    function jinetesSearch($jsonParams) {
        $textToFind = $jsonParams['textToFind'];
        
		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "select t.* from jinetes as t where t.nombre like '%$textToFind%' order by t.nombre";
        $cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        $msg = strval(count($cursor)) . ' Registros encontrados';
        return getResultObject(true, $msg, $cursor);
    }

	/**
	 * Busca un preparador.
	 */
    function preparadoresSearch($jsonParams) {
        $textToFind = $jsonParams['textToFind'];
        
		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "select t.* from preparadores as t where t.nombre like '%$textToFind%' order by t.nombre";
        $cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        $msg = strval(count($cursor)) . ' Registros encontrados';
        return getResultObject(true, $msg, $cursor);
    }

	/**
	 * Carga el registro de un caballo.
	 */
	function caballosLoad($jsonParams) {
		$id = $jsonParams['id'];

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Caballos de una carrera (Cabecera).
		$sqlCommand =
			"select
				t.*
			from
				caballos as t
			where
				t.id = '$id';";
		$r = $conn->Query($sqlCommand);

		if ($r === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		if (count($r) > 0) {
			$r = $r[0];
		}

		return getResultObject(true, '', $r);
	}

	/**
	 * Carga el registro de un jinete.
	 */
	function jinetesLoad($jsonParams) {
		$id = $jsonParams['id'];

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Caballos de una carrera (Cabecera).
		$sqlCommand =
			"select
				t.*
			from
				jinetes as t
			where
				t.id = '$id';";
		$r = $conn->Query($sqlCommand);

		if ($r === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		if (count($r) > 0) {
			$r = $r[0];
		}

		return getResultObject(true, '', $r);
	}

	/**
	 * Carga el registro de un preparador.
	 */
	function preparadoresLoad($jsonParams) {
		$id = $jsonParams['id'];

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Caballos de una carrera (Cabecera).
		$sqlCommand =
			"select
				t.*
			from
				preparadores as t
			where
				t.id = '$id';";
		$r = $conn->Query($sqlCommand);

		if ($r === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		if (count($r) > 0) {
			$r = $r[0];
		}

		return getResultObject(true, '', $r);
	}

	/**
	 * Guarda el detalle de una competencia.
	 */
	function detalleCompetenciaSave($jsonParams) {
		$id = $jsonParams['id'];
		$idparent = $jsonParams['idparent'];
		$numero = $jsonParams['numero'];
		$idcab = $jsonParams['idcab'];
		$nomcab = $jsonParams['nomcab'];
		$idjin = $jsonParams['idjin'];
		$nomjin = $jsonParams['nomjin'];
		$pesojin = $jsonParams['pesojin'];
		$efectividadjin = $jsonParams['efectividadjin'];
		$idprep = $jsonParams['idprep'];
		$nomprep = $jsonParams['nomprep'];
		$puntos = $jsonParams['puntos'];

		if ($idparent == '') {
			return getResultObject(false, 'No hay clave del registro padre');
		}
		if ($numero == '') {
			return getResultObject(false, 'Debe indicar el numero de la carrera');
		}
		if ($nomcab == '') {
			return getResultObject(false, 'Debe indicar un ejemplar');
		}
		if ($nomjin == '') {
			return getResultObject(false, 'Debe indicar un jinete');
		}
		if (intval($pesojin) == 0) {
			return getResultObject(false, 'Debe indicar el peso del jinete');
		}
		if ($nomprep == '') {
			return getResultObject(false, 'Debe indicar un preparador');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$message = '';

		// Valida el caballo.
		$sqlCommand = "select t.* from caballos as t where t.nombre = '$nomcab'";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Si no existe lo agrega.
		if (count($result) == 0) {
			$sqlCommand = "select t.id from caballos as t order by t.id desc limit 1";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}
			
			if (count($result) == 0) {
				$idcab = 1;
			} else {
				$idcab = intval($result[0]['id']) + 1;
			}

			$sqlCommand = "insert into caballos (id, nombre) values ('$idcab', '$nomcab')";
			if ($conn->Query($sqlCommand) === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			$message .= "Se agregó el caballo: $nomcab con exito<br>";
		} else {
			$idcab = $result[0]['id'];
		}

		// Valida el jinete.
		$sqlCommand = "select t.* from jinetes as t where t.nombre = '$nomjin'";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Si no existe lo agrega.
		if (count($result) == 0) {
			$sqlCommand = "select t.id from jinetes as t order by t.id desc limit 1";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}
			
			if (count($result) == 0) {
				$idjin = 1;
			} else {
				$idjin = intval($result[0]['id']) + 1;
			}

			$sqlCommand = "insert into jinetes (id, nombre) values ('$idjin', '$nomjin')";
			if ($conn->Query($sqlCommand) === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			$message .= "Se agregó el jinete: $nomjin con exito<br>";
		} else {
			$idjin = $result[0]['id'];
		}

		// Valida el preparador.
		$sqlCommand = "select t.* from preparadores as t where t.nombre = '$nomprep'";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Si no existe lo agrega.
		if (count($result) == 0) {
			$sqlCommand = "select t.id from preparadores as t order by t.id desc limit 1";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}
			
			if (count($result) == 0) {
				$idprep = 1;
			} else {
				$idprep = intval($result[0]['id']) + 1;
			}

			$sqlCommand = "insert into preparadores (id, nombre) values ('$idprep', '$nomprep')";
			if ($conn->Query($sqlCommand) === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			$message .= "Se agregó el preparador: $nomprep con exito<br>";
		} else {
			$idprep = $result[0]['id'];
		}

		// Valida que no exista otro detalle de competencia con el mismo numero, caballo o jinete.
		$sqlCommand =
			"select
				t.*
			from
				dcompetencias as t
			where
				t.idparent = '$idparent' and
				(t.numero = '$numero' or t.idcab = '$idcab' or t.idjin = '$idjin')";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe una registro con la misma posicion, caballo o jinete');
		}

		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from dcompetencias as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into dcompetencias (
					id, idparent, numero, idcab, idjin, pesojin,
					efectividadjin, idprep, puntos)
				values (
					'$id', '$idparent', '$numero', '$idcab', '$idjin', '$pesojin',
					'$efectividadjin', '$idprep', '$puntos');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update dcompetencias set
					numero = '$numero',
					idcab = '$idcab',
					idjin = '$idjin',
					pesojin = '$pesojin',
					efectividadjin = '$efectividadjin',
					idprep = '$idprep',
					puntos = '$puntos'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$message .= 'Registro guardado con exito';

		return getResultObject(true, $message);
	}

	/**
	 * Guarda el registro de un caballo.
	 */
	function caballosSave($jsonParams) {
		$id = $jsonParams['id'];
		$nombre = $jsonParams['nombre'];

		if ($nombre == '') {
			return getResultObject(false, 'Debe indicar el nombre del caballo');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no exista otro detalle de competencia con el mismo numero, caballo o jinete.
		$sqlCommand =
			"select
				t.*
			from
				caballos as t
			where
				t.nombre = '$nombre'";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe una registro este mismo nombre');
		}

		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from caballos as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into caballos (
					id, nombre)
				values (
					'$id', '$nombre');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update caballos set
					nombre = '$nombre'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$data['id'] = $id;
		return getResultObject(true, 'Registro guardado con exito', $data);
	}

	/**
	 * Elimina un caballo.
	 */
	function caballosDelete($jsonParams) {
		$id = $jsonParams['id'];

		if ($id == '') {
			return getResultObject(false, 'Sin codigo de registro');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand = "delete from caballos where id = '$id'";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}

	/**
	 * Guarda el registro de un jinete.
	 */
	function jinetesSave($jsonParams) {
		$id = $jsonParams['id'];
		$nombre = $jsonParams['nombre'];

		if ($nombre == '') {
			return getResultObject(false, 'Debe indicar el nombre del jinete');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no exista otro detalle de competencia con el mismo numero, caballo o jinete.
		$sqlCommand =
			"select
				t.*
			from
				jinetes as t
			where
				t.nombre = '$nombre'";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe una registro este mismo nombre');
		}

		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from jinetes as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into jinetes (
					id, nombre)
				values (
					'$id', '$nombre');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update jinetes set
					nombre = '$nombre'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$data['id'] = $id;
		return getResultObject(true, 'Registro guardado con exito', $data);
	}

	/**
	 * Elimina un jinete.
	 */
	function jinetesDelete($jsonParams) {
		$id = $jsonParams['id'];

		if ($id == '') {
			return getResultObject(false, 'Sin codigo de registro');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand = "delete from jinetes where id = '$id'";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}

	/**
	 * Guarda el registro de un preparador.
	 */
	function preparadoresSave($jsonParams) {
		$id = $jsonParams['id'];
		$nombre = $jsonParams['nombre'];

		if ($nombre == '') {
			return getResultObject(false, 'Debe indicar el nombre del preparador');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no exista otro detalle de competencia con el mismo numero, caballo o jinete.
		$sqlCommand =
			"select
				t.*
			from
				preparadores as t
			where
				t.nombre = '$nombre'";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe una registro este mismo nombre');
		}

		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from preparadores as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into preparadores (
					id, nombre)
				values (
					'$id', '$nombre');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update preparadores set
					nombre = '$nombre'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$data['id'] = $id;
		return getResultObject(true, 'Registro guardado con exito', $data);
	}

	/**
	 * Elimina un preparador.
	 */
	function preparadoresDelete($jsonParams) {
		$id = $jsonParams['id'];

		if ($id == '') {
			return getResultObject(false, 'Sin codigo de registro');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand = "delete from preparadores where id = '$id'";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}

	/**
	 * Elimina el detalle de una competencia.
	 */
	function detalleCompetenciaDelete($jsonParams) {
		$id = $jsonParams['id'];

		if ($id == '') {
			return getResultObject(false, 'Sin id de competencia');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Elimina el detalle de la competencia.
		$sqlCommand = "delete from dcompetencias where id = '$id'";

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}

	/**
	 * Guarda una carrera.
	 */
	function carrerasSave($jsonParams) {
		$id = $jsonParams['id'];
		$codigo = $jsonParams['codigo'];
		$fecha = $jsonParams['fecha'];
		$idcab = $jsonParams['idcab'];
		$distancia = $jsonParams['distancia'];
		$idjin = $jsonParams['idjin'];
		$nomjin = $jsonParams['nomjin'];
		$pesojin = $jsonParams['pesojin'];
		$dividendo = $jsonParams['dividendo'];
		$p1000 = $jsonParams['p1000'];
		$p300 = $jsonParams['p300'];
		$pfinal = $jsonParams['pfinal'];
		$cuerpos = $jsonParams['cuerpos'];
		$tiempog = $jsonParams['tiempog'];
		$tiempoe = $jsonParams['tiempoe'];
		$rating = $jsonParams['rating'];

		if ($fecha == '') {
			return getResultObject(false, 'Debe indicar la fecha de la carrera');
		}
		if ($codigo == '') {
			return getResultObject(false, 'Debe indicar el codigo de la carrera');
		}
		if ($idcab == '') {
			return getResultObject(false, 'No se cargó el codigo del ejemplar');
		}
		if (intval($distancia) == 0) {
			return getResultObject(false, 'Debe indicar la distancia de la competencia');
		}
		if (floatval($pesojin) == 0) {
			return getResultObject(false, 'Debe indicar el peso del jinete');
		}
		if (floatval($tiempog) == 0) {
			return getResultObject(false, 'Indique el tiempo del ganador');
		}

		if (floatval($tiempoe) > 0 && floatval($tiempoe) < floatval($tiempog)) {
			return getResultObject(false, 'El tiempo del ejemplar no puede ser menor al tiempo del ganador');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$message = '';

		// Valida el jinete.
		$sqlCommand = "select t.* from jinetes as t where t.nombre = '$nomjin'";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Si no existe lo agrega.
		if (count($result) == 0) {
			$sqlCommand = "select t.id from jinetes as t order by t.id desc limit 1";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}
			
			if (count($result) == 0) {
				$idjin = 1;
			} else {
				$idjin = intval($result[0]['id']) + 1;
			}

			$sqlCommand = "insert into jinetes (id, nombre) values ('$idjin', '$nomjin')";
			if ($conn->Query($sqlCommand) === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			$message .= "Se agregó el jinete: $nomjin con exito<br>";
		} else {
			$idjin = $result[0]['id'];
		}

		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from carreras as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into carreras (
					id, codigo, fecha, idcab, distancia,
					idjin, pesojin, dividendo, p1000, p300, pfinal,
					cuerpos, tiempog, tiempoe, rating)
				values (
					'$id', '$codigo', '$fecha', '$idcab', '$distancia',
					'$idjin', '$pesojin', '$dividendo', '$p1000', '$p300', '$pfinal',
					'$cuerpos', '$tiempog', '$tiempoe', '$rating');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update carreras set
					codigo = '$codigo',
					fecha = '$fecha',
					idcab = '$idcab',
					distancia = '$distancia',
					idjin = '$idjin',
					pesojin = '$pesojin',
					dividendo = '$dividendo',
					p1000 = '$p1000',
					p300 = '$p300',
					pfinal = '$pfinal',
					cuerpos = '$cuerpos',
					tiempog = '$tiempog',
					tiempoe = '$tiempoe',
					rating = '$rating'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$message .= 'Registro guardado con exito';

		return getResultObject(true, $message);
	}

	/**
	 * Elimina una carrera.
	 */
	function carrerasDelete($jsonParams) {
		$id = $jsonParams['id'];

		if ($id == '') {
			return getResultObject(false, 'Sin codigo de carrera');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Elimina el detalle de la competencia.
		$sqlCommand = "delete from carreras where id = '$id'";

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}

	/**
	 * Carga el registro de un algoritmo.
	 */
	function algoLoad($jsonParams) {
		$id = $jsonParams['id'];

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Realiza la consulta.
		$sqlCommand =
			"select
				t.*
			from
				algo as t
			where
				t.id = '$id';";
		$r = $conn->Query($sqlCommand);

		if ($r === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		if (count($r) > 0) {
			$r = $r[0];
		}

		return getResultObject(true, '', $r);
	}

	/**
	 * Guarda el registro de un algoritmo.
	 */
	function algoSave($jsonParams) {
		$id = $jsonParams['id'];
		$nombre = $jsonParams['nombre'];
		$descrip = $jsonParams['descrip'];
		$fn = $jsonParams['fn'];

		if ($nombre == '') {
			return getResultObject(false, 'Debe indicar el nombre del algoritmo');
		}

		if ($fn == '') {
			return getResultObject(false, 'Debe indicar la funcion del algoritmo');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no exista otro algoritmo con el mismo nombre.
		$sqlCommand =
			"select
				t.*
			from
				algo as t
			where
				t.nombre = '$nombre'";
		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) > 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe una registro este mismo nombre');
		}

		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from algo as t order by t.id desc limit 1;";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Agrega el nuevo registro.
			$sqlCommand =
				"insert into algo (
					id, nombre, descrip, fn)
				values (
					'$id', '$nombre', '$descrip', '$fn');";
		} else {
			// Actualiza el registro.
			$sqlCommand =
				"update algo set
					nombre = '$nombre',
					descrip = '$descrip',
					fn = '$fn'
				where
					id = '$id'";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$data['id'] = $id;
		return getResultObject(true, 'Registro guardado con exito', $data);
	}

	/**
	 * Elimina un algoritmo.
	 */
	function algoDelete($jsonParams) {
		$id = $jsonParams['id'];

		if ($id == '') {
			return getResultObject(false, 'Sin codigo de registro');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand = "delete from algo where id = '$id'";
		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}

	/**
	 * Busca un algoritmo.
	 */
    function algoSearch($jsonParams) {
        $textToFind = $jsonParams['textToFind'];
        
		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "select t.* from algo as t where t.nombre like '%$textToFind%' order by t.nombre";
        $cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        $msg = strval(count($cursor)) . ' Registros encontrados';
        return getResultObject(true, $msg, $cursor);
    }

	/**
	 * Ejecuta un algoritmo.
	 */
	function algoExec($jsonParams) {
		$idalgo = $jsonParams['idalgo'];
		$idcomp = $jsonParams['idcomp'];

		if ($idalgo == '') {
			return getResultObject(false, 'Debe seleccionar un algoritmo');
		}

		// Carga el registro del algoritmo.
		$params['id'] = $idalgo;
		$algo = algoLoad($params);

		if (!$algo['status']) {
			return $algo;
		}

		$algo = $algo['data'];

		// Ejecuta la funcion asignada al algoritmo.
		$fn = $algo['fn'];
		$result = $fn($idcomp);

		return $result;
	}

	/**
	 * Busca una carrera por fecha y codigo que tenga registrado el
	 * tiempo del ganador.
	 */
	function seekCarrera($jsonParams) {
		$fecha = $jsonParams['fecha'];
		$codigo = $jsonParams['codigo'];

		if ($fecha == '' || $codigo == '') {
			return getResultObject(false, 'Falta la fecha o el codigo de la carrera');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "select
				t.*
			from
				carreras as t
			where
				t.fecha = '$fecha' and
				t.codigo = '$codigo' and
				t.tiempog > '0'
			limit 1";
        $cursor = $conn->Query($sqlCommand);

		if ($cursor === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        return getResultObject(true, '', $cursor);
	}

	/**
	 * Guarda los numero de ejemplares a omitir en una carrera.
	 */
	function omitirSave($jsonParams) {
		$idcomp = $jsonParams['idcomp'];
		$omitir = $jsonParams['omitir'];

		if ($idcomp == '0') {
			return getResultObject(false, 'No hay id de competencia');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        $sqlCommand =
            "update competencias set omitir = '$omitir' where id = '$idcomp'";

		if ($conn->Query($sqlCommand) === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        return getResultObject(true, 'Registro guardado con exito');
	}

	/**
	 * Guarda el ganador de una competencia.
	 */
	function ganadorSave($jsonParams) {
		$idcomp = $jsonParams['idcomp'];
		$nombreganador = $jsonParams['nombreganador'];

		if ($idcomp == '0') {
			return getResultObject(false, 'No hay id de competencia');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que el caballo se encuentre registrado.
		$ganador = 0;
		if ($nombreganador != '') {
			$sqlCommand = "select t.id from caballos as t where t.nombre = '$nombreganador'";
	
			$result = $conn->Query($sqlCommand);
	
			if ($result === false) {
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$conn->Close();
				return getResultObject(false, 'Nombre de ejemplar no registrado');
			}

			$ganador = $result[0]['id'];
		}

		// Valida que el ganador este registrado en la carrera.
		if ($ganador != 0) {
			$sqlCommand = "select t.* from dcompetencias as t where t.idparent = '$idcomp'";
			$result = $conn->Query($sqlCommand);
	
			if ($result === false) {
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}
	
			$found = false;
			for ($i = 0; $i < count($result); $i++) {
				if ($result[$i]['idcab'] == $ganador) {
					$found = true;
					break;
				}
			}
	
			if (!$found) {
				$conn->Close();
				return getResultObject(false, 'El ejemplar indicado no pertenece a la carrera');
			}
		}

		// Actualiza el registro.
        $sqlCommand =
            "update competencias set ganador = '$ganador' where id = '$idcomp'";

		if ($conn->Query($sqlCommand) === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

        return getResultObject(true, 'Registro guardado con exito');
	}

	/**
	 * Inserta o actualiza los datos de la carrera actual para cada ejemplar.
	 */
	function generarResultados($jsonParams) {
		$fecha = $jsonParams['r']['fecha'];
		$codigo = $jsonParams['r']['codigo'];
		$distancia = $jsonParams['r']['distancia'];

		$d = $jsonParams['d'];

		if ($fecha == '' || $codigo == '' || intval($distancia) == 0) {
			return getResultObject(false, 'No hay una carrera seleccionada');
		}

		if (count($d) == 0) {
			return getResultObject(false, 'No hay ejemplares registrados en la carrera');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Recorre la lista de ejemplares insertando o actualizando los valores.
		for ($i = 0; $i < count($d); $i++) {
			// Toma los datos.
			$idcab = $d[$i]['idcab'];
			$idjin = $d[$i]['idjin'];
			$pesojin = $d[$i]['pesojin'];

			// Busca si la carrera ya fue registrada.
			$sqlCommand =
				"select
					t.id
				from
					carreras as t
				where
					t.fecha = '$fecha' and
					t.codigo = '$codigo' and
					t.idcab = '$idcab';";
			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			// Si no esta registrada.
			if (count($result) == 0) {
				// Busca el siguiente correlativo.
				$sqlCommand = "select t.id from carreras as t order by t.id desc limit 1";

				$result = $conn->Query($sqlCommand);

				if ($result === false) {
					$conn->Query('rollback;');
					$conn->Close();
					return getResultObject(false, $conn->GetErrorMessage());
				}

				if (count($result) == 0) {
					$id = 1;
				} else {
					$id = intval($result[0]['id']) + 1;
				}

				// Inserta el registro.
				$sqlCommand =
					"insert into carreras (
						id, codigo, fecha, idcab, distancia, idjin,
						pesojin, dividendo, p1000, p300, pfinal,
						cuerpos, tiempog, tiempoe, rating
					) values (
						'$id', '$codigo', '$fecha', '$idcab', '$distancia', '$idjin',
						'$pesojin', '0', '0', '0', '0',
						'0', '0', '0', '0'
					);";
			} else {
				// Actualiza los valores del registro.
				$sqlCommand =
					"update carreras set
						distancia = '$distancia',
						idjin = '$idjin',
						pesojin = '$pesojin'
					where
						fecha = '$fecha' and
						codigo = '$codigo' and
						idcab = '$idcab';";
			}

			if ($conn->Query($sqlCommand) === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Carreras generadas con exito');
	}


	/**
	 * Carga la informacion de terceros.
	 */
	function addInfoTercerosLoad($jsonParams) {
		$idjor = $jsonParams['idjor'];

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$sqlCommand = "select t.* from infoterceros as t where t.idjor = '$idjor' order by t.id";
		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, '', $result);
	}


	/**
	 * Guarda la informacion de terceros.
	 */
	function addInfoTercerosSave($jsonParams) {
		$id = $jsonParams['id'];
		$idjor = $jsonParams['idjor'];
		$nombre = $jsonParams['nombre'];
		$c1 = $jsonParams['c1'];
		$c2 = $jsonParams['c2'];
		$c3 = $jsonParams['c3'];
		$c4 = $jsonParams['c4'];
		$c5 = $jsonParams['c5'];
		$c6 = $jsonParams['c6'];
		$c1id = $jsonParams['c1id'];
		$c2id = $jsonParams['c2id'];
		$c3id = $jsonParams['c3id'];
		$c4id = $jsonParams['c4id'];
		$c5id = $jsonParams['c5id'];
		$c6id = $jsonParams['c6id'];

		// Valida los campos requeridos.
		if ($idjor == '') {
			return getResultObject(false, 'Sin codigo de jornada');
		}

		if ($nombre == '') {
			return getResultObject(false, 'Debe indicar el nombre del pronosticador');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no exista otro registro con este mismo pronosticador.
		$sqlCommand = "select t.id from infoterceros as t where t.idjor = '$idjor' and t.nombre = '$nombre'";

		if ($id != '') {
			$sqlCommand .= " and t.id <> '$id'";
		}

		$result = $conn->Query($sqlCommand);

		if ($result === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		if (count($result) != 0) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, 'Ya existe un registro para este pronosticador');
		}

		// Si es un nuevo registro.
		if ($id == '') {
			// Busca el siguiente correlativo.
			$sqlCommand = "select t.id from infoterceros as t order by t.id desc limit 1";

			$result = $conn->Query($sqlCommand);

			if ($result === false) {
				$conn->Query('rollback;');
				$conn->Close();
				return getResultObject(false, $conn->GetErrorMessage());
			}

			if (count($result) == 0) {
				$id = 1;
			} else {
				$id = intval($result[0]['id']) + 1;
			}

			// Inserta el registro.
			$sqlCommand =
				"insert into infoterceros (
					id, idjor, nombre, c1, c2, c3, c4, c5, c6,
					c1id, c2id, c3id, c4id, c5id, c6id
				) values (
					'$id', '$idjor', '$nombre', '$c1', '$c2', '$c3', '$c4', '$c5', '$c6',
					'$c1id', '$c2id', '$c3id', '$c4id', '$c5id', '$c6id'
				);";
		} else {
			// Actualiza los valores del registro.
			$sqlCommand =
				"update infoterceros set
					nombre = '$nombre',
					c1 = '$c1',
					c2 = '$c2',
					c3 = '$c3',
					c4 = '$c4',
					c5 = '$c5',
					c6 = '$c6',
					c1id = '$c1id',
					c2id = '$c2id',
					c3id = '$c3id',
					c4id = '$c4id',
					c5id = '$c5id',
					c6id = '$c6id'
				where
					id = '$id';";
		}

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro guardado con exito');
	}


	/**
	 * Elimina la informacion de terceros.
	 */
	function addInfoTercerosDelete($jsonParams) {
		$id = $jsonParams['id'];

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Inicia la transaccion.
		if ($conn->Query('start transaction;') === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Valida que no exista otro registro con este mismo pronosticador.
		$sqlCommand = "delete from infoterceros where id = '$id'";

		if ($conn->Query($sqlCommand) === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Finaliza la transaccion.
		if ($conn->Query('commit;') === false) {
			$conn->Query('rollback;');
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		return getResultObject(true, 'Registro eliminado con exito');
	}


	/**
	 * Busca el historico de carreras para un ejemplar.
	 */
	function historicoLoad($jsonParams) {
		$idcab = $jsonParams['idcab'];
		$distancia = intval($jsonParams['distancia']);

		if ($idcab == '') {
			return getResultObject(false, 'Debe seleccionar un ejemplar');
		}

		$dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}

		// Busca todas las carreras para el ejemplar seleccionado.
		$sqlCommand =
			"select
				t.*,
				c.nombre as nomcab,
				j.nombre as nomjin
			from
				carreras as t
				left join caballos as c
				on c.id = t.idcab
				left join jinetes as j
				on j.id = t.idjin
			where
				t.idcab = '$idcab'";
		
		// Si especificaron una distancia.
		if ($distancia > 0) {
			$sqlCommand .= "and t.distancia = '$distancia' ";
		}

		$sqlCommand .=
			"order by
				t.fecha";
		$data = $conn->Query($sqlCommand);

		if ($data === false) {
			$conn->Close();
			return getResultObject(false, $conn->GetErrorMessage());
		}

		$conn->Close();

		$i = count($data);
		$msg = "$i Registros encontrados";

		return getResultObject(true, $msg, $data);
	}
?>
