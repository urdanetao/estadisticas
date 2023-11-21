
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/add-detalle-competencia.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="detalleCompetenciaBody">
    <div class="window">
        <div class="windowTitle">
            <h6>Agregar Ejemplar a Competencia</h6>
        </div>
        <div class="windowBox">
            <div>
                <input type="text" class="txb" name="id" hidden>
                <input type="text" class="txb" name="idparent" hidden>
                <input type="text" class="txb" name="idcab" hidden>
                <input type="text" class="txb" name="idjin" hidden>
                <input type="text" class="txb" name="idprep" hidden>
            </div>
            <div class="flex">
                <div>
                    <div>
                        <span class="lbl">Posición</span>
                    </div>
                    <div>
                        <select name="numero" class="txb">
                            <option value="1">#1</option>
                            <option value="2">#2</option>
                            <option value="3">#3</option>
                            <option value="4">#4</option>
                            <option value="5">#5</option>
                            <option value="6">#6</option>
                            <option value="7">#7</option>
                            <option value="8">#8</option>
                            <option value="9">#9</option>
                            <option value="10">#10</option>
                            <option value="11">#11</option>
                            <option value="12">#12</option>
                            <option value="13">#13</option>
                            <option value="14">#14</option>
                            <option value="15">#15</option>
                        </select>
                    </div>
                </div>
                <div class="hsep10"></div>
                <div class="hsep10"></div>
                <div>
                    <div>
                        <span class="lbl">Caballo</span>
                    </div>
                    <div class="flex">
                        <div class="search" functionName="txbCaballoSearchText">
                            <input type="text" class="txb txb-str" name="nomcab" maxlength="30" autocomplete="off">
                        </div>
                        <div class="hsep5"></div>
                        <button class="btn btn-primary mini-btn caballosSearchButton">
                            <span class="icon icon-search"></span>
                        </button>
                        <div class="hsep5"></div>
                        <button class="btn btn-info mini-btn caballosAddButton">
                            <span class="icon icon-plus"></span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="vsep10"></div>

            <div class="flex">
                <div>
                    <div>
                        <span class="lbl">Jinete</span>
                    </div>
                    <div class="flex">
                        <div class="search" functionName="txbJineteSearchText">
                            <input type="text" class="txb txb-str" name="nomjin" maxlength="30" autocomplete="off">
                        </div>
                        <div class="hsep5"></div>
                        <button class="btn btn-primary mini-btn jinetesSearchButton">
                            <span class="icon icon-search"></span>
                        </button>
                        <div class="hsep5"></div>
                        <button class="btn btn-info mini-btn jinetesAddButton">
                            <span class="icon icon-plus"></span>
                        </button>
                    </div>
                </div>
                <div class="hsep10"></div>
                <div class="hsep10"></div>
                <div>
                    <div>
                        <span class="lbl">Peso</span>
                    </div>
                    <div>
                        <input type="text" class="txb txb-num d1" name="pesojin" maxlength="4" autocomplete="off">
                    </div>
                </div>
                <div class="hsep10"></div>
                <div class="hsep10"></div>
                <div>
                    <div>
                        <span class="lbl">% E.</span>
                    </div>
                    <div>
                        <input type="text" class="txb txb-num" name="efectividadjin" maxlength="3" autocomplete="off">
                    </div>
                </div>
            </div>

            <div class="vsep10"></div>

            <div class="flex">
                <div>
                    <div>
                        <span class="lbl">Preparador</span>
                    </div>
                    <div class="flex">
                        <div class="search" functionName="txbPreparadorSearchText">
                            <input type="text" class="txb txb-str" name="nomprep" maxlength="30" autocomplete="off">
                        </div>
                        <div class="hsep5"></div>
                        <button class="btn btn-primary mini-btn preparadoresSearchButton">
                            <span class="icon icon-search"></span>
                        </button>
                        <div class="hsep5"></div>
                        <button class="btn btn-info mini-btn preparadoresAddButton">
                            <span class="icon icon-plus"></span>
                        </button>
                    </div>
                </div>
                <div class="hsep10"></div>
                <div class="hsep10"></div>
                <div>
                    <div>
                        <span class="lbl">Puntos</span>
                    </div>
                    <div>
                        <input type="text" class="txb txb-num d0" name="puntos" maxlength="2" autocomplete="off">
                    </div>
                </div>
            </div>

            <br>
            <br>
            <br>

            <div class="addDetalleCompetenciaButtons flex flex-right">
                <button class="btn btn-info addDetalleCompetenciaSaveButton">Guardar</button>
                <div class="hsep10"></div>
                <button class="btn btn-danger addDetalleCompetenciaCancelButton">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/add-detalle-competencia.js'; ?>
</script>
