function Field(data, deleteFieldCategory, updateSizeFieldCategory, modal) {
    //Variable objet
    this.id = null;
    this.name = null;
    this.size = 0;
    this.type = null;
    this.mandatory_group = null;
    this.mandatory = null;
    this.is_ocr = null;
    this.ocr_regex_search = null;
    this.$fieldSelector = null;
    this.$btnSupr = null;
    this.$btnEdit = null;
    this.$btnCopy = null;
    this.values = null;
    this.currentCursorX = null;
    this.width = null;

    this.clickResize = false;
    this.isResizing = false;
    this.MAX_CHAR = 10;
    this.index = null; // Use when a new element is added to a category

    this.deleteFieldCategory = deleteFieldCategory;
    this.updateSizeFieldCategory = updateSizeFieldCategory;
    this.data = data;
    this.modal = modal;

    this.init();
}

Field.prototype = {
    addBottomTo: function (parentSelector) {
        parentSelector.append(this.makeBottomField());
    },

    addNewFieldTo: function (parentSelector, index) {

        if (index !== null && index !== undefined && index !== 3) {

            parentSelector.children().eq(index).before(this.makeNewField());

        } else {
            parentSelector.append(this.makeNewField());
        }
    },

    addTo: function (parentSelector) {
        parentSelector.append(this.makeField());

    }, // Permet de donner la height du field-bottom au moment de sa création
    calculateHeightByCols: function (nbLignes) {
        if (nbLignes <= 1) {
            return 60;
        } else if (nbLignes === 2) {
            return 45;
        } else if (nbLignes === 3) {
            return 30;
        } else if (nbLignes === 4) {
            return 15;
        }
    },

    defineFieldBottomHeight: function (nb_lines) {
        const percentage = this.calculateHeightByCols(nb_lines);
        this.$fieldSelector.css('height', percentage + '%');
        this.$fieldSelector.children().eq(1).children().css('width', percentage*2 + '%'); // Change width of btn img
    },

    findNearestColumn: function (characterCount) {
        return Math.round(characterCount / this.MAX_CHAR);
    },

    getData: function () {
        this.updateData();
        return this.data;
    },

    getNearestRatioPercentage: function (currentValue) {
        return (Math.round(currentValue * 8) / 8) * 100;
    },

    init: function () {
        if (this.data) {
            this.type = this.data.type;
            this.name = this.data.field_name;
            this.id = this.data.field_key;
            this.size = this.data.cols;
            if (this.data.mandatory_group) {
                this.mandatory_group = this.data.mandatory_group;
            }
            if (this.data.mandatory) {
                this.mandatory = this.data.mandatory;
            }
            if (this.data.is_ocr) {
                this.is_ocr = this.data.is_ocr;
                this.ocr_regex_search = this.data.ocr_regex_search;
            }
        } else {
            this.type = this.data;
            this.data = {
                "field_key": undefined, "field_name": undefined, "cols": 0, "type": undefined,
            };
        }
    },

    initResizeListener: function () {

        $(document).on("mousemove", (event) => {
            const dx = event.clientX - this.currentCursorX;

            if (this.width > Math.abs(dx - 60 /*needed for minimum width of field*/) || dx > 0) {
                this.$fieldSelector.css('width', `${this.width + dx}px`);
            }
        });

        $(document).on("mouseup", (event) => {

            size_element = parseInt(this.$fieldSelector.css('width'));
            size_container = parseInt(this.$fieldSelector.parent().css('width'));
            size_element_ratio = size_element / size_container;

            const fieldPercentage = this.getNearestRatioPercentage(size_element_ratio);

            this.resizeField(fieldPercentage);
            $(document).off('mousemove');
            $(document).off("mouseup");
        });
    },

    makeBottomField: function () {
        this.$fieldSelector = $(this.makeFieldBottomHTML());
        return this.$fieldSelector;
    },

    makeField: function () {
        const makeFieldFromType = (type) => {
            switch (type) {
                case 'checkbox':
                    return this.makeFieldCheckBoxHTML();
                case 'select':
                    return this.makeFieldSelectHTML();
                case 'string':
                    return this.makeFieldInputStringHTML();
                default:
                    return this.makeFieldInputNumberHTML();
            }
        };

        this.$fieldSelector = $(makeFieldFromType(this.type));
        this.$fieldSelector.addClass(`li-col-${this.size}`);

        this.$btnSupr = this.$fieldSelector.find("button").eq(0);
        this.$btnEdit = this.$fieldSelector.find("button").eq(1);
        this.$btnCopy = this.$fieldSelector.find("button").eq(2);

        this.$fieldSelector.on("contextmenu", (event) => {
            event.preventDefault();
            if (Container.prop_delete_modal_field) {
                this.modal.open_modal_field_delete_confirmation(this.id);
            } else {
                this.deleteFieldCategory(this.id);
            }
        });

        this.$btnSupr.on("click", () => {
            if (Container.prop_delete_modal_field) {
                this.modal.open_modal_field_delete_confirmation(this.id);
            } else {
                this.deleteFieldCategory(this.id);
            }
        });

        this.$btnEdit.on("click", () => {
            this.modal.open_modal_field(this.data, "edit");
        });

        this.$btnCopy.on('click', () => {
            localStorage.setItem('copiedElement', JSON.stringify(this.data)); // Set the localStorage item
            $('.toast-header strong').text("Presse papier");
            $('.toast-body').text("Événement copié dans le presse papier");
            $('#liveToast').toast('show');
        });

        this.$fieldSelector.on("dblclick", () => {
            this.modal.open_modal_field(this.data, "edit");
        });

        this.$fieldSelector.find(".resizer-r").on("mousedown", (event) => {
            // Get the current mouse position
            this.currentCursorX = event.clientX;
            // Calculate the width of element
            this.width = parseInt(this.$fieldSelector.css('width'), 10);
            this.initResizeListener();
        });
        return this.$fieldSelector;
    },

    makeFieldBottomHTML: function () {
        return `
        <li class="field-bottom" data-cols="8">
            <input placeholder="  Entrez vos commentaires ici" readonly >
            <button> <img src="res/camera.png"></button>
        </li>`;
    },

    makeFieldCheckBoxHTML: function () {
        const mandatory = this.mandatory_group ? this.mandatory_group : '';
        return `
        <li id="${this.id}" class="field d-flex justify-content-left position-relative m-0 " data-cols="${this.size}"  data-type="${this.type}">
            <div class="field-check d-flex align-items-center rounded-2" >
                <div class="d-flex ps-2 pb-1">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" disabled>              
                </div>
                <div class="label-container d-flex justify-content-between align-items-center ">
                 <label class="form-check-label ps-2 pe-3 text-light" for="flexCheckDefault">
                    ${this.name}
                </label>
                </div>  
                <div class="mandatory-icon-checkbox text-light">${mandatory}</div>
            </div>
            <div class="container_btn_checkbox container_btn" >
                <button id="btnSupr-${this.id}" type="button" class="btn btn-danger" data-toggle="modal">
                    <i class="fas fa-trash"></i> 
                </button>
            
                <button id="btnEdit-${this.id}" type="button" class="btn btn-success"  data-toggle="modal"">
                    <i class="fas fa-edit"></i>
                </button>
                
                 <button id="btnCopy-${this.id}" class="btn btn-primary" type="button">
                    <i class="fas fa-copy"></i>
                 </button>
            </div>
            <div id="resizer-${this.id}" class="resizer-r"></div>
        </li>`;
    },

    makeFieldInputNumberHTML: function () {
        const mandatory = this.mandatory_group || (this.mandatory ? '*' : '');
        return `
        <li id="${this.id}" class="field select justify-content-left position-relative" data-cols="${this.size}" data-type="${this.type}">
            <div class="field-input d-flex justify-content-between align-items-center border border-1 border-dark-subtle rounded-3">
                <div class="d-flex flex-row">
                     <div class="mandatory-icon position-absolute top-0 start-0 ps-1">${mandatory}</div>
                     <div class="ps-2">${this.name}</div>
                </div>
                <div>
                    <div id="container-icon" class="d-flex flex-column m-0 p-0">
                         <img id="iconInput" src="res/number_only.svg" alt="123">
                    </div>
                    
                </div>
            </div>
            <div class="container_btn_string container_btn">
                <button id="btnSupr-${this.id}" type="button" class="btn btn-danger" data-toggle="modal">
                <i class="fas fa-trash"></i> 
                </button>
                <button id="btnEdit-${this.id}" type="button" class="btn btn-success" data-toggle="modal">
                    <i class="fas fa-edit"></i>
                </button>
                 <button id="btnCopy-${this.id}" class="btn btn-primary" type="button" id="copyButton">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
            <div id="resizer-${this.id}" class="resizer-r"></div>
        </li>`;
    },

    makeFieldInputStringHTML: function () {
        const mandatory = this.mandatory_group || (this.mandatory ? '*' : '');
        return `
        <li id="${this.id}" class="field select justify-content-left position-relative" data-cols="${this.size}" data-type="${this.type}">
            <div class="field-input d-flex justify-content-between align-items-center rounded-3">
                <div class="d-flex flex-row ">
                     <div class="ps-2">${this.name}</div>
                </div>
                <div>
                    <div id="container-icon" class="d-flex flex-column m-0 p-0">
                        <img id="iconInput" src="res/string_only.svg" alt="ABC">
                    </div>
                </div>
                <div class="mandatory-icon ps-1">${mandatory}</div>
            </div>
            <div class="container_btn_string container_btn">
                <button id="btnSupr-${this.id}" type="button" class="btn btn-danger" data-toggle="modal">
                <i class="fas fa-trash"></i> 
                </button>
                <button id="btnEdit-${this.id}" type="button" class="btn btn-success" data-toggle="modal">
                    <i class="fas fa-edit"></i>
                </button>
                <button id="btnCopy-${this.id}" class="btn btn-primary" type="button" id="copyButton">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
            <div id="resizer-${this.id}" class="resizer-r"></div>
        </li>`;
    },

    makeFieldSelectHTML: function () {
        const mandatory = this.mandatory_group || (this.mandatory ? '*' : '');
        return `
        <li id="${this.id}" class="field justify-content-left position-relative" data-cols="${this.size}" data-type="${this.type}">
            <div class="field-select d-flex justify-content-between align-items-center rounded-3">
                <div class="d-flex flex-row">
                     <div class="ps-2">${this.name}</div>
                </div>
                <div class="d-flex">
                    <img src="res/arrow_drop_down_36px.svg">
                </div>
                <div class="mandatory-icon ps-1">${mandatory}</div>
            </div>
            <div class="container_btn_select container_btn " > 
                <button id="btnSupr-${this.id}" type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteModal">
                <i class="fas fa-trash"></i> 
                </button>
                <button id="btnEdit-${this.id}" type="button" class="btn btn-success" data-toggle="modal" data-target="#editModal">
                    <i class="fas fa-edit"></i>
                </button>
                 <button id="btnCopy-${this.id}" class="btn btn-primary" type="button" id="copyButton">
                        <i class="fas fa-copy"></i>
                 </button>
            </div>
            <div id="resizer-${this.id}" class="resizer-r"></div>
        </li>`;
    },

    makeNewField: function () {
        const makeNewFieldFromType = (type) => {
            switch (type) {
                case 'checkbox':
                    return this.makeNewFieldCheckboxHTML();
                case 'select':
                    return this.makeNewFieldSelectHTML();
                case 'string':
                    return this.makeNewFieldStringHTML();
                default:
                    return this.makeNewFieldNumberHTML();
            }
        };
        this.$fieldSelector = $(makeNewFieldFromType(this.type));
        return this.$fieldSelector;
    },

    makeNewFieldCheckboxHTML: function () {
        return `
        <li id="" class="new-field rounded-2" data-cols="3"  data-type="checkbox">
             <div class="new-field-check d-flex align-items-center rounded-3">
                <input class="form-check-input ms-2 me-1" type="checkbox" id="new-field-checkbox" disabled/>
                
                <div>Case à cocher</div>
             </div>
            
        </li>`;
    },

    makeNewFieldNumberHTML: function () {
        return `
        <li id="" class="new-field rounded-2" data-cols="2" data-type="number">
             <div class="new-field-input d-flex align-items-center justify-content-between rounded-3">
                <div class="ps-2">Saisie nombres</div>
                <div id="container-icon" class="d-flex flex-column m-0 p-0">
                         <img id="iconInput-new-field" src="res/number_only.svg" alt="123">
                </div>
             </div>
            
        </li>`;
    },

    makeNewFieldSelectHTML: function () {
        return `
        <li id="" class="new-field select rounded-2" data-cols="3" data-type="select">
            <div class="new-field-select d-flex justify-content-between align-items-center rounded-3">
                <div class="ps-2">Liste déroulante</div>
                <div class="position-relative">
                    <img id="drop-down-new-field" src="res/arrow_drop_down_36px.svg">
                </div>
            </div>
        </li>`;

    },

    makeNewFieldStringHTML: function () {
        return `
        <li id="" class="new-field rounded-2" data-cols="3" data-type="string">
            <div class="new-field-input d-flex align-items-center justify-content-between rounded-3">
                 <div class="ps-2">Saisie texte</div>
                 <div id="container-icon" class="d-flex flex-column m-0 p-0">
                        <img id="iconInput-new-field" src="res/string_only.svg" alt="ABC">
                 </div>
            </div>
            
        </li>`;
    },

    resizeField: function (nearestWidth) {
        // Calculate new data-cols based on nearestWidth
        let dataCols = Math.ceil(nearestWidth / 12.5);

        if (dataCols !== this.size) {
            this.size = dataCols;
            this.updateData();
            this.updateSizeFieldCategory();
        } else {
            this.$fieldSelector.css({
                width: nearestWidth + '%'
            });
        }
    },

    setData: function (data) {
        this.data.type = data.type;
        this.data.field_name = data.field_name;
        this.data.field_key = data.field_key;
        this.data.cols = data.cols;
        if (data.values !== undefined) {
            this.data.values = data.values;
        }
        this.updateField();
    },

    setFieldKey: function (fieldKey) {
        this.id = fieldKey;
    },

    setIndex: function (index) {
        this.index = index;
    },

    setSize: function (size) {
        this.size = size;
    },

    setStateField: function (state) {
        this.data.state = state;
    },

    setTypeField: function (type) {
        this.type = type;
    },

    updateData: function () {
        this.data.type = this.type;
        this.data.field_name = this.name;
        this.data.field_key = this.id;
        this.data.cols = this.size;
        if (this.index !== null) {
            this.data.index = this.index;
        }
        if (this.values !== null) {
            this.data.values = this.values;
        }
    },

    updateField: function () {
        this.type = this.data.type;
        this.name = this.data.field_name;
        this.id = this.data.field_key;
        this.size = this.data.cols;
    },
};