<?php
    /**
     * Constantes.
     */
    define('__cuerpos_por_segundo', 5.2);

    /**
     * Tiempo base.
     */
    function tiempoBase($idcomp) {
        $dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        // Toma la lista de ejemplares de la carrera.
        $params['id'] = $idcomp;
        $data = competenciasDetalleLoad($params);

        if (!$data['status']) {
            return $data;
        }

        // Apunta a los datos.
        $data = $data['data'];

        // Valida si debe omitir una lista especifica.
        $omitirStr = $data['e']['omitir'];
        $omitir = array();

        if ($omitirStr != '') {
            $omitir = getOmitirArray($omitirStr);
            if ($omitir === false) {
                $conn->Close();
                return getResultObject(false, 'La lista de elementos a omitir contiene un error');
            }
        }

        $result = array();
        $ri = 0;
        $tiempo = 0;

        // Recorre la lista de ejemplares.
        $r = $data['r'];
        for ($i = 0; $i < count($r); $i++) {
            // Si debe omitir el ejemplar.
            if (count($omitir) > 0) {
                $found = false;
                for ($x = 0; $x < count($omitir); $x++) {
                    if ($r[$i]['numero'] == $omitir[$x]) {
                        $found = true;
                        break;
                    }
                }
                if ($found) {
                    continue;
                }
            }

            // Recorre las 4 ultimas carreras del ejemplar.
            $d = $data['d'][$i];
            $tiempoTotal = 0;
            $carreras = 0;
            for ($j = 0; $j < count($d); $j++) {
                // Calcula el tiempo para el ejemplar.
                $tiempo = floatval($d[$j]['tiempoe']);
                $cuerpos = 20;

                // Si no tiene tiempo.
                if ($tiempo == 0) {
                    // Si llegó de primero toma la posicion del ganador.
                    if (intval($d[$j]['pfinal']) == 1) {
                        $tiempo = floatval($d[$j]['tiempog']);
                    } else {
                        if (floatval($d[$j]['cuerpos']) > 0) {
                            $cuerpos = floatval($d[$j]['cuerpos']);
                        }
                        $tiempo = floatval($d[$j]['tiempog']) + ($cuerpos / __cuerpos_por_segundo);
                    }
                }

                $tiempoTotal += ($tiempo * intval($data['e']['distancia'])) / intval($d[$j]['distancia']);
                $carreras++;
            }

            if ($carreras > 0) {
                $tiempo = $tiempoTotal / $carreras;
            } else {
                $tiempo = 0;
            }

            // Agrega el ejemplar.
            $result[$ri] = $r[$i];
            $result[$ri]['valor'] = $tiempo;
            $ri++;
        }
        
		$conn->Close();

        // Ordena el resultado.
        $aux = array();
        foreach ($result as $key => $row) {
            $aux[$key] = $row['valor'];
        }
        array_multisort($aux, SORT_ASC, $result);

        return getResultObject(true, 'Algoritmo ejecutado con exito', $result);
    }

    /**
     * Ratings.
     */
    function ratings($idcomp) {
        $dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        // Toma la lista de ejemplares de la carrera.
        $params['id'] = $idcomp;
        $data = competenciasDetalleLoad($params);

        if (!$data['status']) {
            return $data;
        }

        // Apunta a los datos.
        $data = $data['data'];

        // Valida si debe omitir una lista especifica.
        $omitirStr = $data['e']['omitir'];
        $omitir = array();

        if ($omitirStr != '') {
            $omitir = getOmitirArray($omitirStr);
            if ($omitir === false) {
                $conn->Close();
                return getResultObject(false, 'La lista de elementos a omitir contiene un error');
            }
        }

        $result = array();
        $ri = 0;
        $ratingMinimo = 50;
        $rating = 0;

        // Recorre la lista de ejemplares.
        $r = $data['r'];
        for ($i = 0; $i < count($r); $i++) {
            // Si debe omitir el ejemplar.
            if (count($omitir) > 0) {
                $found = false;
                for ($x = 0; $x < count($omitir); $x++) {
                    if ($r[$i]['numero'] == $omitir[$x]) {
                        $found = true;
                        break;
                    }
                }
                if ($found) {
                    continue;
                }
            }

            $d = $data['d'][$i];

            // Toma el ultimo rating del ejemplar.
            if (count($data['d'][$i]) == 0) {
                $rating = 0;
            } else {
                $rating = intval($data['d'][$i][count($data['d'][$i]) - 1]['rating']);
            }
            
            // Agrega el ejemplar.
            $result[$ri] = $r[$i];
            $result[$ri]['valor'] = intval($rating);
            $ri++;
        }
        
		$conn->Close();

        // Ordena el resultado.
        $aux = array();
        foreach ($result as $key => $row) {
            $aux[$key] = $row['valor'];
        }
        array_multisort($aux, SORT_DESC, $result);

        return getResultObject(true, 'Algoritmo ejecutado con exito', $result);
    }

    /**
     * Algoritmo BARD IA.
     */
    function bard($idcomp) {
        $dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        // Toma la lista de ejemplares de la carrera.
        $params['id'] = $idcomp;
        $data = competenciasDetalleLoad($params);

        if (!$data['status']) {
            return $data;
        }

        // Apunta a los datos.
        $data = $data['data'];

        // Valida si debe omitir una lista especifica.
        $omitirStr = $data['e']['omitir'];
        $omitir = array();

        if ($omitirStr != '') {
            $omitir = getOmitirArray($omitirStr);
            if ($omitir === false) {
                $conn->Close();
                return getResultObject(false, 'La lista de elementos a omitir contiene un error');
            }
        }

        $result = array();
        $ri = 0;
        $tiempo = 0;

        // Recorre la lista de ejemplares.
        $r = $data['r'];
        for ($i = 0; $i < count($r); $i++) {
            // Si debe omitir el ejemplar.
            if (count($omitir) > 0) {
                $found = false;
                for ($x = 0; $x < count($omitir); $x++) {
                    if ($r[$i]['numero'] == $omitir[$x]) {
                        $found = true;
                        break;
                    }
                }
                if ($found) {
                    continue;
                }
            }

            // Recorre las 4 ultimas carreras del ejemplar.
            $d = $data['d'][$i];
            $tiempoG = 0;
            $tiempoE = 0;
            $distancia = 0;
            $carreras = 0;
            $totalPFinal = 0;
            for ($j = 0; $j < count($d); $j++) {
                // Calcula el tiempo para el ejemplar.
                $tiempo = floatval($d[$j]['tiempoe']);
                $cuerpos = 20;

                // Si no tiene tiempo.
                if ($tiempo == 0) {
                    // Si llegó de primero toma la posicion del ganador.
                    if (intval($d[$j]['pfinal']) == 1) {
                        $tiempo = floatval($d[$j]['tiempog']);
                    } else {
                        if (floatval($d[$j]['cuerpos']) > 0) {
                            $cuerpos = floatval($d[$j]['cuerpos']);
                        }
                        $tiempo = floatval($d[$j]['tiempog']) + ($cuerpos / __cuerpos_por_segundo);
                    }
                }

                // Si el caballo no llego de primero.
                if (intval($d[$j]['pfinal']) > 1) {
                    $tiempo += ($cuerpos / __cuerpos_por_segundo);
                }

                // Acumula los cuerpos por llegada.
                $totalPFinal += intval($d[$j]['pfinal']);

                // Acumula los tiempos del ganador, del ejemplar y las distancias.
                $tiempoG += floatval($d[$j]['tiempog']);
                $tiempoE += $tiempo;
                $distancia += intval($d[$j]['distancia']);

                $carreras++;
            }

            if ($carreras > 0) {
                $tiempo = (($tiempoG + $tiempoE) - (intval($r[$i]['efectividadjin']) / 10)) * intval($data['e']['distancia']);
                $distancia *= 2;
                $tiempo = $tiempo / $distancia;
                $tiempo += ($totalPFinal);
            } else {
                $tiempoG = 0;
                $tiempoE = 0;
                $distancia = 0;
            }

            // Agrega el ejemplar.
            $result[$ri] = $r[$i];
            $result[$ri]['valor'] = $tiempo;
            $ri++;
        }
        
		$conn->Close();

        // Ordena el resultado.
        $aux = array();
        foreach ($result as $key => $row) {
            $aux[$key] = $row['valor'];
        }
        array_multisort($aux, SORT_ASC, $result);

        return getResultObject(true, 'Algoritmo ejecutado con exito', $result);
    }

    /**
     * Ratings 2.
     */
    function ratings2($idcomp) {
        $dbInfo = getMySqlDbInfo('estadisticas');
		$conn = new MySqlDataManager($dbInfo);

		if (!$conn->IsConnected()) {
			return getResultObject(false, $conn->GetErrorMessage());
		}
		
        // Toma la lista de ejemplares de la carrera.
        $params['id'] = $idcomp;
        $data = competenciasDetalleLoad($params);

        if (!$data['status']) {
            return $data;
        }

        // Apunta a los datos.
        $data = $data['data'];

        // Valida si debe omitir una lista especifica.
        $omitirStr = $data['e']['omitir'];
        $omitir = array();

        if ($omitirStr != '') {
            $omitir = getOmitirArray($omitirStr);
            if ($omitir === false) {
                $conn->Close();
                return getResultObject(false, 'La lista de elementos a omitir contiene un error');
            }
        }

        $result = array();
        $ri = 0;

        // Recorre la lista de ejemplares.
        $r = $data['r'];
        for ($i = 0; $i < count($r); $i++) {
            // Si debe omitir el ejemplar.
            if (count($omitir) > 0) {
                $found = false;
                for ($x = 0; $x < count($omitir); $x++) {
                    if ($r[$i]['numero'] == $omitir[$x]) {
                        $found = true;
                        break;
                    }
                }
                if ($found) {
                    continue;
                }
            }

            $d = $data['d'][$i];
            $count = 0;
            $totalRating = 0;

            // Recorre las carreras del ejemplar.
            for ($k = 0; $k < count($d); $k++) {
                // Toma la llegada, los cuerpos y el rating.
                $pfinal = intval($d[$k]['pfinal']);
                $cuerpos = floatval($d[$k]['cuerpos']);
                $rating = intval($d[$k]['rating']);

                // Si debe omitir la carrera por falta de datos.
                if ($pfinal == 0 || ($cuerpos == 0 && $pfinal > 1) || $rating == 0) {
                    continue;
                }

                if ($pfinal > 1 || $pfinal != $cuerpos) {
                    $z = ($cuerpos - $pfinal) * -1;
                    $rating += $z;
                }

                $totalRating += $rating;
                $count++;
            }

            if ($count > 1) {
                $totalRating /= $count;
            }
            
            // Agrega el ejemplar.
            $result[$ri] = $r[$i];
            $result[$ri]['valor'] = round($totalRating, 0);
            $ri++;
        }
        
		$conn->Close();

        // Ordena el resultado.
        $aux = array();
        foreach ($result as $key => $row) {
            $aux[$key] = $row['valor'];
        }
        array_multisort($aux, SORT_DESC, $result);

        return getResultObject(true, 'Algoritmo ejecutado con exito', $result);
    }

    /**
     * Recupera la lista de elementos a omitir.
     */
    function getOmitirArray($str) {
        $list = explode('-', $str);
        $result = array();
        $ri = 0;

        // Recorre el arreglo.
        for ($i = 0; $i < count($list); $i++) {
            // Si esta vacio o no es un numero.
            if (!inRange($list[$i], '0', '9')) {
                return false;
            }
            $result[$ri] = $list[$i];
            $ri++;
        }

        return $result;
    }
?>
