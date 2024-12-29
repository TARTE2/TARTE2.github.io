function FieldSelectValue(data, onBtnDelete) {
    this.name = null;
    this.id = null;
    this.onBtnDelete = onBtnDelete;

    this.$fieldSelectValueSelector = null;
    this.$btnDelete = null;
    this.$input = null;

    this.data = data;
    this.init();
}

FieldSelectValue.prototype = {
    init: function () {
        if (this.data) {
            this.name = this.data.value_name;
            this.id = this.data.value_key;
        } else {
            this.data = {
                "value_name": undefined, "value_key": undefined
            };
            this.name = "";
            this.id = undefined;
        }
        this.makeFieldSelectValue();
    },
    makeFieldSelectValue() {
        const FieldSelectValueHTML = `
            <li id="${this.id}" class="w-100 list-group-item d-flex">    
                <div class="d-flex align-items-center me-2">
                    <button id="dragBtnFieldSelectVal" type="button" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-arrows-up-down"></i>
                    </button>
                </div>
                <div class=" w-100 me-2">
                    <input id="inputText-${this.id}" type="text" class="form-control me-2" value="${this.name}">
                    <div class="invalid-feedback">
                       Champ vide !
                    </div>
                    <div class="valid-feedback">
                    </div>
                </div>
                <div class="d-flex align-items-center" >
                    <button id="btn_delete_${this.id}" type="button" class="btn btn-danger btn-sm">
                    <span class="fas fa-minus"></span>
                    </button>
                </div>
            </li>`;

        this.$fieldSelectValueSelector = $(FieldSelectValueHTML);
        this.$btnDelete = this.$fieldSelectValueSelector.find(`#btn_delete_${this.id}`);
        this.$input = this.$fieldSelectValueSelector.find(`input`);

        this.$btnDelete.on("click", () => {
            this.onBtnDelete(this.id);
            this.$fieldSelectValueSelector.remove();
        });

        this.$input.on("input", () => {
            this.name = this.$input.val().trim().replace(/ +/g, ' '); //Permet de ne pas avoir d'espace en trop;
            this.toggleValidity(this.$input, this.name !== "");
            this.updateData();
        });

        this.toggleValidity(this.$input, this.name !== "");

        return this.$fieldSelectValueSelector;
    },
    toggleValidity: function (selector, condition) {
        if (condition === true) {
            selector.removeClass('is-invalid');
            selector.addClass('is-valid');
        } else {
            selector.removeClass('is-valid');
            selector.addClass('is-invalid');
        }

    },
    addTo: function (parentSelector) {
        $(parentSelector).append(this.makeFieldSelectValue());
    },
    setID: function (id) {
        this.id = id;
    },
    getID: function () {
        return this.id;
    },
    updateData: function () {
        this.data.value_name = this.name;
        this.data.value_key = this.id;
    },
    getData: function () {
        return this.data;
    }
};