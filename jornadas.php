
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/jornadas.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="jornadasBody">
    <div class="flex">
        <div class="jornadasListBox">
            <div class="jornadasColumnTitleBox">
                <span>Jornadas Registradas</span>
            </div>
            <div class="jornadasAddButtonBox">
                <button class="btn btn-info jornadasAddButton">
                    <span class="icon icon-plus">&nbsp;Agregar</span>
                </button>
            </div>
            <div class="jornadasList"></div>
        </div>

        <div class="competenciasListBox">
            <div class="competenciasColumnTitleBox hideText">
                <span>Competencias Registradas</span>
            </div>
            <div class="competenciasAddButtonBox">
                <button class="btn btn-info competenciasAddButton">
                    <span class="icon icon-plus">&nbsp;Agregar</span>
                </button>
            </div>
            <div class="competenciasList"></div>
        </div>

        <div class="detailBox">
            <div class="detailColumnTitleBox">
                <span>Detalle de la Competencia</span>
            </div>
            <div class="detailColumnBox">
                <div class="flex">
                    <div>
                        <div>
                            <span class="lbl">Fecha</span>
                        </div>
                        <div>
                            <input type="date" class="txb" name="fecha" disabled>
                        </div>
                    </div>
                    <div class="hsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Descripción</span>
                        </div>
                        <div>
                            <input type="text" class="txb" name="descrip" disabled>
                        </div>
                    </div>
                    <div class="hsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Codigo</span>
                        </div>
                        <div>
                            <input type="text" class="txb txb-str" name="codigo" disabled>
                        </div>
                    </div>
                    <div class="hsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Distancia</span>
                        </div>
                        <div>
                            <input type="text" class="txb txb-num m" name="distancia" disabled>
                        </div>
                    </div>
                </div>
                <div class="flex flex-vcenter">
                    <div class="detailAddButtonBox">
                        <button class="btn btn-info detalleAddButton">
                            <span class="icon icon-plus">&nbsp;Agregar</span>
                        </button>
                    </div>
                    <div class="hsep10"></div>
                    <div class="infoTercerosButtonBox">
                        <button class="btn btn-info infoTercerosButton">
                            <span class="icon icon-folder-plus">&nbsp;Terceros</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="informacion">
                <fieldset>
                    <legend>Informacón de Terceros</legend>
                    <div class="flex flex-right">
                        <button class="btn btn-info mini-btn btnAddInfoTerceros">
                            <span class="icon icon-plus"></span>
                        </button>
                    </div>
                    <div class="vsep10"></div>
                    <div class="infoTercerosBox"></div>
                </fieldset>
            </div>

            <div class="detailList"></div>
        </div>
    </div>
</div>

<div id="dlg" hidden>
    <h4>Hola</h4>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/jornadas.js'; ?>
</script>
