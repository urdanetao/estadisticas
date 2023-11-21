
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/add-jinete.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="addJineteBody">
    <div class="window">
        <div class="windowTitle">
            <h6>Agregar Jinete</h6>
        </div>
        <div class="windowBox">
            <div>
                <div>
                    <input type="text" class="txb" name="id" hidden>
                </div>
                <div>
                    <div>
                        <span class="lbl">Nombre</span>
                    </div>
                    <div>
                        <input type="text" class="txb txb-str" name="nombre" maxlength="30" autocomplete="off">
                    </div>
                </div>
            </div>
            <br>
            <div class="addJineteButtons">
                <button class="btn btn-info addJineteSaveButton">Guardar</button>
                <div class="hsep10"></div>
                <button class="btn btn-danger addJineteCancelButton">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/add-jinete.js'; ?>
</script>
