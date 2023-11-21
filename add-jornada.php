
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/add-jornada.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="addJornadasBody">
    <div class="window">
        <div class="windowTitle">
            <h6>Nueva Jornada</h6>
        </div>
        <div class="windowBox">
            <div>
                <input type="text" class="txb" name="id" hidden>
                <div>
                    <div>
                        <span class="lbl">Fecha</span>
                    </div>
                    <div>
                        <input type="date" class="txb" name="fecha">
                    </div>
                    <div class="vsep10"></div>
                    <div>
                        <span class="lbl">Descripción</span>
                    </div>
                    <div>
                        <input type="text" class="txb txb-str" name="descrip" maxlength="30" autocomplete="off">
                    </div>
                </div>
            </div>

            <br>

            <!-- Botones -->
            <div class="flex flex-right addJornadasButtons">
                <button class="btn btn-info addJornadasSaveButton">Guardar</button>
                <div class="hsep10"></div>
                <button class="btn btn-danger addJornadasCancelButton">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/add-jornada.js'; ?>
</script>
