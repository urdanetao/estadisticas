
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/add-caballo.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="addCaballoBody">
    <div class="window">
        <div class="windowTitle">
            <h6>Agregar Caballo</h6>
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
            <div class="addCaballoButtons">
                <button class="btn btn-info addCaballoSaveButton">Guardar</button>
                <div class="hsep10"></div>
                <button class="btn btn-danger addCaballoCancelButton">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/add-caballo.js'; ?>
</script>
