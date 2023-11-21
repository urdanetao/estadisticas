
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/add-carrera.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="addCarreraBody">
    <div class="window">
        <div class="windowTitle">
            <h6>Agregar Carrera</h6>
        </div>
        <div class="windowBox">
            <div>
                <input type="text" class="txb" name="id" hidden>
                <input type="text" class="txb" name="idcab" hidden>
                <input type="text" class="txb" name="idjin" hidden>
            </div>
            <div>
                <fieldset>
                    <legend>Caballo Seleccionado</legend>
                    <div class="flex">
                        <div>
                            <div>
                                <span class="lbl">No.</span>
                            </div>
                            <div>
                                <input type="text" class="txb" name="numero" disabled>
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Ejemplar</span>
                            </div>
                            <div>
                                <input type="text" class="txb" name="nomcab" disabled>
                            </div>
                        </div>
                    </div>
                </fieldset>
                
                <div class="vsep10"></div>

                <fieldset>
                    <legend>Datos de la Carrera</legend>
                    <div class="flex">
                        <div>
                            <div>
                                <span class="lbl">Fecha</span>
                            </div>
                            <div>
                                <input type="date" class="txb" name="fecha">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Codigo</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-str" name="codigo" maxlength="5" autocomplete="off">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Distancia</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num m" name="distancia" maxlength="5" autocomplete="off">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Jinete</span>
                            </div>
                            <div class="flex">
                                <div class="search" functionName="txbJineteSearchText">
                                    <input type="text" class="txb txb-str" name="nomjin" maxlength="30" autocomplete="off">
                                </div>
                                <div class="hsep5"></div>
                                <button class="btn btn-primary mini-btn addCarreraJineteSearchButton">
                                    <span class="icon icon-search"></span>
                                </button>
                                <div class="hsep5"></div>
                                <button class="btn btn-info mini-btn addCarreraJineteAddButton">
                                    <span class="icon icon-plus"></span>
                                </button>
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Peso</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num d1" name="pesojin" maxlength="4" autocomplete="off">
                            </div>
                        </div>
                    </div>
                    <div class="vsep10"></div>
                    <div class="flex">
                        <div>
                            <div>
                                <span class="lbl">Dividendo</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num d2 m" name="dividendo" maxlength="10" autocomplete="off">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">P. 1000</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num" name="p1000" maxlength="2" autocomplete="off">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">P. 300</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num" name="p300" maxlength="2" autocomplete="off">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Llegó</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num" name="pfinal" maxlength="2" autocomplete="off">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Cpos.</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num d2" name="cuerpos" maxlength="5" autocomplete="off">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">T. Gan.</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num d2 m" name="tiempog" maxlength="6" autocomplete="off">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">T. Ejemp.</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num d2 m" name="tiempoe" maxlength="6" autocomplete="off">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">TTC</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num" name="rating" maxlength="2" autocomplete="off">
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <br>
            <div class="addCarrereButtons">
                <button class="btn btn-info addCarreraSaveButton">Guardar</button>
                <div class="hsep10"></div>
                <button class="btn btn-danger addCarreraCloseButton">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/add-carrera.js'; ?>
</script>
