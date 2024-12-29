function Modal() {
    this.listSelectValues = [];

    this.listActionTaken = [];
    this.listActionPlanned = [];
    this.listActionTakenCopy = [];
    this.listActionPlannedCopy = [];

    this.lastIndexSelectValue = null;
    this.lastIndexActionTaken = null;
    this.lastIndexActionPlanned = null;

    this.mandatoryTooltip = "Cette option permet de rendre un événement obligatoire à sélectionner par le chauffeur. " +
        "Pour rendre un groupe d'événements obligatoire, sélectionner un même numéro de groupe. " +
        "Si x groupes sont définis, il faudra sélectionner au minimum un événement par groupe.";

    this.OCRTooltip = "Cette option permet d'activer la reconnaissance optique de caractères. Non modifiable pour le moment.";

    this.actionPlTooltip = "Ajoutez des actions planifiées en fonction de la catégorie courante.";

    this.actionTkTooltip = "Ajoutez des actions réalisées en fonction de la catégorie courante.";

    this.addressMandatoryTooltip = "Cette option rend obligatoire le renseignement de l'adresse lors de la déclaration d'un événement ";

    this.oneCheckboxMandatoryTooltip = "Cette option permet de rendre obligatoire le fait de cocher minimum un événement de type case à cocher dans la catégorie";
    this.init();

}

Modal.prototype = {
    init: function () {
        this.add_modal();
    },
    add_modal: function () {
        const modalCateHTML = `
        <div class="modal fade" id="modalCate"  data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div id="category-content" class="modal-content ">
              <div class="modal-header">
                <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                  <input type="radio" class="btn-check" name="btnradio" id="btnEditCategory" autocomplete="off" data-target="category-tab" checked>
                  <label id="category-title" class="btn btn-outline-primary" for="btnEditCategory">Ajout d'une Catégorie</label>
                
                  <input type="radio" class="btn-check" name="btnradio" id="btnActionPl" autocomplete="off" data-target="action-planned-tab">
                  <label class="btn btn-outline-primary" for="btnActionPl" data-target="action-taken-tab" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${this.actionPlTooltip}">Actions planifiées</label>
                
                  <input type="radio" class="btn-check" name="btnradio" id="btnActionTk" autocomplete="off" data-target="action-taken-tab" >
                  <label class="btn btn-outline-primary" for="btnActionTk" data-target="action-taken-tab" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${this.actionTkTooltip}">Actions réalisées</label>
                </div>
              </div>
              <div class="modal-body">
                <div class="tab-content">
                  <div class="tab-pane fade show active" id="category-tab" role="tabpanel" aria-labelledby="category-tab">
                    <form>
                      <div class="mb-3">
                        <label for="category-name" class="col-form-label">Nom de la catégorie</label>
                        <input type="text" class="form-control" id="category-name" minlength="1" maxlength="50">
                        <div class="invalid-feedback">
                                    Champ vide ! 
                        </div>
                      </div>
                      
                      <div class="mb-3">
                        <label for="category-shortname" class="col-form-label">Nom court de la catégorie</label>
                        <input type="text" class="form-control" id="category-shortname" minlength="1" maxlength="20">
                        <div class="invalid-feedback">
                                    Champ vide ! 
                        </div>
                      </div>
                      
                      <div class="mb-3 color_key_input">
                        <div>
                          <label for="category-key" class="col-form-label">Nom clé de la catégorie</label>
                          <input type="text" class="form-control" id="old-category-key" hidden="hidden">
                          <input type="text" class="form-control" id="category-key" minlength="2" maxlength="20">
                          <div class="invalid-feedback">
                          </div>
                        </div>
                        <div id="color_section">
                          <label for="color_input" class="col-form-label">Couleur de la catégorie</label>
                          <input type="color" class="form-control form-control-color" id="color_input" value="#563d7c" title="color picker">  
                        </div>
                      </div>
                      
                      <h4 class="subtitle">Types de véhicules</h4>
                      <div class="mb-3" id="modal-checkbox">
                        <div class="d-flex align-items-center">
                          <input class="form-check-input" type="checkbox" id="crane" checked>
                          <label class="form-check-label ps-2" for="crane">Grue</label>
                        </div>
                        <div class="d-flex align-items-center">
                          <input class="form-check-input" type="checkbox" id="bom" checked>
                          <label class="form-check-label ps-2" for="bom">Benne à ordure</label>
                        </div>
                        <div class="d-flex align-items-center">
                          <input class="form-check-input" type="checkbox" id="ampliroll" checked>
                          <label class="form-check-label ps-2" for="ampliroll">Ampliroll</label>
                        </div>
                        <div class="d-flex align-items-center">
                          <input class="form-check-input" type="checkbox" id="vl" checked>
                          <label class="form-check-label ps-2" for="vl">Véhicule léger</label>
                        </div>
                      </div>
                      <h4 class="subtitle">Options supplémentaires</h4>
                      <div class="mt-3 d-flex justify-content-lg-around">
                         <div class="d-flex align-items-center">
                          <input class="form-check-input" type="checkbox" id="one-checkbox-mandatory">
                          <label class="form-check-label ps-2" for="one-checkbox-mandatory">Minimum une case à cocher</label>
                          <button type="button" class="mandatory-info-btn btn btn-primary btn-sm ms-2" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${this.oneCheckboxMandatoryTooltip}">
                                <i class="fas fa-info-circle"></i>
                          </button>
                        </div>
                        
                        <div class="d-flex align-items-center">
                          <input class="form-check-input" type="checkbox" id="address-mandatory">
                          <label class="form-check-label ms-2" for="adress-mandatory">Adresse obligatoire</label>
                          <button type="button" class="mandatory-info-btn btn btn-primary btn-sm ms-2" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${this.addressMandatoryTooltip}">
                                <i class="fas fa-info-circle"></i>
                          </button>
                        </div>
                      </div>
                       
                    </form> 
                  </div>
                  <div class="tab-pane fade" id="action-planned-tab" role="tabpanel" >
                        <div class="action-pl-container">
                          <ul class="list-group  list-action-planned">
                          </ul>
                          <div class="mt-1 d-flex justify-content-center is-invalid">
                            <button id="btn_add_action-planned" type="button" class="btn btn-primary"><i class="fas fa-plus"></i></button>
                          </div>
                       </div> 
                  </div>
                  <div class="tab-pane fade" id="action-taken-tab" role="tabpanel" >
                        <div class="action-tk-container">
                          <ul class="list-group  list-action-taken">
                          </ul>
                          <div class="mt-1 d-flex justify-content-center is-invalid">
                                <button id="btn_add_action-taken" type="button" class="btn btn-primary"><i class="fas fa-plus"></i></button>
                          </div>
                       </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" id="rmButtonCate" class="btn btn-secondary red-btn" data-bs-dismiss="modal">Annuler</button>
                <button type="button" id="addButtonCate" class="btn btn-primary">Ajouter</button>
              </div>
            </div>
          </div>
        </div>`;

        const modalFieldCheckboxHTML = `
        <div class="modal fade" id="modalFieldCheckbox" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Ajout d'un Événement</h1>
              </div>
              <div class="modal-body">
                <form> 
                  <div class="mb-3">
                    <label for="field-name-checkbox" class="col-form-label">Nom de l'Événement</label>
                    <input type="text" class="form-control" id="field-name-checkbox" minlength="1" maxlength="80" required>
                     <div class="invalid-feedback">
                            Champ vide ! 
                    </div>
                    <input type="text" class="form-control" id="field-key-checkbox" hidden="hidden">
                    <input type="text" class="form-control" id="field-state-checkbox" hidden="hidden">
                    <input type="text" class="form-control" id="field-index-checkbox" hidden="hidden">
                    <input type="text" class="form-control" id="field-old-name-checkbox" hidden="hidden">
                  </div>
                  
                  <div class="mb-3">
                    <div class="checkbox-select-wrapper d-flex align-items-center">
                      <input type="checkbox" id="checkbox-input-field-ch">
                      <label for="checkbox-input-field-ch" class="ms-1">Champ obligatoire</label>
                      <div class="d-flex align-items-center mandatory-container">
<!--                          <label for="select-input-field-ch" class="ms-3">Groupe</label>-->
                          <select id="select-input-field-ch" class="form-select  ms-3" aria-label="Default select example" disabled>
                              <option value="1" selected>Groupe 1</option>
                              <option value="2">Groupe 2</option>
                              <option value="3">Groupe 3</option>
                              <option value="4">Groupe 4</option>
                              <option value="5">Groupe 5</option>
                              <option value="6">Groupe 6</option>
                              <option value="7">Groupe 7</option>
                              <option value="8">Groupe 8</option>
                              <option value="9">Groupe 9</option>
                              <option value="10">Groupe 10</option>
                           </select>
                           <input type="text" class="form-control" id="field-ch-checkbox-old-val" hidden="hidden">
                           <input type="text" class="form-control" id="field-ch-checkbox-old-group-val" hidden="hidden">
                      </div>
                      <button type="button" class="mandatory-info-btn btn btn-primary btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${this.mandatoryTooltip}">
                         <i class="fas fa-info-circle"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button"  id="rmButtonFieldCheckbox" class="btn btn-secondary red-btn" data-bs-dismiss="modal">Annuler</button>
                <button type="button" id="addButtonFieldCheckbox" class="btn btn-primary">Ajouter</button>
              </div>
            </div>
          </div>
        </div>`;

        const modalFieldSelectHTML = `
        <div class="modal fade" id="modalFieldSelect" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div id="f-select-content" class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Ajout d'un Événement</h1>
              </div>
              <div class="modal-body">
                <form>
                  <div class="mb-3">
                    <label for="field-name-select" class="col-form-label">Nom de l'Événement</label>
                    <input type="text" class="form-control" id="field-name-select" minlength="1" maxlength="80" required>
                    <div class="invalid-feedback">
                            Champ vide ! 
                    </div>
                    <input type="text" class="form-control" id="field-key-select" hidden="hidden">
                    <input type="text" class="form-control" id="field-state-select" hidden="hidden">
                    <input type="text" class="form-control" id="field-old-name-select" hidden="hidden">
                    <input type="text" class="form-control" id="field-index-select" hidden="hidden">
                  </div>
                  <div class="mb-3">
                      <ul class="list-group  select_list">
                      </ul>
                   </div>
                  <div class="mb-3 d-flex justify-content-center is-invalid">
                    <button id="btn_add_value_select" type="button" class="btn btn-primary"><i class="fas fa-plus"></i></button>
                  </div>
                  
                  <div class="mb-3">
                    <div class="checkbox-select-wrapper d-flex align-items-center">
                      <input type="checkbox" id="checkbox-input-field-sl">
                      <label for="checkbox-input-field-sl" class="ms-1">Champ obligatoire</label>
                      <div class="d-flex align-items-center mandatory-container">
                            <select id="select-input-field-sl" class="form-select  ms-3" aria-label="Default select example" disabled>
                              <option selected >Pas de groupe</option>
                              <option value="1">Groupe 1</option>
                              <option value="2">Groupe 2</option>
                              <option value="3">Groupe 3</option>
                              <option value="4">Groupe 4</option>
                              <option value="5">Groupe 5</option>
                              <option value="6">Groupe 6</option>
                              <option value="7">Groupe 7</option>
                              <option value="8">Groupe 8</option>
                              <option value="9">Groupe 9</option>
                              <option value="10">Groupe 10</option>
                           </select>
                           <input type="text" class="form-control" id="field-sl-checkbox-old-val" hidden="hidden">
                           <input type="text" class="form-control" id="field-sl-checkbox-olg-group-val" hidden="hidden">
                      </div>
                      <button type="button" class="mandatory-info-btn btn btn-primary btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${this.mandatoryTooltip}">
                         <i class="fas fa-info-circle"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button"  id="rmButtonFieldSelect" class="btn btn-secondary red-btn" data-bs-dismiss="modal">Annuler</button>
                <button type="button" id="addButtonFieldSelect" class="btn btn-primary" >Ajouter</button>
              </div>
            </div>
          </div>
        </div>`;

        const modalFieldStringAndNumberHTML = `
        <div class="modal fade" id="modalFieldStringAndNumber" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Ajout d'un Événement</h1>
              </div>
              <div class="modal-body">
                <form> 
                  <div class="mb-3">
                    <label for="field-name-string" class="col-form-label">Nom de l'Événement</label>
                    <input type="text" class="form-control" id="field-name-string-number" minlength="1" maxlength="80" required>
                    <div class="form-text" id="basic-addon4"></div>
                    <input type="text" class="form-control" id="field-key-string-number" hidden="hidden">
                    <input type="text" class="form-control" id="field-state-string-number" hidden="hidden">
                    <input type="text" class="form-control" id="field-index-string-number" hidden="hidden">
                    <input type="text" class="form-control" id="field-type-string-number" hidden="hidden">
                    <input type="text" class="form-control" id="field-old-name-string-number" hidden="hidden">
                  </div>
                  
                  <div class="mb-3">
                    <div class="checkbox-select-wrapper d-flex align-items-center">
                      <input type="checkbox" id="checkbox-input-field-nb-str">
                      <label for="checkbox-input-field-nb-str" class="ms-1">Champ obligatoire</label>
                      <div class="d-flex align-items-center mandatory-container" title="Tooltip with Font Awesome icon">
                          <select id="select-input-field-nb-str" class="form-select  ms-3" aria-label="Default select example">
                              <option selected>Pas de groupe</option>
                              <option value="1">Groupe 1</option>
                              <option value="2">Groupe 2</option>
                              <option value="3">Groupe 3</option>
                              <option value="4">Groupe 4</option>
                              <option value="5">Groupe 5</option>
                              <option value="6">Groupe 6</option>
                              <option value="7">Groupe 7</option>
                              <option value="8">Groupe 8</option>
                              <option value="9">Groupe 9</option>
                              <option value="10">Groupe 10</option>
                           </select>
                           <input type="text" class="form-control" id="field-nb-str-checkbox-old-val" hidden="hidden">
                           <input type="text" class="form-control" id="field-nb-str-checkbox-olg-group-val" hidden="hidden"> 
                      </div>
                      <button type="button" class="mandatory-info-btn btn btn-primary btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${this.mandatoryTooltip}">
                         <i class="fas fa-info-circle"></i>
                      </button>
                    </div>
                  </div>
                  <div class="mb-3">
                    <div id="ocr-container" class="d-flex align-items-center">
                        <input type="checkbox" id="checkbox-input-field-nb-ocr" disabled>
                        <label for="checkbox-input-field-nb-ocr" class="ms-1">OCR</label>    
                           
                        <input type="text" class="form-control ms-3" id="field-ocr-regex-search" readonly>
                        <input type="text" class="form-control" id="checkbox-input-field-nb-ocr-old-val" hidden="hidden">
                        <button type="button" class="mandatory-info-btn btn btn-primary btn-sm ms-2" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${this.OCRTooltip}">
                         <i class="fas fa-info-circle"></i>
                        </button>
                    </div>      
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button"  id="rmButtonFieldStringAndNumber" class="btn btn-secondary red-btn" data-bs-dismiss="modal">Annuler</button>
                <button type="button" id="addButtonFieldStringAndNumber" class="btn btn-primary">Ajouter</button>
              </div>
            </div>
          </div>
        </div>`;

        const confirmationDeleteFieldModalHTML = `
            <div class="modal fade" id="confirmationFieldModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="confirmationModalLabel">Confirmation requise</h5>
                  </div>
                  <div class="modal-body">
                    <p>Êtes-vous sûr de vouloir supprimer cet événement ?</p>
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="dontAskAgainCheckboxField">
                      <label class="form-check-label" for="dontAskAgainCheckboxField">Ne plus me demander</label>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" id="confirmActionBtnField">Confirmer</button>
                  </div>
                  
                  <input type="text" class="form-control" id="field-key-delete-modal" hidden="hidden">
                </div>
              </div>
            </div>`;

        const confirmationDeleteCategoryModalHTML = `
            <div class="modal fade" id="confirmationCategoryModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="confirmationModalLabel">Confirmation requise</h5>
                  </div>
                  <div class="modal-body">
                    <p>Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="dontAskAgainCheckboxCategory">
                      <label class="form-check-label" for="dontAskAgainCheckboxCategory">Ne plus me demander</label>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" id="confirmActionBtnCategory">Confirmer</button>
                  </div>
                  <input type="text" class="form-control" id="category-key-delete-modal" hidden="hidden">
                </div>
              </div>
            </div>`;

        const confirmationModalreset =`
            <div class="modal fade" id="confirmationResetModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="confirmationModalLabel">Confirmation requise</h5>
                  </div>
                  <div class="modal-body">
                    <p>Êtes-vous sûr de vouloir réinitialiser la configuration en cours ?</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" id="confirmActionReset">Confirmer</button>
                  </div>
                  
                  <input type="text" class="form-control" id="field-key-delete-modal" hidden="hidden">
                </div>
              </div>
            </div>`;

        $('body').append(modalCateHTML,
            modalFieldCheckboxHTML,
            modalFieldSelectHTML,
            modalFieldStringAndNumberHTML,
            confirmationDeleteFieldModalHTML,
            confirmationDeleteCategoryModalHTML,
            confirmationModalreset);
    },
    open_modal_field: function (data, state) {
        if (data.type === "select") {
            this.listSelectValues = [];
            $('#field-name-select').removeClass('is-invalid').removeClass('is-valid');

            if (state === "new") {
                $('#modalFieldSelect .modal-title').text("Ajout d'un Événement");
                $('#addButtonFieldSelect').text("Ajouter");
            } else {
                $('#modalFieldSelect .modal-title').text("Modification de l'Événement");
                $('#addButtonFieldSelect').text("Enregistrer");
            }

            $('.select_list').empty();

            if (data.values) {
                $.each(data.values, (i, value) => {
                    const valueFieldSelect = new FieldSelectValue(value, (id) => {
                        this.deleteSelectValue(id);
                    });
                    this.addSelectedValue(valueFieldSelect);
                    valueFieldSelect.addTo('.select_list');
                });
            }
            $('#field-name-select').val(data.field_name);
            $('#field-key-select').val(data.field_key);
            $('#field-state-select').val(state);
            $('#field-index-select').val(data.index);
            $('#field-old-name-select').val(data.field_name);

            if (data.mandatory_group || data.mandatory) {
                $('#checkbox-input-field-sl').prop('checked', true);
                $('#checkbox-input-field-sl').parent().find(".mandatory-container").children().show();
                $('#select-input-field-sl').prop('disabled', false);
                $('#select-input-field-sl').val(data.mandatory_group !== undefined ? data.mandatory_group : 'Pas de groupe');
                $('#field-sl-checkbox-old-val').val('true');
            } else {
                $('#checkbox-input-field-sl').prop('checked', false);
                $('#select-input-field-sl').prop('disabled', true);
                $('.mandatory-container').children().hide();
                $('#field-sl-checkbox-old-val').val('false');
            }
            $('#modalFieldSelect').modal('show');

        } else if (data.type === "checkbox") {

            $('#field-name-checkbox').removeClass('is-invalid').removeClass('is-valid');
            if (state === "new") {
                $('#modalFieldCheckbox .modal-title').text("Ajout d'un Événement");
                $('#addButtonFieldCheckbox').text("Ajouter");
            } else {
                $('#modalFieldCheckbox .modal-title').text("Modification de l'Événement");
                $('#addButtonFieldCheckbox').text("Enregistrer");
            }

            $('#field-name-checkbox').val(data.field_name);
            $('#field-key-checkbox').val(data.field_key);
            $('#field-state-checkbox').val(state);
            $('#field-index-checkbox').val(data.index);
            $('#field-old-name-checkbox').val(data.field_name);

            if (data.mandatory_group || data.mandatory) {

                $('#checkbox-input-field-ch').prop('checked', true);
                $('#checkbox-input-field-sl').parent().find(".mandatory-container").children().show();
                $('#select-input-field-ch').prop('disabled', false);
                $('#select-input-field-ch').val(data.mandatory_group !== undefined ? data.mandatory_group : 'Pas de groupe');
                $('#field-ch-checkbox-old-group-val').val(data.mandatory_group);
                $('#field-ch-checkbox-old-val').val('true');

            } else {
                $('#checkbox-input-field-ch').prop('checked', false);
                $('.mandatory-container').children().hide();
                $('#select-input-field-ch').prop('disabled', true);
                $('#field-ch-checkbox-old-val').val('false');
            }

            $('#modalFieldCheckbox').modal('show');

        } else if (data.type === "string" || data.type === "number") {
            $('#field-name-string-number').removeClass('is-invalid').removeClass('is-valid');

            if (state === "new") {

                $('#modalFieldStringAndNumber .modal-title').text("Ajout d'un Événement");
                $('#addButtonFieldStringAndNumber').text("Ajouter");
            } else {
                $('#modalFieldStringAndNumber .modal-title').text("Modification de l'Événement");
                $('#addButtonFieldStringAndNumber').text("Enregistrer");
            }

            let text = "Saisie de caractères uniquement";
            if (data.type === "number") {
                text = "Saisie de nombres uniqument";
            }

            $('#modalFieldStringAndNumber .form-text').text(text);
            $('#field-name-string-number').val(data.field_name);
            $('#field-key-string-number').val(data.field_key);
            $('#field-state-string-number').val(state);
            $('#field-index-string-number').val(data.index);
            $('#field-type-string-number').val(data.type);
            $('#field-old-name-string-number').val(data.field_name);

            if (data.mandatory_group || data.mandatory) {
                $('#checkbox-input-field-nb-str').prop('checked', true);
                $('#checkbox-input-field-nb-str').parent().find(".mandatory-container").children().show();
                $('#select-input-field-nb-str').prop('disabled', false);
                $('#select-input-field-nb-str').val(data.mandatory_group !== undefined ? data.mandatory_group : 'Pas de groupe');
                $('#field-str-nb-checkbox-old-val').val('true');

            } else {
                $('#checkbox-input-field-nb-str').prop('checked', false);
                $('#select-input-field-nb-str').prop('disabled', true);
                $('.mandatory-container').children().hide();
                $('#field-str-nb-checkbox-old-val').val('false');
            }

            if (data.is_ocr) {
                $('#checkbox-input-field-nb-ocr').prop('checked', true);
                $('#checkbox-input-field-nb-ocr-old-val').val('true');
                $("#ocr-container").children().show();
                $('#field-ocr-regex-search').val(data.ocr_regex_search);
            } else {
                $('#checkbox-input-field-nb-ocr').prop('checked', false);
                $('#checkbox-input-field-nb-ocr-old-val').val('false');
                $("#ocr-container").children().hide();
                $('#field-ocr-regex-search').val("");
            }

            $('#modalFieldStringAndNumber').modal('show');
        }
    },
    open_modal_category: function (data) {
        //Reseting values inside the list when closed
        this.listActionPlanned = [];
        this.listActionTaken = [];


        $('.list-action-taken, .list-action-planned').empty();

        if (data.category_key === undefined) {
            $('#category-title').text("Ajout d'une Catégorie");
            $('#addButtonCate').text("Ajouter");
        } else {
            $('#category-title').text("Modification de la Catégorie");
            $('#addButtonCate').text("Enregistrer");
        }

        if (data.actions_planned) {
            $.each(data.actions_planned.values, (i, action) => {
                const isLastIndex = i === data.actions_planned.values.length - 1;
                const actionPlanned = new FieldSelectValue(action, (id) => {
                    this.deleteActionPlanned(id);
                });
                this.addActionPlanned(actionPlanned);
                actionPlanned.addTo('.list-action-planned');
                if (isLastIndex) {
                    this.lastIndexActionPlanned = actionPlanned.getID();
                }
            });
            this.listActionPlannedCopy = JSON.parse(JSON.stringify(this.listActionPlanned));
        }

        if (data.actions_taken) {
            $.each(data.actions_taken.values, (i, action) => {
                const isLastIndex = i === data.actions_taken.values.length - 1;
                const actionTaken = new FieldSelectValue(action, (id) => {
                    this.deleteActionTaken(id);
                });
                this.addActionTaken(actionTaken);

                actionTaken.addTo('.list-action-taken');
                if (isLastIndex) {
                    this.lastIndexActionTaken = actionTaken.getID();
                }
            });
            this.listActionTakenCopy = JSON.parse(JSON.stringify(this.listActionTaken));
        }

        $('#color_input').val(data.category_color);
        $('#category-name').val(data.category_name);
        $('#category-shortname').val(data.category_shortname);
        $('#category-key').val(data.category_key);
        $('#old-category-key').val(data.category_key);

        const modalCheckboxes = $('#modalCate input[type="checkbox"]');
        $.each(modalCheckboxes, (index, elem) => {
            const checkboxName = $(elem).attr('id');
            const checked = data.vehicle_types.includes(checkboxName);
            $(elem).prop('checked', checked);
        });

        if (data.address_mandatory) {
            $('#address-mandatory').prop('checked', true);
        }
        if (data.one_checkbox_mandatory) {
            $('#one-checkbox-mandatory').prop('checked', true);
        }

        const fields = ['#category-key', '#category-shortname', '#category-name'];
        fields.forEach((field) => {
            $(field).removeClass('is-invalid');
        });

        $('#modalCate').modal('show');
    },
    close_modal_category: function (saveData) {
        const category_modal_info = {
            "fields": undefined,
            "actions_taken": {"type": "select", "values": []},
            "actions_planned": {"type": "select", "values": []}
        };

        category_modal_info.category_name = $('#category-name').val().trim().replace(/ +/g, ' '); //Permet de ne pas avoir d'espace en trop;
        category_modal_info.category_shortname = $('#category-shortname').val();
        category_modal_info.category_key = $('#old-category-key').val();
        category_modal_info.new_category_key = $('#category-key').val() !== $('#old-category-key').val() ? $('#category-key').val() : undefined;

        if ($('#old-category-key').val() === '') {
            category_modal_info.category_key = category_modal_info.new_category_key;
        }

        this.lastIndexActionPlanned = null;
        this.lastIndexActionTaken = null;

        const fields = ['#category-key', '#category-shortname', '#category-name'];

        const regex = /[^A-Za-z0-9_\.]+|^.*_[^A-Za-z0-9_\.]*$/; // Use for checking category_key string

        const category_key = $('#old-category-key').val();

        let other_category_keys = [];

        $.each($('.event-category'), (index, elem) => {
            other_category_keys.push($(elem).attr('id'));
        });

        other_category_keys = other_category_keys.filter(e => e !== category_key);

        fields.forEach((field) => {
            if ($(field).val() === '') {
                $(field).addClass('is-invalid');
            } else {
                if (field === '#category-key' && (!regex.test($(field).val()) && other_category_keys.includes($(field).val()))) {
                    $(field).addClass('is-invalid');
                } else {
                    $(field).removeClass('is-invalid');
                }
            }
        });

        category_modal_info.category_color = $('#color_input').val();
        const modalCheckboxes = $('#modal-checkbox input[type="checkbox"]');

        const checkedValues = [];
        $.each(modalCheckboxes, (index, elem) => {
            if ($(elem).is(':checked')) {
                checkedValues.push($(elem).attr('id'));
            }
            $(elem).prop('checked', true);
        });

        category_modal_info.vehicle_types = checkedValues;

        if ($('#address-mandatory').is(':checked')) {
            category_modal_info.address_mandatory = true;
        }

        if ($('#one-checkbox-mandatory').is(':checked')) {
            category_modal_info.one_checkbox_mandatory = true;
        }

        if (this.listActionTaken.length > 0 || !this.areEqualDeep(this.listActionTaken, this.listActionTakenCopy)) {
            $.each(this.listActionTaken, (index, value) => {
                let data = value.getData();
                if (data.value_name === undefined) return false;
                if (data.value_name === "") return false;
                category_modal_info.actions_taken.values.push(value.getData());
            });
        }
        if (this.listActionPlanned.length > 0 || !this.areEqualDeep(this.listActionPlanned, this.listActionPlannedCopy)) {
            $.each(this.listActionPlanned, (index, value) => {
                let data = value.getData();
                if (data.value_name === undefined) return false;
                if (data.value_name === "") return false;
                category_modal_info.actions_planned.values.push(value.getData());
            });
        }

        const ActionTakenValid = category_modal_info.actions_taken.values.length === this.listActionTaken.length;

        const ActionPlannedValid = category_modal_info.actions_planned.values.length === this.listActionPlanned.length;

        const ActionsAreValid = ActionTakenValid && ActionPlannedValid;

        if (ActionsAreValid && !$('#category-key,#category-shortname,#category-name').hasClass('is-invalid')) {
            $('#modalCate').modal('hide'); // Hide the modal
            saveData(category_modal_info);
        } else {
            saveData();
        }
    },
    close_modal_field_checkbox: function (saveData, action) {
        const field_checkbox_modal_info = {"type": "checkbox"};
        const myStr = $('#field-name-checkbox').val().trim().replace(/ +/g, ' '); //Permet de ne pas avoir d'espace en trop
        let nbCols = Math.ceil(myStr.length / 10); // 10 Caractères = 1 col

        const hasTheSameFieldName = $('#field-old-name-checkbox').val() === myStr;

        field_checkbox_modal_info.state = $('#field-state-checkbox').val();
        field_checkbox_modal_info.index = $('#field-index-checkbox').val();
        field_checkbox_modal_info.field_key = $('#field-key-checkbox').val();
        field_checkbox_modal_info.field_name = $('#field-old-name-checkbox').val();

        if ($('#select-input-field-ch').val() === 'Pas de groupe' && $('#checkbox-input-field-ch').prop('checked')) {
            field_checkbox_modal_info.mandatory = true;
        } else if ($('#checkbox-input-field-ch').prop('checked')) {
            field_checkbox_modal_info.mandatory_group = $('#select-input-field-ch').val();
        }

        if (!hasTheSameFieldName && myStr !== "") {
            if (myStr.length > 4) {
                nbCols += 1;
            }
            if (!hasTheSameFieldName) {
                field_checkbox_modal_info.cols = nbCols;
            }
            field_checkbox_modal_info.field_name = myStr;
            saveData(field_checkbox_modal_info);
            $('#modalFieldCheckbox').modal('hide');

        } else {
            if (action === "add" && myStr === "") {
                $('#field-name-checkbox').addClass('is-invalid');
            } else {
                saveData(field_checkbox_modal_info);
                $('#modalFieldCheckbox').modal('hide');
            }
        }

    },
    close_modal_field_select: function (saveData) {
        const field_select_modal_info = {"type": "select", "values": []};
        const myStr = $('#field-name-select').val().trim().replace(/ +/g, ' '); //Permet de ne pas avoir d'espace en trop
        let nbCols = Math.ceil(myStr.length / 10); // 10 Caractères = 1 col

        $('.select_list').removeClass('is-invalid');

        const hasTheSameFieldName = $('#field-old-name-select').val() === myStr;

        field_select_modal_info.field_key = $('#field-key-select').val();
        field_select_modal_info.state = $('#field-state-select').val();
        field_select_modal_info.index = $('#field-index-select').val();

        field_select_modal_info.field_name = $('#field-old-name-select').val();

        if (myStr === "") {
            $('#field-name-select').addClass('is-invalid');
            $('#field-name-select').removeClass('is-valid');
        } else {
            $('#field-name-select').addClass('is-valid');
            $('#field-name-select').removeClass('is-invalid');

        }
        if (!hasTheSameFieldName) {
            if (myStr.length > 4) {
                nbCols += 1;
            }
            field_select_modal_info.cols = nbCols;
            field_select_modal_info.field_name = myStr;
        }

        if ($('#select-input-field-sl').val() === 'Pas de groupe' && $('#checkbox-input-field-sl').prop('checked')) {
            field_select_modal_info.mandatory = true;
        } else if ($('#checkbox-input-field-sl').prop('checked')) {
            field_select_modal_info.mandatory_group = $('#select-input-field-sl').val();
        }

        $.each(this.listSelectValues, (index, value) => {
            let data = value.getData();
            if (data.value_name === undefined || data.value_name === "") return false;
            field_select_modal_info.values.push(value.getData());
        });

        if (field_select_modal_info.values.length !== 0 && !$('#field-name-select').hasClass('is-invalid')) {
            saveData(field_select_modal_info);
            $('#modalFieldSelect').modal('hide');
        }
    },
    close_modal_field_string_and_number: function (saveData, action) {
        const field_string_number_modal_info = {};
        const myStr = $('#field-name-string-number').val().trim().replace(/ +/g, ' '); //Permet de ne pas avoir d'espace en trop
        let nbCols = Math.ceil(myStr.length / 10); // 10 Caractères = 1 col

        const hasTheSameFieldName = $('#field-old-name-string-number').val() === myStr;

        field_string_number_modal_info.state = $('#field-state-string-number').val();
        field_string_number_modal_info.index = $('#field-index-string-number').val();
        field_string_number_modal_info.field_key = $('#field-key-string-number').val();
        field_string_number_modal_info.field_name = $('#field-old-name-string-number').val();

        if ($('#select-input-field-nb-str').val() === 'Pas de groupe' && $('#checkbox-input-field-nb-str').prop('checked')) {
            field_string_number_modal_info.mandatory = true;

        } else if ($('#checkbox-input-field-nb-str').prop('checked')) {
            field_string_number_modal_info.mandatory_group = $('#select-input-field-nb-str').val();
        }

        if ($('#checkbox-input-field-nb-ocr').prop('checked')) {
            field_string_number_modal_info.is_ocr = true;
            field_string_number_modal_info.ocr_regex_search = $('#field-ocr-regex-search').val();
        }

        if (!hasTheSameFieldName && myStr !== "") {
            if (myStr.length > 4) {
                nbCols += 1;
            }
            field_string_number_modal_info.cols = nbCols;
            field_string_number_modal_info.field_name = myStr;
            field_string_number_modal_info.type = $('#field-type-string-number').val();
            saveData(field_string_number_modal_info);
            $('#modalFieldStringAndNumber').modal('hide');
        } else {
            if (action === "add" && myStr === "") {
                $('#field-name-string-number').addClass('is-invalid');
            } else {
                saveData(field_string_number_modal_info);
                $('#modalFieldStringAndNumber').modal('hide');
            }
        }
    },
    open_modal_field_delete_confirmation: function (field_key) {
        $('#field-key-delete-modal').val(field_key);
        $('#dontAskAgainCheckboxField').prop('checked', false);
        $('#confirmationFieldModal').modal('show');
    },
    close_modal_field_delete_confirmation: function (deleteOption) {
        deleteOption([!$('#dontAskAgainCheckboxField').prop('checked'), $('#field-key-delete-modal').val()]);
        $('#confirmationFieldModal').modal('hide');
    },
    open_modal_category_delete_confirmation: function (category_key) {
        $('#category-key-delete-modal').val(category_key);
        $('#dontAskAgainCheckboxCategory').prop('checked', false);
        $('#confirmationCategoryModal').modal('show');
    },
    close_modal_category_delete_confirmation: function (deleteOption) {
        deleteOption([!$('#dontAskAgainCheckboxCategory').prop('checked'), $('#category-key-delete-modal').val()]);
        $('#confirmationCategoryModal').modal('hide');
    },
    addSelectedValue: function (selectedValue) {
        this.listSelectValues.push(selectedValue);
    },
    addActionTaken: function (actionTaken) {
        this.listActionTaken.push(actionTaken);
    },
    addActionPlanned: function (actionPlanned) {
        this.listActionPlanned.push(actionPlanned);
    },
    moveSelectValue: function (oldIndex, newIndex) {
        const movedElement = this.listSelectValues.splice(oldIndex, 1)[0];
        this.listSelectValues.splice(newIndex, 0, movedElement);
    },
    moveActionTaken: function (oldIndex, newIndex) {
        const movedElement = this.listActionTaken.splice(oldIndex, 1)[0];
        this.listActionTaken.splice(newIndex, 0, movedElement);
    },
    moveActionPlanned: function (oldIndex, newIndex) {
        const movedElement = this.listActionPlanned.splice(oldIndex, 1)[0];
        this.listActionPlanned.splice(newIndex, 0, movedElement);
    },
    deleteSelectValue: function (SelectValueId) {
        this.listSelectValues = this.listSelectValues.filter((selectedValue) => selectedValue.id !== SelectValueId);
    },
    deleteActionTaken: function (actionTakenId) {
        this.listActionTaken = this.listActionTaken.filter((actionTaken) => actionTaken.id !== actionTakenId);
    },
    deleteActionPlanned: function (actionPlannedId) {
        this.listActionPlanned = this.listActionPlanned.filter((actionPlanned) => actionPlanned.id !== actionPlannedId);
    },
    getLastSelectValueIndex: function (field_key) {
        const values = this.listSelectValues;
        if (values.length <= 0) {
            this.lastIndexSelectValue = `${field_key}_0`;
        } else {
            this.lastIndexSelectValue = values.reduce((maxKey, obj) => {
                if (obj.id > maxKey) {
                    return obj.id;
                }
                return maxKey;
            }, "");
            const parts = this.lastIndexSelectValue.split('_');
            parts[2] = parseInt(parts[2]) + 1; // Assuming numeric format
            this.lastIndexSelectValue = parts.join('_');
        }
        return this.lastIndexSelectValue;
    },
    getLastActionPlannedIndex: function () {
        if (this.lastIndexActionPlanned) {
            const match = this.lastIndexActionPlanned.match(/^([a-zA-Z]+)(\d+)$/);
            if (match) {
                const prefix = match[1];
                const number = parseInt(match[2], 10) + 1;
                this.lastIndexActionPlanned = prefix + number;
            }
        } else {
            this.lastIndexActionPlanned = 'ap1';
        }
        return this.lastIndexActionPlanned;
    },
    getLastActionTakenIndex: function () {
        if (this.lastIndexActionTaken) {
            const match = this.lastIndexActionTaken.match(/^([a-zA-Z]+)(\d+)$/);
            if (match) {
                const prefix = match[1];
                const number = parseInt(match[2], 10) + 1;
                this.lastIndexActionTaken = prefix + number;
            }
        } else {
            this.lastIndexActionTaken = 'at1';
        }
        return this.lastIndexActionTaken;
    },
    areEqualDeep: function (obj1, obj2) {
        if (obj1.length !== obj2.length) {
            return false;
        }
        for (let i = 0; i < obj1.length; i++) {
            if (JSON.stringify(obj1[i]) !== JSON.stringify(obj2[i])) {
                return false;
            }
        }
        return true;
    }
};