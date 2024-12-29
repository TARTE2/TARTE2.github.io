function Container(fetchHandler, modal, history) {
    this.fetchHandler = fetchHandler;
    this.modal = modal;
    this.history = history;

    this.data = this.fetchHandler.getData();
    this.fetchedData = this.fetchHandler.getCopyOfOriginalData();
    this.$containerSelector = null;
    this.currentSelectedIndex = null;
    this.containerSelector = '#event-config-container';
    this.listCategory = [];
    this.currentMousePos = {x: 0, y: 0};

    this.init();
}

Container.current_page = {}; // Used to determined at what page user is

Container.prop_delete_modal_field = true;

Container.prop_delete_modal_category = true;

Container.prototype = {
    init: function () {
        this.makeContainer();
        this.init_current_page();
        this.displayContainer();
        this.initDragAndDrop();
        this.initBtnCopyJSON();
        this.initBtnDownloadJSON();
        this.initBtnImportJSON();
        this.initBtnHistory();
        this.init_shortcut_container();
        this.init_tooltip();
    },

    makeContainer: function () {

        const containerHTML = `
        <nav id="config-event-navbar" class="navbar navbar-expand-lg bg-body-tertiary position-fixed">
          <div class="container-fluid">
            <a class="navbar-brand">
                <img src="res/mobilinn-normal.png" alt="iSmartCollect" data-toggle="tab" href="#tab_home" class="nav-item show active pe-1">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            
             <h5 class="m-0" id="file-name">Fichier par défaut</h5>
            
            
            <div class="collapse navbar-collapse" id="navbarNav">
               
              <div id="btn-group" class="justify-content-between">
                    <button id="importJSON" type="button" class="btn btn-success" data-toggle="modal" data-target="#importModal">
                        <i class="fas fa-upload"></i> Importer
                     </button>
                      
                     <input type="file" id="importJSONInput" accept=".json" hidden>
                      
                     <button id="exportJSON" type="button" class="btn" data-toggle="modal" data-target="#exportModal">
                        <i class="fa-solid fa-code"></i></i> Exporter
                     </button>
                      
                     <button id="downloadJSON" type="button" class="btn btn-primary download-btn">
                         <span class="fas fa-download"></span> Télécharger
                     </button>
              </div>
              <div id="historyBtnGroup" class="d-flex justify-content-between position-fixed top-0 end-0 me-3 mt-3 gap-2">
                  <button id="btnPrevHistory" class="btn btn-secondary" type="button" >
                    <i class="fas fa-undo"></i>
                  </button>
                  <div id="historyNumberEdit" class="d-flex align-items-center">0/0</div>
                  <button id="btnNextHistory" class="btn btn-secondary" type="button" >
                    <i class="fas fa-redo"></i>
                  </button>
                  
                  <button id="historyReset" type="button" class="btn btn-danger">
                      <i class="fa-solid fa-clock-rotate-left"></i></i> Réinitialiser
                  </button>
                  
                  <button type="button" class="btn btn-danger">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <button type="button" class="btn btn-primary btn-lg position-fixed top-40 start-0 ms-3" id="sidebarToggle" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">
                <i class="fas fa-bars"></i>
            </button>
        <div class="d-flex flex-column align-items-center mt-5">
            <div id="event-config-container" class="d-flex flex-column">
            </div>
        </div>
       
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
              <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <strong class="me-auto">Presse papier</strong>
                  <small>A l'instant</small>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                </div>
              </div>
        </div>`;

        let $container = $(containerHTML);

        $('body').append($container);

        this.init_btn_modal_category();
        this.init_btn_modal_field();

        $('#sidebarToggle').on('click', () => {
            $('#config-event-navbar').addClass('sidebar-open');
        });

        $('#sidebarToggle').trigger('click');

        $('#btn-close-offcanvas').on('click', () => {
            $('#config-event-navbar').removeClass('sidebar-open');
        });

        this.$containerSelector = $(this.containerSelector);

        this.$containerSelector.on("mouseover", (event) => {
            let elementLocalStorage = localStorage.getItem("copiedElement");
            if (elementLocalStorage === null) return false;

            this.currentMousePos.x = event.originalEvent.clientX;
            this.currentMousePos.y = event.originalEvent.clientY;
        });
    },
    displayContainer: function () {
        this.listCategory = [];
        $.each(JSON.parse(JSON.stringify(this.data.event_config)), (index, category_data) => {
            let category = new Category(category_data, this.deleteCategoryContainer.bind(this), this.onchange.bind(this), this.modal);
            this.listCategory.push(category);
            category.addCategoryTo(this.containerSelector);
            category.display();
        });
    },
    init_current_page: function () {
        $.each(this.data.event_config, (index, category) => {
            Container.current_page[category.category_key] = 0;
        });
    },
    onchange: function (data) {
        if (data === undefined) return false;
        const sameData = this.fetchHandler.updateJSON(data);
        if (sameData) return false;

        const new_data = JSON.parse(JSON.stringify(this.data));

        this.$containerSelector.empty();
        this.displayContainer();
        if (data.category_key) {
            if (data.fields) {
                const hasNullFieldName = data.fields.some(field => field.field_name === null);
                if (!hasNullFieldName) {
                    this.history.addNewData(new_data);
                }
            } else {
                this.history.addNewData(new_data);
            }
        } else if (data.field_name) {
            this.history.addNewData(new_data);
        }
        $('#historyNumberEdit').text(`${this.history.getCurrentIndex()}/${this.history.getLastIndex()}`);
    },
    deleteCategoryContainer: function (category_key) {
        this.data.event_config = this.data.event_config.filter((category) => category.category_key !== category_key);
        this.$containerSelector.empty();
        this.displayContainer();
        this.history.addNewData(this.data);
        $('#historyNumberEdit').text(`${this.history.getCurrentIndex()}/${this.history.getLastIndex()}`);
    },
    addCategoryContainer: function (category_data, index) {
        this.data.event_config.splice(index, 0, category_data);
        this.$containerSelector.empty();
        this.displayContainer();
        this.history.addNewData(this.data);
        $('#historyNumberEdit').text(`${this.history.getCurrentIndex()}/${this.history.getLastIndex()}`);
    },
    initDragAndDrop: function () {
        this.$containerSelector.sortable({
            animation: 200, group: {
                name: "category", pull: true, put: ['new-category']
            },

            handle: '.footer-category,.header-category', easing: "cubic-bezier(1, 0, 0, 1)", //easeInOut

            onEnd: (evt) => {
                if (evt.oldIndex !== evt.newIndex) {
                    const removedElement = this.data.event_config.splice(evt.oldIndex, 1)[0];
                    this.data.event_config.splice(evt.newIndex, 0, removedElement);
                    this.history.addNewData(this.data);

                    $('#historyNumberEdit').text(`${this.history.getCurrentIndex()}/${this.history.getLastIndex()}`);

                }

            },
            onAdd: (evt) => {
                $(evt.item).remove();
                const new_cate = new Category(null, null, this.deleteCategoryContainer.bind(this), this.onchange.bind(this), this.modal);

                this.currentSelectedIndex = evt.newIndex;
                this.modal.open_modal_category(new_cate.data);
            }
        });
    },

    initBtnCopyJSON: function () {
        $('#exportJSON').on('click', () => {
            const jsonString = JSON.stringify(this.data);
            if (navigator.clipboard) {
                navigator.clipboard.writeText(jsonString)
                    .then(() => {
                        $('.toast-body').text("JSON copié dans le presse-papiers");
                    })
                    .catch(err => {
                        $('.toast-body').text("Erreur lors de la copie du JSON dans le presse-papiers :", err);
                    });
            } else {
                $('.toast-body').text("Votre navigateur ne supporte pas le presse-papiers moderne.");
            }
            $('#liveToast').toast('show');
        });
    },

    initBtnDownloadJSON: function () {
        $('#downloadJSON').on('click', () => {

            $('.toast-header strong').text("Export JSON");
            $('.toast-body').text("JSON Exporté ");
            $('#liveToast').toast('show');
            const jsonString = JSON.stringify(this.data);

            const now = new Date();
            const day = now.getDate().toString().padStart(2, '0');
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const year = now.getFullYear();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');

            const filename = `data_${day}_${month}_${year}_${hours}_${minutes}_${seconds}.json`;

            const blob = new Blob([jsonString], {type: 'application/json'});
            const fileURL = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');

            downloadLink.href = fileURL;
            downloadLink.download = filename;
            downloadLink.click();
            URL.revokeObjectURL(fileURL);
        });
    },

    initBtnImportJSON: function () {
        $('#importJSONInput').bind('change', (event) => {
            const file = event.target.files[0];

            $('#file-name').text(event.target.files[0].name);
            if (file) {
                $('.toast-header strong').text("Import JSON");
                $('.toast-body').text("JSON Importé");
                $('#liveToast').toast('show');
                const reader = new FileReader();

                this.$containerSelector.empty();
                reader.onload = (event) => {
                    const data = JSON.parse(event.target.result);
                    this.fetchHandler.setOriginalData(data);
                    this.fetchHandler.setData(data);

                    this.data = this.fetchHandler.getData();
                    this.fetchedData = JSON.parse(JSON.stringify(this.data));
                    this.history.setOriginalData(this.data);
                    $('#historyNumberEdit').text(`${this.history.getCurrentIndex()}/${this.history.getLastIndex()}`);
                    this.init_current_page();
                    this.displayContainer();
                };
                reader.readAsText(file);
            } else {
                console.error('No file selected');
            }
        });

        $('#importJSON').on('click', () => {
            $('#importJSONInput').trigger('click');
        });
    },
    initBtnHistory() {
        $('#btnNextHistory').on('click', () => {
            this.fetchHandler.setData(this.history.getNextVersion());
            this.data = this.fetchHandler.getData();
            this.$containerSelector.empty();
            this.displayContainer();
            $('#historyNumberEdit').text(`${this.history.getCurrentIndex()}/${this.history.getLastIndex()}`);
        });

        $('#btnPrevHistory').on('click', () => {
            this.fetchHandler.setData(this.history.getPreviousVersion());
            this.data = this.fetchHandler.getData();
            this.$containerSelector.empty();
            this.displayContainer();
            $('#historyNumberEdit').text(`${this.history.getCurrentIndex()}/${this.history.getLastIndex()}`);
        });

        $('#historyReset').on('click', () => {
            $('#confirmationResetModal').modal('show');
        });

        $('#confirmActionReset').on("click", () => {
            this.fetchHandler.setData(this.history.getFirstVersion());
            this.data = this.fetchHandler.getData();
            this.$containerSelector.empty();
            this.displayContainer();
            $('#historyNumberEdit').text(`${this.history.getCurrentIndex()}/${this.history.getLastIndex()}`);
            $('#confirmationResetModal').modal('hide');
        });
    },
    init_btn_modal_category: function () {

        let clicked = false;
        $('#addButtonCate').on("click", () => {
            clicked = true;
            this.modal.close_modal_category((category_data) => {
                if (!category_data) return false;

                if (this.currentSelectedIndex !== null) {
                    Container.current_page[category_data.category_key] = 0;
                    this.addCategoryContainer(category_data, this.currentSelectedIndex);

                } else {
                    this.onchange(category_data);
                }
                this.currentSelectedIndex = null;
            });
        });

        $('.btn-check').on("click", function () {
            const targetTab = $(this).data('target');
            $('.tab-pane').removeClass('show active');
            $(`#${targetTab}`).addClass('show active');
        });

        $('#btn_add_action-planned').on("click", () => {
            const actionPlanned = new FieldSelectValue(null, (id) => {
                this.modal.deleteActionPlanned(id);
            });
            const lastIndex = this.modal.getLastActionPlannedIndex();
            actionPlanned.setID(lastIndex);
            actionPlanned.addTo('.list-action-planned');
            this.modal.addActionPlanned(actionPlanned);
        });

        $('#btn_add_action-taken').on("click", () => {
            const actionTaken = new FieldSelectValue(null, (id) => {
                this.modal.deleteActionTaken(id);
            });
            const lastIndex = this.modal.getLastActionTakenIndex();
            actionTaken.setID(lastIndex);
            actionTaken.addTo('.list-action-taken');
            this.modal.addActionTaken(actionTaken);

        });

        $('.list-action-planned').sortable({ // Make the list of item draggable
            animation: 200, easing: "cubic-bezier(1, 0, 0, 1)", //easeInOut
            handle: '#dragBtnFieldSelectVal', onEnd: (evt) => {
                this.modal.moveActionPlanned(evt.oldIndex, evt.newIndex);
            },
        });

        $('.list-action-taken').sortable({ // Make the list of item draggable
            animation: 200, easing: "cubic-bezier(1, 0, 0, 1)", //easeInOut
            handle: '#dragBtnFieldSelectVal', onEnd: (evt) => {
                this.modal.moveActionTaken(evt.oldIndex, evt.newIndex);
            },
        });

        $('#confirmActionBtnCategory').on("click", () => {
            this.modal.close_modal_category_delete_confirmation((modalData) => {
                Container.prop_delete_modal_category = modalData[0];
                this.deleteCategoryContainer(modalData[1]);
            });
        });
    },
    init_btn_modal_field: function () {
        $('.select_list').sortable({ // Make the list of item draggable
            animation: 200, easing: "cubic-bezier(1, 0, 0, 1)", //easeInOut
            handle: '#dragBtnFieldSelectVal', onEnd: (evt) => {
                this.modal.moveSelectValue(evt.oldIndex, evt.newIndex);
            },
        });

        $('#checkbox-input-field-nb-str,#checkbox-input-field-sl,#checkbox-input-field-ch').change(function () {
            if (!this.checked) {
                $(this).parent().find(".mandatory-container").children().hide();
            } else {
                $(this).parent().find(".mandatory-container").children().show();
            }
            $(this).parent().find('select').prop('disabled', !this.checked);
        });

        $('#addButtonFieldCheckbox').on("click", () => {
            this.modal.close_modal_field_checkbox((field_checkbox_data) => {
                if (field_checkbox_data) {
                    if (field_checkbox_data.state === "new") {
                        const category = this.findCategory(field_checkbox_data.field_key.split('_')[0]);
                        category.addFieldCategory(field_checkbox_data);
                    } else {
                        this.onchange(field_checkbox_data);
                    }
                }
            }, "add");
        });

        $('#addButtonFieldSelect').on("click", () => {
            this.modal.close_modal_field_select((field_select_data) => {
                if (field_select_data) {
                    if (field_select_data.state === "new") {
                        const category = this.findCategory(field_select_data.field_key.split('_')[0]);
                        category.addFieldCategory(field_select_data);
                    } else {
                        this.onchange(field_select_data);
                    }
                }
            });
        });

        $('#addButtonFieldStringAndNumber').on("click", () => {
            this.modal.close_modal_field_string_and_number((field_string_and_number_data) => {
                if (field_string_and_number_data) {
                    if (field_string_and_number_data.state === "new") {
                        const category = this.findCategory(field_string_and_number_data.field_key.split('_')[0]);
                        category.addFieldCategory(field_string_and_number_data);
                    } else {
                        this.onchange(field_string_and_number_data);
                    }
                }
            }, "add");
        });

        $('#btn_add_value_select').on("click", () => {
            const fieldSelectValue = new FieldSelectValue(null, (id) => {
                this.modal.deleteSelectValue(id);
            });

            const field_key = $('#field-key-select').val();
            const lastIndex = this.modal.getLastSelectValueIndex(field_key);

            fieldSelectValue.setID(lastIndex);
            fieldSelectValue.addTo('.select_list');
            this.modal.addSelectedValue(fieldSelectValue);
        });

        $('#field-name-string-number,#field-name-select,#field-name-checkbox').on("input", function () {
            if ($(this).val() === "") {
                $(this).addClass('is-invalid');
                $(this).removeClass('is-valid');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
            }
        });

        $('#confirmActionBtnField').on("click", () => {
            this.modal.close_modal_field_delete_confirmation((modalData) => {
                Container.prop_delete_modal_field = modalData[0];

                const parts = modalData[1].split('_');
                const numbers = parts[parts.length - 1];
                const category_key = modalData[1].replace(`_${numbers}`, '');
                const category = this.findCategory(category_key);
                category.deleteFieldCategory(modalData[1]);
            });
        });
    },
    init_shortcut_container: function () {
        const shortcuts = {
            'CTRL+SHIFT+Z': {
                keys: [17, 16, 90], action: () => {
                    this.fetchHandler.setData(this.history.getPreviousVersion());
                    this.data = this.fetchHandler.getData();
                    this.$containerSelector.empty();
                    this.displayContainer();
                    $('#historyNumberEdit').text(`${this.history.getCurrentIndex()}/${this.history.getLastIndex()}`);
                }, preventDefault: false
            },
            'CTRL+Y': {
                keys: [17, 89], action: () => {

                    this.fetchHandler.setData(this.history.getNextVersion());
                    this.data = this.fetchHandler.getData();
                    this.$containerSelector.empty();
                    this.displayContainer();
                    $('#historyNumberEdit').text(`${this.history.getCurrentIndex()}/${this.history.getLastIndex()}`);

                }, preventDefault: false
            },
            'CTRL+SHIFT+A': {
                keys: [17,16, 65], action: () => {
                    const jsonString = JSON.stringify(this.data);
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(jsonString)
                            .then(() => {
                                $('.toast-body').text("JSON copié dans le presse-papiers");
                            })
                            .catch(err => {
                                $('.toast-body').text("Erreur lors de la copie du JSON dans le presse-papiers :", err);
                            });
                    } else {
                        $('.toast-body').text("Votre navigateur ne supporte pas le presse-papiers moderne.");
                    }
                    $('#liveToast').toast('show');
                }, preventDefault: true
            },
            'CTRL+O': {
                keys: [17, 79], action: () => {
                    // $('#importJSONInput').trigger('change') // Don't work yet cause of navigator constraint see later
                }, preventDefault: true
            },
            'CTRL+V': {
                keys: [17, 86], action: () => {
                    const elementLocalStorage = localStorage.getItem("copiedElement");
                    const elementHovered = document.elementFromPoint(this.currentMousePos.x, this.currentMousePos.y);

                    if (elementLocalStorage === null) {
                        // L'élément n'existe pas dans le localStorage
                    } else {
                        const copy_data = JSON.parse(elementLocalStorage);
                        if (copy_data.category_key !== undefined) {

                            copy_data.category_key = `${copy_data.category_key}_copy`; // Needed to not interfere with the original one

                            const category = $(this.containerSelector).children();
                            const idCategoryHovered = $(elementHovered).closest('div.event-category').attr('id');
                            const indexCategoryCible = category.filter(`#${idCategoryHovered}`).index();

                            if (indexCategoryCible !== -1) {
                                Container.current_page[copy_data.category_key] = 0;
                                this.fetchHandler.updateFieldName(copy_data.fields, copy_data.category_key);
                                this.addCategoryContainer(copy_data, indexCategoryCible);
                            } else {
                                console.error("No element with matching ID found in enfants");
                            }
                        } else {
                            for (let category of this.listCategory) {
                                if (category.name === $(elementHovered).closest('ul').attr('id')) {
                                    category.addFieldCategory(copy_data);
                                    break;
                                }
                            }
                        }
                    }
                }, preventDefault: true
            },
            'CTRL+L': {
                keys: [17, 76], action: () => {

                }, preventDefault: true
            },
            'CTRL+S': {
                keys: [17, 83], action: () => {
                    // $('.toast-header strong').text("Export JSON");
                    // $('.toast-body').text("JSON Exporté ");
                    //
                    // $('#liveToast').toast('show');
                    // const jsonString = JSON.stringify(this.data);
                    //
                    // const now = new Date();
                    // const day = now.getDate().toString().padStart(2, '0');
                    // const month = (now.getMonth() + 1).toString().padStart(2, '0');
                    // const year = now.getFullYear();
                    // const hours = now.getHours().toString().padStart(2, '0');
                    // const minutes = now.getMinutes().toString().padStart(2, '0');
                    // const seconds = now.getSeconds().toString().padStart(2, '0');
                    //
                    // const filename = `data_${day}_${month}_${year}_${hours}_${minutes}_${seconds}.json`;
                    //
                    // const blob = new Blob([jsonString], {type: 'application/json'});
                    // const fileURL = URL.createObjectURL(blob);
                    // const downloadLink = document.createElement('a');
                    //
                    // downloadLink.href = fileURL;
                    // downloadLink.download = filename;
                    // downloadLink.click();
                    // URL.revokeObjectURL(fileURL);
                }, preventDefault: true
            }
        };
        let pressedKeys = {};
        $(document).on('keydown', function (event) {
            pressedKeys[event.keyCode] = true;
            Object.keys(shortcuts).forEach(function (shortcut) {
                const shortcutKeys = shortcuts[shortcut].keys;
                const allKeysPressed = shortcutKeys.every(key => pressedKeys[key]);

                if (allKeysPressed) {
                    if (shortcuts[shortcut].preventDefault) {
                        event.preventDefault();
                    }
                    shortcuts[shortcut].action(event);
                }
            });
        });
        $(document).on('keyup', function (event) {
            delete pressedKeys[event.keyCode];
        });
    },
    findCategory: function (category_name) {
        for (let category of this.listCategory) {
            if (category.name === category_name) {
                return category;
            }
        }
    },
    init_tooltip: function () {
        const $tooltipTriggers = $('[data-bs-toggle="tooltip"]');

        $tooltipTriggers.each(function () {
            $(this).tooltip();
        });
    }
};