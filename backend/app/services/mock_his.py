# 🏥 Mock HIS — simulates hospital system

mock_patients_db = {
    "P1001": {
        "patient_id": "P1001",
        "name": "Arjun Nair",
        "age": 45,
        "condition": "Hypertension",
    },
    "P008": {
        "patient_id": "P008",
        "name": "Meera Pillai",
        "age": 32,
        "condition": "Asthma",
    },
    "P9999": {
        "patient_id": "P9999",
        "name": "Emergency Case",
        "age": 60,
        "condition": "Cardiac Arrest",
    },
}


def get_patient_from_his(patient_id: str):
    """Simulate HIS lookup"""
    return mock_patients_db.get(patient_id)