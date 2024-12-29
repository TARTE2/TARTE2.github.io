let data = {

    "event_config": [
        {
            "category_key": "voirie",
            "category_name": "Accès Voirie",
            "category_color": "#3149c4",
            "category_shortname": "Voirie",
            "fields": [
                {
                    "field_key": "voirie_0",
                    "field_name": "Stationnement génant",
                    "cols": 4,
                    "type": "checkbox"
                },
                {
                    "field_key": "voirie_1",
                    "field_name": "Travaux",
                    "cols": 4,
                    "type": "checkbox"
                },
                {
                    "field_key": "voirie_2",
                    "field_name": "Route Impraticable",
                    "cols": 4,
                    "type": "checkbox"
                },
                {
                    "field_key": "voirie_3",
                    "field_name": "Branchage génant, élagage",
                    "cols": 4,
                    "type": "checkbox"
                }
            ],
            "vehicle_types": [
                "crane",
                "bom",
                "ampliroll",
                "vl"
            ]
        },
        {
            "category_key": "bac",
            "category_name": "Problème BAC",
            "category_shortname": "Bac",
            "category_color": "#c41014",
            "fields": [
                {
                    "field_key": "bac_0",
                    "field_name": "Type de bac",
                    "type": "select",
                    "cols": 4,
                    "values": [
                        {
                            "value_name": "Bac 2 roues ordures ménagères",
                            "value_key": "bac_0_0"
                        },
                        {
                            "value_name": "Bac 4 roues ordures ménagères",
                            "value_key": "bac_0_2"
                        }
                    ]
                },
                {
                    "field_key": "bac_1",
                    "field_name": "Volume",
                    "cols": 4,
                    "type": "select",
                    "values": [
                        {
                            "value_name": "120 litres",
                            "value_key": "bac_1_0"
                        },
                        {
                            "value_name": "180 litres",
                            "value_key": "bac_1_2"
                        },
                        {
                            "value_name": "240 litres",
                            "value_key": "bac_1_1"
                        },
                        {
                            "value_name": "660 litres",
                            "value_key": "bac_1_4"
                        }
                    ]
                },
                {
                    "field_key": "bac_2",
                    "field_name": "Numéro de bac",
                    "cols": 2,
                    "type": "string"
                },
                {
                    "field_key": "bac_3",
                    "field_name": "Cuve cassée",
                    "cols": 3,
                    "type": "checkbox"
                },
                {
                    "field_key": "bac_4",
                    "field_name": "Problème puce",
                    "cols": 3,
                    "type": "checkbox"
                },
                {
                    "field_key": "bac_5",
                    "field_name": "Roue cassée",
                    "cols": 2,
                    "type": "checkbox"
                },
                {
                    "field_key": "bac_8",
                    "field_name": "Non conforme",
                    "cols": 3,
                    "type": "checkbox"
                },
                {
                    "field_key": "bac_7",
                    "field_name": "Couvercle cassé",
                    "cols": 3,
                    "type": "checkbox"
                },
                {
                    "field_key": "bac_9",
                    "field_name": "Sortie après passage du camion",
                    "cols": 5,
                    "type": "checkbox"
                },
                {
                    "field_key": "bac_6",
                    "field_name": "Bac avalé",
                    "cols": 3,
                    "type": "checkbox"
                }
            ],
            "vehicle_types": [
                "crane",
                "bom",
                "ampliroll",
                "vl"
            ]
        },
        {
            "category_key": "dechet",
            "category_name": "Problème déchet",
            "category_shortname": "Déchet",
            "category_color": "#3e7f00",
            "fields": [
                {
                    "field_key": "dechet_0",
                    "field_name": "Sac déchiré",
                    "cols": 4,
                    "type": "checkbox"
                },
                {
                    "field_key": "dechet_1",
                    "field_name": "Déchets non conforme",
                    "cols": 4,
                    "type": "checkbox"
                },
                {
                    "field_key": "dechet_2",
                    "field_name": "Déchets verts",
                    "cols": 4,
                    "type": "checkbox"
                },
                {
                    "field_key": "dechet_3",
                    "field_name": "Déchets au sol",
                    "cols": 4,
                    "type": "checkbox"
                },
                {
                    "field_key": "dechet_6",
                    "field_name": "Bac qui déborde",
                    "cols": 4,
                    "type": "checkbox"
                },
                {
                    "field_key": "dechet_7",
                    "field_name": "Présence verre",
                    "cols": 3,
                    "type": "checkbox"
                }
            ],
            "vehicle_types": [
                "crane",
                "bom",
                "ampliroll",
                "vl"
            ]
        },
        {
            "category_key": "other",
            "category_name": "Autres",
            "category_shortname": "Autres",
            "category_color": "#696666",
            "fields": [
                {
                    "field_key": "other_0",
                    "field_name": "Altercation usager",
                    "cols": 3,
                    "type": "checkbox"
                },
                {
                    "field_key": "other_1",
                    "field_name": "Dépot bac",
                    "cols": 2,
                    "type": "checkbox"
                },
                {
                    "field_key": "other_2",
                    "field_name": "Retrait bac",
                    "cols": 2,
                    "type": "checkbox"
                },
                {
                    "field_key": "other_3",
                    "field_name": "Bac non présenté pour intervention",
                    "cols": 6,
                    "type": "checkbox"
                }
            ],
            "vehicle_types": [
                "crane",
                "bom",
                "ampliroll",
                "vl"
            ]
        },
        {
            "category_key": "column",
            "category_name": "Colonne",
            "category_shortname": "Colonne",
            "category_color": "#9c6615",
            "fields": [
                {
                    "field_key": "column_0",
                    "field_name": "Type colonne",
                    "cols": 4,
                    "type": "select",
                    "values": [
                        {
                            "value_key": "column_0_0",
                            "value_name": "Aérienne"
                        },
                        {
                            "value_key": "column_0_1",
                            "value_name": "Enterrée"
                        }
                    ]
                },
                {
                    "field_key": "column_1",
                    "field_name": "Colonne brulée",
                    "cols": 3,
                    "type": "checkbox"
                },
                {
                    "field_key": "column_2",
                    "field_name": "Champignon défectueux",
                    "cols": 4,
                    "type": "checkbox"
                },
                {
                    "field_key": "column_3",
                    "field_name": "Ouverture défectueuse",
                    "cols": 3,
                    "type": "checkbox"
                },
                {
                    "field_key": "column_4",
                    "field_name": "Manque de signalétique",
                    "cols": 3,
                    "type": "checkbox"
                }
            ],
            "vehicle_types": [
                "crane"
            ]
        }
    ],
    "ripper_buttons": []

}