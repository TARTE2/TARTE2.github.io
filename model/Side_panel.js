function Side_panel() {
    this.$sidePanelSelector = null;
    this.lastElementIndex = null;

    this.init();
}

Side_panel.prototype = {
    init: function () {
        this.create();
        this.display();
        this.dragAndDrop();
    },
    create: function () {
        const sidePanelHTML = `
        <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false"  tabindex="-1" id="offcanvasLeft" aria-labelledby="offcanvasLeftLabel">
          <div class="offcanvas-header d-flex justify-content-center">
            <h5 class="offcanvas-title" id="offcanvasLeftLabel">Ajouts d'éléments</h5>
            <button id="btn-close-offcanvas" type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            
            <div id="category-panel" class="side-panel-cate pt-3">
                <h5 class="title text-center text-light">Catégorie</h5>
                <ul id="category-panel-list" class="side-items d-flex flex-column gap-3 align-items-center"></ul>    
            </div>
            
            <div id="field-panel" class="side-panel #686868">
                <h5 class="title text-center text-light">Évenements</h5>
                <ul id="field-panel-list" class="side-items d-flex flex-column align-items-center ps-3"></ul>    
            </div>
          </div>
        </div>`;

        let $sidePanel = $(sidePanelHTML);
        this.$sidePanelSelector = $sidePanel;
        return $sidePanel;
    },
    display: function () {
        $('body').append(this.$sidePanelSelector);

        this.$listFieldSelector = $('#field-panel-list');
        this.$listCategorySelector = $('#category-panel-list');
        const listOfType = ["checkbox", "select", "number", "string"];
        listOfType.forEach((type) => {
            this.createNewField(this.$listFieldSelector, type);
        });
        this.createNewCategory(this.$listCategorySelector);
    },
    dragAndDrop: function () {
        this.$listFieldSelector.sortable({
            animation: 200, group: {
                name: "new-field", pull: true,
            },

            handle: '.new-field-check, .new-field-input, .new-field-select',

            easing: "cubic-bezier(1, 0, 0, 1)", //easeInOut

            onMove: function (evt) {
                // Permet à l'élément categorie d'être inserer uniquement dans la liste de categorie
                if ($(evt.dragged).attr('class').includes('new-event-category') && ($(evt.to).attr('id') !== 'event-config-container') && $(evt.to).attr('class') !== 'side-items') {
                    return false;
                }
                // Permet à l'élément field d'être inserer uniquement dans une liste field
                if ($(evt.dragged).attr('class').includes('new-field') && !$(evt.to).is('ul')) {
                    return false;
                }
                // // Permet de ne pas ajouter d'elements fields en dessous du field-bottom
                // if (evt.related.classList.contains('field-bottom')) {
                //     return false;
                // }

            },

            onChoose: (evt) => {
                this.lastElementIndex = evt.oldIndex;

                $(evt.item).tooltip({
                    title: "Cliquer et déposer l'élément dans une Catégorie.",
                    placement: "top" // Optional: Choose tooltip position (top, right, bottom, left)
                });
                $(evt.item).tooltip('show'); // Show the tooltip on click
                setTimeout(function () {
                    $(evt.item).tooltip('dispose');
                }, 1000);
            },

            onEnd: (evt) => {
                if (evt.to !== evt.target) {

                    const createNewFieldFromType = (type) => {

                        switch (type) {
                            case 'checkbox':
                                this.createNewField(this.$listFieldSelector, type);
                                break;
                            case 'select':
                                this.createNewField(this.$listFieldSelector, type);
                                break;
                            case 'string':
                                this.createNewField(this.$listFieldSelector, type);
                                break;
                            case'number':
                                this.createNewField(this.$listFieldSelector, type);
                                break;
                            default:
                                this.createNewCategory(this.$listCategorySelector);
                                break;
                        }
                    };
                    createNewFieldFromType($(evt.item).data('type'));
                }
            }
        });

        this.$listCategorySelector.sortable({
            animation: 200, group: {
                name: "new-category", pull: true,
            }, draggable: ".new-event-category",

            easing: "cubic-bezier(1, 0, 0, 1)", //easeInOut

            onChoose: (evt) => {

                $(evt.item).tooltip({
                    title: "Cliquer et déposer l'élément à droite",
                    placement: "top" // Optional: Choose tooltip position (top, right, bottom, left)
                });
                $(evt.item).tooltip('show'); // Show the tooltip on click
                setTimeout(function () {
                    $(evt.item).tooltip('dispose');
                }, 1000);

            },



            onEnd: (evt) => {
                if (evt.to !== evt.target) {
                    this.createNewCategory(this.$listCategorySelector);
                }
            }
        });
    },
    createNewField: function (selector, type) {
        const new_field = new Field(undefined, undefined, undefined, undefined, undefined);
        new_field.setTypeField(type);
        new_field.addNewFieldTo(selector, this.lastElementIndex);
    },
    createNewCategory: function (selector) {
        const new_category = new Category(undefined, undefined, undefined, undefined, undefined);
        new_category.addNewCategoryTo(selector);
    }
};