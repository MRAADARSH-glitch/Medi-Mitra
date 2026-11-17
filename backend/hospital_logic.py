def recommend_hospital(disease):

    if not disease:
        return "Visit nearby general hospital."

    # If full disease object passed
    if isinstance(disease, dict):
        hospital_type = disease.get("hospital_type", "general")
        return f"You should visit a {hospital_type} specialist."

    # If only disease name passed
    return "Visit nearby general hospital."
