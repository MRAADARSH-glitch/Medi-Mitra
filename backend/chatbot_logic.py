from medical_data import medical_data

def find_disease(user_input):

    user_input = user_input.lower()
    best_match = None
    max_score = 0

    for disease in medical_data:
        score = 0

        for symptom in disease["symptoms"]:
            if symptom in user_input:
                score += 1

        if score > max_score:
            max_score = score
            best_match = disease

    return best_match
