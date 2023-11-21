

<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/historico.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="historicoBody">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Historico de Carreras por Ejemplar</h6>
            </div>
            <div class="windowBox">
                <fieldset>
                    <legend>Ejemplar y Filtros</legend>
                    <div class="flex flex-vcenter flex-space-between">
                        <div class="flex historicoDataBox">
                            <div>
                                <div>
                                    <span class="lbl">Ejemplar</span>
                                </div>
                                <div class="flex">
                                    <input type="text" class="txb" name="idcab" hidden>
                                    <div class="search" functionName="historicoCaballoSearchText">
                                        <input type="text" class="txb txb-str" name="nomcab" maxlength="30" autocomplete="off">
                                    </div>
                                    <div class="hsep5"></div>
                                    <button class="btn btn-info mini-btn btnHistoricoSearchCaballo">
                                        <span class="icon icon-search"></span>
                                    </button>
                                    <div class="hsep5"></div>
                                    <button class="btn btn-danger mini-btn btnHistoricoClearEjemplar">
                                        <span class="icon icon-cross"></span>
                                    </button>
                                </div>
                            </div>
    
                            <div class="hsep10"></div>
                            <div class="hsep10"></div>
    
                            <div>
                                <div>
                                    <span class="lbl">Distancia</span>
                                </div>
                                <div class="flex">
                                    <input type="text" class="txb txb-num d0 m" name="distancia" maxlength="5" autocomplete="off">
                                    <div class="hsep5"></div>
                                    <button class="btn btn-danger mini-btn btnHistoricoClearDistancia">
                                        <span class="icon icon-cross"></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button class="btn btn-info btnHistoricoBuscar">
                                <span class="icon icon-search">&nbsp;Buscar</span>
                            </button>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Resumen del Ejemplar</legend>
                    <table class="historicoTablaResumen"></table>
                </fieldset>

                <fieldset>
                    <legend>Historico de Carreras</legend>
                    <div class="flex flex-right">
                        <button class="btn btn-info historicoBtnAgregarCarrera">
                            <span class="icon icon-plus">&nbsp;Agregar</span>
                        </button>
                    </div>
                    <div class="vsep10"></div>
                    <div class="historicoBox"></div>
                </fieldset>
            </div>
        </div>
    </div>
    <br>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/historico.js'; ?>
</script>
