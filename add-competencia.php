
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/add-competencia.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="addCompetenciasBody">
    <div class="window">
        <div class="windowTitle">
            <h6>Nueva Competencia</h6>
        </div>
        <div class="windowBox">
            <div>
                <input type="text" class="txb" name="id" hidden>
                <input type="text" class="txb" name="idparent" hidden>
                <div>
                    <div class="flex">
                        <div>
                            <div>
                                <span class="lbl">Carrera</span>
                            </div>
                            <div>
                                <select name="carrera" class="txb">
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
                                <span class="lbl">Descripción</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-str" name="descrip" disabled>
                            </div>
                        </div>
                    </div>

                    <div class="vsep10"></div>

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
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Distancia</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-num m" name="distancia" maxlength="5" autocomplete="off">
                            </div>
                        </div>
                    </div>
                    <div class="vsep10"></div>
                </div>
            </div>

            <br>

            <!-- Botones -->
            <div class="flex flex-right addCompetenciasButtons">
                <button class="btn btn-info addCompetenciasSaveButton">Guardar</button>
                <div class="hsep10"></div>
                <button class="btn btn-danger addCompetenciasCancelButton">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/add-competencia.js'; ?>
</script>
