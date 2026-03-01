# HIS Adapter Layer

from app.services.mock_his import get_patient_from_his


class HISAdapter:
    @staticmethod
    def fetch_patient(patient_id: str):
        """
        Secure abstraction layer between portal and HIS
        """
        patient = get_patient_from_his(patient_id)

        if not patient:
            return None

        # ⭐ place for future transformations / masking
        return patient