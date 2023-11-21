
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/jinetes.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="jinetesBody">
    <div class="commandButtons">
        <button class="btn btn-light mini-btn commandAddButton enable-noshow enable-showing">
            <span class="icon icon-plus"></span>
        </button>
        <div class="hsep10"></div>
        <button class="btn btn-light mini-btn commandEditButton enable-showing">
            <span class="icon icon-pencil"></span>
        </button>
        <div class="hsep10"></div>
        <button class="btn btn-light mini-btn commandSaveButton enable-editing">
            <span class="icon icon-floppy-disk"></span>
        </button>
        <div class="hsep10"></div>
        <button class="btn btn-light mini-btn commandCancelButton enable-editing">
            <span class="icon icon-cross"></span>
        </button>
        <div class="hsep10"></div>
        <button class="btn btn-light mini-btn commandDeleteButton enable-showing">
            <span class="icon icon-bin"></span>
        </button>
    </div>
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Maestro de Jinetes</h6>
            </div>
            <div class="windowBox">
                <div>
                    <input type="text" class="txb" name="id" hidden>
                </div>
                <div>
                    <fieldset>
                        <legend>Búsqueda Rápida</legend>
                        <div class="jinetesLast"></div>
                    </fieldset>
                </div>
                <br>
                <div>
                    <fieldset>
                        <legend>Datos del Registro</legend>
                        <div>
                            <div>
                                <span class="lbl">Nombre</span>
                            </div>
                            <div class="flex">
                                <input type="text" class="txb txb-str enable-editing" name="nombre" maxlength="30" autocomplete="off">
                                <div class="hsep5"></div>
                                <button class="btn btn-primary mini-btn commandSearchButton enable-noshow enable-showing">
                                    <span class="icon icon-search"></span>
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/jinetes.js'; ?>
</script>
