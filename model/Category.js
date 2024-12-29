function Category(data, deleteCategoryContainer, onchange, modal) {
    //Variable objet
    this.name = null;
    this.title = null;
    this.shortname = null;
    this.color = null;
    this.fields = [];
    this.vehicle_types = null;
    this.address_mandatory = null;
    this.one_checkbox_mandatory = null;
    this.page = 1;
    this.lastFieldIndex = -1;
    this.type = null;
    this.state = null;

    //Variable de fonctionnement et selecteurs
    this.$categorySelector = null;
    this.$btnEdit = null;
    this.$btnSupr = null;
    this.$btnCopy = null;
    this.$btnPr = null;
    this.$btnSv = null;
    this.$listSelector = null;
    this.pagination = {};
    this.defaultBackgroundColor = '#505050';


    this.deleteCategoryContainer = deleteCategoryContainer;
    this.onchange = onchange;
    this.data = data;
    this.modal = modal;

    this.init();
}

Category.prototype = {
    addCategoryTo: function (parentSelector) {
        $(parentSelector).append(this.makeCategory());
    },

    addFieldCategory: function (field_data) {
        if (field_data.index) {
            const index = field_data.index;
            delete field_data.index;
            delete field_data.state;

            this.fields.splice(index, 0, field_data);
            this.updateDataCate();
        } else {
            this.updateCate();
            this.lastFieldIndex += 1;
            field_data.field_key = `${this.name}_${this.lastFieldIndex}`;
            if (field_data.type === "select") {
                for (let value of field_data.values) {
                    let value_parts = value.value_key.split('_');
                    let old_value_number = value_parts[value_parts.length - 1];
                    value.value_key = `${field_data.field_key}_${old_value_number}`;
                }
            }
            this.fields.push(field_data);
            this.updateDataCate();
        }
        this.onchange(this.data);
    },

    addNewCategoryTo: function (parenSelector) {
        $(parenSelector).append(this.makeNewCategory());
    },

    calculateLineSizes: function (elements, lineLimit) {
        let lines = [];
        let currentLine = [];
        let currentLineSize = 0;

        if (elements) {
            for (const element of elements) {
                const elementSize = element.size;

                // Check if adding the element exceeds the line limit
                if (currentLineSize + elementSize > lineLimit) {
                    lines.push(currentLine);
                    currentLine = [];
                    currentLineSize = 0;
                }

                // Add the element to the current line
                currentLine.push(element);
                currentLineSize += elementSize;
            }
            // Handle the last line (if not empty)
            if (currentLine.length > 0) {
                lines.push(currentLine);
            }
            return lines.length;
        } else {
            this.$btnPr.trigger('click');
            return null;
        }
    },

    deleteFieldCategory: function (field_key) {
        this.fields = this.fields.filter((field) => field.field_key !== field_key);
        this.updateDataCate();
        this.onchange(this.data);
    },

    display: function () {
        let nbCols = 0;
        let nbpage = 0;
        let nb_lines = 0;
        if (this.data !== undefined) {
            $.each(this.data.fields, (index, field_data) => {
                let field = new Field(field_data, this.deleteFieldCategory.bind(this), this.updateSizeFieldCategory.bind(this), this.modal);

                if (!Array.isArray(this.pagination[nbpage])) {
                    this.pagination[nbpage] = []; // Initialize the property as an array if it doesn't exist or isn't an array
                }

                this.pagination[nbpage].push(field);
                nb_lines = this.calculateLineSizes(this.pagination[nbpage], 8);

                if (nb_lines > 5) {
                    nbCols = 0;
                    nb_lines = 0;
                    nbpage = nbpage + 1;
                    nbCols += field_data.cols;
                    this.pagination[nbpage - 1].pop();
                    this.pagination[nbpage] = [];
                    this.pagination[nbpage].push(field);
                }

                const parts = field.id.split('_');
                const lastIndex = parseInt(parts[parts.length - 1]);
                if (this.lastFieldIndex < lastIndex) {
                    this.lastFieldIndex = lastIndex;
                }
            });
            nbCols = 0;

            if (nb_lines === 5) {
                nbpage = nbpage + 1;
                this.pagination[nbpage] = [];
            }

            $.each(this.pagination[Container.current_page[this.name]], (index, field) => {
                nbCols = field.size + nbCols;
                field.addTo(this.$listSelector);
            });
        }
        const bottom_field = new Field(undefined, undefined, undefined, undefined);

        const lines = this.calculateLineSizes(this.pagination[Container.current_page[this.name]], 8);

        if ((lines < 5 ) || (!lines && Object.keys(this.pagination).length === 0)) {
            bottom_field.addBottomTo(this.$listSelector);
            bottom_field.defineFieldBottomHeight(lines);
        }

        if (Container.current_page[this.name] === 0) {
            this.$btnPr.attr('disabled', true);
        }

        if ((Object.keys(this.pagination).length - 1) === Container.current_page[this.name]) {
            this.$btnSv.attr('disabled', true);
        }

        this.initDragAndDrop();
    },
    init: function () {
        this.type = 'category';
        if (this.data) {
            this.name = this.data.category_key;
            this.title = this.data.category_name;
            this.shortname = this.data.category_shortname;
            this.color = this.data.category_color;
            this.fields = this.data.fields;
            this.vehicle_types = this.data.vehicle_types;

            if (this.data.one_checkbox_mandatory) {
                this.one_checkbox_mandatory = this.data.one_checkbox_mandatory;
            }
            if (this.data.address_mandatory) {
                this.address_mandatory = this.data.address_mandatory;
            }

        } else {
            this.data = {
                "category_key": undefined,
                "category_name": undefined,
                "category_color": this.defaultBackgroundColor,
                "category_shortname": undefined,
                "fields": [],
                "vehicle_types": ["crane", "bom", "ampliroll", "vl"]
            };
        }
    },


    initDragAndDrop: function () {
        this.$listSelector.sortable({
            handle: '.field-check, .form-control, .field-select , .field-input',

            group: {
                name: "field", pull: true, put: ['new-field']
            },

            animation: 200,

            easing: "cubic-bezier(1, 0, 0, 1)", //easeInOut

            onMove: function (evt) {
                // Permet de ne pas ajouter d'elements fields en dessous du field-bottom
                if (evt.related.classList.contains('field-bottom')) {
                    return false;
                }
            },

            onEnd: (evt) => {
                let oldIndex = evt.oldIndex;
                let newIndex = evt.newIndex;
                if (Container.current_page[this.name] >= 1) {
                    let diff = 0;
                    for (const property in this.pagination) {
                        if (property !== Object.keys(this.pagination)[Object.keys(this.pagination).length - 1]) { // Ignore last property
                            diff += this.pagination[property].length;
                        }
                    }
                    newIndex = newIndex + diff;
                    oldIndex = oldIndex + diff;
                }
                if (oldIndex !== newIndex) {
                    const removedElement = this.fields.splice(oldIndex, 1)[0];
                    this.fields.splice(newIndex, 0, removedElement);
                    this.onchange(this.data);
                }
            },

            onAdd: (evt) => {

                let newIndex = evt.newIndex;
                if (Container.current_page[this.name] >= 1) {
                    let diff = 0;
                    for (const property in this.pagination) {
                        if (property !== Object.keys(this.pagination)[Object.keys(this.pagination).length - 1]) { // Ignore last property
                            diff += this.pagination[property].length;
                        }
                    }
                    newIndex = newIndex + diff;
                }
                $(evt.item).remove();
                let new_field = new Field(undefined, undefined, undefined, undefined);
                let type = $(evt.item).data('type'); // checkbox, select, string or number

                new_field.setTypeField(type);

                let newId;
                if (this.lastFieldIndex !== -1) {
                    this.lastFieldIndex = this.lastFieldIndex + 1;
                    newId = `${this.name}_${this.lastFieldIndex}`;
                } else {
                    newId = `${this.name}_0`;
                    this.lastFieldIndex = newId;
                }

                new_field.setFieldKey(newId);
                new_field.setIndex(newIndex);
                new_field.setSize(3); // Set default size
                new_field.updateData();

                this.modal.open_modal_field(new_field.data, 'new');
            }
        });
    },


    makeCategory: function () {
        const categoryHTML = `
        <div id="${this.name}" class="event-category" >
            <div class="header-category d-flex align-items-center"">
                <button id="btnSupr-${this.name}" type="button" class="btn btn-danger me-2" data-toggle="modal" data-target="#deleteModal">
                    <i class="fas fa-trash"></i> 
                </button>
                
                <button id="btnEdit-${this.name}" type="button" class="btn btn-success me-2" data-toggle="modal" data-target="#editModal">
                    <i class="fas fa-edit"></i>
                </button>
                <button id="btnCopy-${this.name}" class="btn btn-primary me-2" type="button" id="copyButton">
                    <i class="fas fa-copy"></i>
                </button>
                <div class="info-container justify-content-between d-flex flex-row w-100">
                    <h3>${this.title}</h3>
                    <div class="d-flex align-items-center gap-3">
                        <div class="colorCategoryContainer" id="previewColor-${this.name}"></div>
                        <input type="color" class="form-control form-control-color" id="color_input-${this.name}" value="${this.color}" title="color picker">
                        <h3 class="category-nb-page" id="nb_pages-${this.name}">Page ${Container.current_page[this.name] + 1}</h3>
                    </div>
                </div> 
            </div>
            
            <div class="fields">
                <ul class="pt-2" id="${this.name}">          
                </ul>
            </div>
            <div class="footer-category d-flex justify-content-between">
                <button id="btnPr-${this.name}"  type="button" class="btn btn-light mt-2">Précédent</button>
                <button id="btnSv-${this.name}" type="button" class="btn btn-light mt-2">Suivant</button>
            </div>  
        </div>`;
        const $category = $(categoryHTML);

        $category.css('background-color', this.defaultBackgroundColor);


        this.$listSelector = $category.find('ul');
        this.$categorySelector = $category;
        this.$btnSupr = $category.find('#btnSupr-' + this.name);
        this.$btnEdit = $category.find('#btnEdit-' + this.name);
        this.$btnCopy = $category.find('#btnCopy-' + this.name);
        this.$btnPr = $category.find('#btnPr-' + this.name);
        this.$btnSv = $category.find('#btnSv-' + this.name);
        this.$previewColor = $category.find('#color_input-' + this.name);



        this.$previewColor.on('change', ()=>{
            this.color = this.$previewColor.val();
            this.updateDataCate();
            this.onchange(this.data);

        });

        this.$btnSupr.on('click', () => {
            this.updateDataCate();
            if (Container.prop_delete_modal_category) {

                this.modal.open_modal_category_delete_confirmation(this.name);
            } else {
                this.deleteCategoryContainer(this.name);
            }
        });

        this.$btnSv.on('click', () => {
            const nb_pages = Object.keys(this.pagination).length;


            if (Container.current_page[this.name] < nb_pages - 1) {
                this.$btnPr.attr('disabled', null);
                this.$listSelector.empty();
                Container.current_page[this.name] = Container.current_page[this.name] + 1;

                $(`#nb_pages-${this.name}`).text(`Page ${Container.current_page[this.name] + 1}`);

                if (Container.current_page[this.name] === nb_pages - 1 ) {
                    this.$btnSv.attr('disabled', true);
                }

                $.each(this.pagination[Container.current_page[this.name]], (index, field) => {
                    field.addTo(this.$listSelector);
                });

                const nb_lines = this.calculateLineSizes(this.pagination[Container.current_page[this.name]], 8);

                if (nb_lines < 5) {
                    let bottom_field = new Field(undefined, undefined, undefined, undefined);
                    bottom_field.addBottomTo(this.$listSelector);
                    bottom_field.defineFieldBottomHeight(nb_lines);
                }
            }
        });

        this.$btnPr.on('click', () => {
            this.$btnSv.attr('disabled', false);

            const nb_pages = Object.keys(this.pagination).length;

            if (Container.current_page[this.name] >= 1) {
                this.$listSelector.empty();
                Container.current_page[this.name] = Container.current_page[this.name] - 1;

                $(`#nb_pages-${this.name}`).text(`Page ${Container.current_page[this.name] + 1}`);

                if (Container.current_page[this.name] === 0) {
                    this.$btnPr.attr('disabled', true);
                }
                if (nb_pages === 1) {
                    this.$btnSv.attr('disabled', true);
                }

                $.each(this.pagination[Container.current_page[this.name]], (index, field) => {
                    field.addTo(this.$listSelector);
                });

                const nb_lines = this.calculateLineSizes(this.pagination[Container.current_page[this.name]], 8);

                if (nb_lines < 5) {

                    let bottom_field = new Field(undefined, undefined, undefined, undefined);
                    bottom_field.addBottomTo(this.$listSelector);
                    bottom_field.defineFieldBottomHeight(nb_lines);
                }
                $('#nb_pages').text(`Page ${Container.current_page[this.name] + 1}`);
            } else {
                this.$btnSv.attr('disabled', true);
            }

        });

        this.$btnEdit.on('click', () => {
            this.modal.open_modal_category(this.data);
        });

        this.$btnCopy.on('click', () => {
            localStorage.setItem('copiedElement', JSON.stringify(this.data)); // Set the localStorage item
            $('.toast-header strong').text("Presse papier");
            $('.toast-body').text("Catégorie copiée dans le presse papier");
            $('#liveToast').toast('show');

        });

        this.$categorySelector.on("dblclick", (event) => {
            const checkValidTarget = $(event.target).hasClass('footer-category') || $(event.target).closest('.header-category').hasClass('header-category') || $(event.target).closest("li").hasClass("field-bottom");
            if (checkValidTarget) {
                this.modal.open_modal_category(this.data);
            }
        });

        return this.$categorySelector;
    },

    makeNewCategory: function () {
        const categoryHTML = `
        <div id="New categorie" class="new-event-category" >
            <h3>Catégorie</h3>
            <div class="fields">
                <ul id="new">          
                </ul>
            </div>
        </div>`;

        let $category = $(categoryHTML);
        $category.css('background-color', this.defaultBackgroundColor);
        this.color = this.defaultBackgroundColor;

        this.$listSelector = $category.find('ul');
        this.$categorySelector = $category;
        return this.$categorySelector;
    },

    setData: function (data) {
        this.data.vehicle_types = data.vehicle_types;
        this.data.category_color = data.category_color;
        this.data.category_shortname = data.category_shortname;
        this.data.category_name = data.category_name;
        this.data.category_key = data.category_key;
    },

    setState: function (state) {
        this.state = state;
    },

    updateCate: function () {
        this.name = this.data.category_key;
        this.title = this.data.category_name;
        this.color = this.data.category_color;
        this.fields = this.data.fields;
        this.vehicle_types = this.data.vehicle_types;
    },

    updateDataCate: function () {
        this.data.category_key = this.name;
        this.data.category_name = this.title;
        this.data.category_color = this.color;
        this.data.fields = this.fields;
        this.data.vehicle_types = this.vehicle_types;
    },

    updateSizeFieldCategory: function () {
        this.updateDataCate();
        this.onchange(this.data);
    }
};