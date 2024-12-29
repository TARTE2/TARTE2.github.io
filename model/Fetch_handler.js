function Fetch_handler(callback) {
    this.callback = callback;
    this.finished = false;

    this.fetchedData = null;
    this.workingData = null;
    this.init();
}

Fetch_handler.prototype = {
    init: function () {
        // Simulate asynchronous data fetching (replace with actual fetch implementation)
        setTimeout(() => {
            this.fetchedData = data;
            this.workingData = data;
            this.finished = true;
            if (this.callback) {
                this.callback(); // Call the callback with the data
                this.callback = null;
            }
        });
    },
    updateJSON: function (data) {
        let current_data = this.getData();
        if (data === undefined) return false;
        if (data.category_key === undefined) {
            //FIELD
            const parts = data.field_key.split('_');
            const numbers = parts[parts.length - 1];
            const category_key = data.field_key.replace(`_${numbers}`, '');

            for (const category of current_data.event_config) {
                if (category.category_key === category_key) {
                    for (const field of category.fields) {
                        if (field.field_key === data.field_key) {
                            const sameField = this.sameDataField(field, data);
                            if (data.state === "cancel") {
                                category.fields = category.fields.filter(item => item !== field);
                            }
                            field.field_name = data.field_name;
                            if (data.cols) {
                                field.cols = data.cols;
                            }
                            if (data.values !== undefined) {
                                if (data.values.length !== 0) {
                                    field.values = data.values;
                                }
                            }
                            if (data.mandatory !== undefined) {
                                field.mandatory = true;

                            } else {
                                delete field.mandatory;
                            }
                            if (data.mandatory_group !== undefined) {
                                field.mandatory_group = data.mandatory_group;

                            } else {
                                delete field.mandatory_group;
                            }
                            if (data.is_ocr !== undefined) {
                                field.is_ocr = data.is_ocr;
                                field.ocr_regex_search = data.ocr_regex_search;

                            } else {
                                delete field.is_ocr;
                                delete field.ocr_regex_search;
                            }
                            return sameField;
                        }
                    }
                }
            }
        } else {
            //CATEGORY
            for (const category of current_data.event_config) {
                if (category.category_key === data.category_key) {
                    const sameCategory = this.sameDataCategory(category, data);

                    category.category_name = data.category_name;
                    category.category_color = data.category_color;
                    category.category_shortname = data.category_shortname;
                    category.vehicle_types = data.vehicle_types;

                    if (data.fields !== undefined) {

                        category.fields = data.fields;
                    }

                    if (data.actions_taken !== undefined) {
                        if (data.actions_taken.values.length > 0) {
                            category.actions_taken = data.actions_taken;
                        } else {
                            delete category.actions_taken;
                        }
                    }
                    if (data.actions_planned !== undefined) {
                        if (data.actions_planned.values.length > 0) {
                            category.actions_planned = data.actions_planned;
                        } else {
                            delete category.actions_planned;
                        }

                    }
                    if (data.address_mandatory !== undefined) {
                        category.address_mandatory = data.address_mandatory;
                    } else {
                        delete category.address_mandatory;
                    }

                    if (data.one_checkbox_mandatory !== undefined) {
                        category.one_checkbox_mandatory = data.one_checkbox_mandatory;
                    } else {
                        delete category.one_checkbox_mandatory;
                    }
                    if (data.new_category_key !== undefined) {
                        const old_key = data.category_key;
                        category.category_key = data.new_category_key;
                        this.updateFieldName(category.fields, category.category_key);
                        Container.current_page[category.category_key] = Container.current_page[old_key];
                        // delete Container.current_page[old_key]
                    }

                    return sameCategory;
                }
            }
        }
    },
    getData: function () {
        return this.workingData;
    },
    getCopyData: function () {
        return JSON.parse(JSON.stringify(this.workingData));
    },
    setData: function (data) {
        this.workingData = data;
    },
    getOriginalData: function () {
        return this.fetchedData;
    },
    setOriginalData: function (data) {
        this.fetchedData = data;
    },
    getCopyOfOriginalData: function () {
        return JSON.parse(JSON.stringify(this.fetchedData));
    },
    updateFieldName: function (fields, category_key) {
        for (let field of fields) {
            let field_parts = field.field_key.split('_');
            let old_key = field_parts[0];
            field.field_key = field.field_key.replace(old_key, category_key);
            if (field.type === "select") {
                for (let value of field.values) {
                    let value_parts = value.value_key.split('_');
                    let old_value_key = value_parts[0];
                    value.value_key = value.value_key.replace(old_value_key, category_key);
                }
            }
        }
    },
    sameDataCategory: function (category, data) {
        const compareArrays = (a, b) => {
            const set1 = new Set(a);
            const set2 = new Set(b);

            if (set1.size !== set2.size) {
                return false;
            }
            for (const element of set1) {
                if (!set2.has(element)) {
                    return false;
                }
            }
            return true;
        };

        const compareFields = (a, b) => {

            if (b === undefined) return true; // When closing category modal data.fields is undefined

            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        };

        let sameActionPlanned = true;
        let sameActionTaken = true;

        const compareActions = (a,b) => {
            if(a.values.length !== b.values.length) return false;
            for (i = 0; i < a.length; i++) {
                if (a.values[i].value_key !== b.values[i].value_key) return false;
                if (a.values[i].value_name !== b.values[i].value_name) return false;
            }
            return true;
        };

        if(data.actions_planned) {
            if (category.actions_planned){
                sameActionPlanned = compareActions(category.actions_planned, data.actions_planned);
            } else if (data.actions_planned.values.length > 0) {
                sameActionPlanned = false;
            }
        }
        if(data.actions_taken) {
            if (category.actions_taken){
                sameActionTaken = compareActions(category.actions_taken, data.actions_taken);
            } else if (data.actions_taken.values.length > 0) {
                sameActionTaken = false;
            }
        }

        const sameData = category.category_name === data.category_name &&

            category.category_key === data.category_key && data.new_category_key === undefined &&

            category.category_color === data.category_color &&

            category.category_shortname === data.category_shortname && category.one_checkbox_mandatory === data.one_checkbox_mandatory &&

            category.address_mandatory === data.address_mandatory && compareArrays(category.vehicle_types, data.vehicle_types)

            && compareFields(category.fields, data.fields);

        return (sameActionPlanned && sameActionTaken) && sameData;
    },
    sameDataField: function (field, data) {
        const sameData = field.field_key === data.field_key && field.field_name === data.field_name &&

            (field.cols === data.cols || data.cols === undefined) &&

            field.is_ocr === data.is_ocr &&

            field.ocr_regex_search === data.ocr_regex_search;

        const sameMandatoryGroup = field.mandatory_group === data.mandatory_group;
        const sameMandatory = field.mandatory === data.mandatory;

        let sameValues = true;

        if (field.values) {
            const compareValues = (a, b) => {
                if (a.length !== b.length) return false;
                for (i = 0; i < a.length; i++) {
                    if (a[i].value_key !== b[i].value_key) return false;
                    if (a[i].value_name !== b[i].value_name) return false;
                }
                return true;
            };
            sameValues = compareValues(field.values, data.values);
        }
        return sameData && (sameMandatoryGroup && sameMandatory) && sameValues;
    }
};
