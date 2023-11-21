
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/option-select.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="optionSelectBody">
    <div class="window">
        <div class="windowTitle">
            <h6>Seleccione</h6>
        </div>
        <div class="windowBox">
            <div class="optionSelectButtonsBox">
                <button class="btn btn-primary optionSelectEditButton">
                    <span class="icon icon-pencil"></span>
                    <span>&nbsp;</span>
                    <span>Editar</span>
                </button>
                <div class="vsep10"></div>
                <button class="btn btn-danger optionSelectDeleteButton">
                    <span class="icon icon-bin"></span>
                    <span>&nbsp;</span>
                    <span>Eliminar</span>
                </button>
                <div class="vsep10"></div>
                <div class="vsep10"></div>
                <button class="btn btn-success optionSelectCloseButton">
                    <span class="icon icon-exit"></span>
                    <span>&nbsp;</span>
                    <span>Cerrar</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/option-select.js'; ?>
</script>
