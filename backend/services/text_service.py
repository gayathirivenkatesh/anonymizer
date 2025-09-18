import spacy
from faker import Faker
import re
from datetime import datetime, timedelta

# Load spaCy model (make sure en_core_web_sm is installed in requirements.txt)
nlp = spacy.load("en_core_web_sm")
faker = Faker()

ENTITY_MAP = {
    "PERSON": faker.first_name,
    "GPE": faker.city,
    "ORG": faker.company,
    "DATE": lambda: faker.date(pattern="%d %B"),
}

RELATIVE_DATES = {
    "yesterday": (datetime.today() - timedelta(days=1)).strftime("%d %B"),
    "today": datetime.today().strftime("%d %B"),
    "tomorrow": (datetime.today() + timedelta(days=1)).strftime("%d %B"),
}

def anonymize_text(text: str) -> str:
    doc = nlp(text)
    new_text = text
    replaced_entities = {}

    # Replace recognized entities
    for ent in doc.ents:
        if ent.label_ in ENTITY_MAP:
            fake_value = ENTITY_MAP[ent.label_]()
            replaced_entities.setdefault(ent.text, fake_value)
            pattern = r'\b' + re.escape(ent.text) + r'(?=\b|[.,!?])'
            new_text = re.sub(pattern, replaced_entities[ent.text], new_text)

    # Replace remaining proper nouns (NNP) not already replaced
    for token in doc:
        if token.tag_ == "NNP" and token.text not in replaced_entities:
            fake_value = faker.first_name()
            replaced_entities[token.text] = fake_value
            pattern = r'\b' + re.escape(token.text) + r'(?=\b|[.,!?])'
            new_text = re.sub(pattern, fake_value, new_text)

    # Replace relative dates
    for rel_word, fake_rel in RELATIVE_DATES.items():
        pattern = r'\b' + re.escape(rel_word) + r'\b([.,!?]?)'
        new_text = re.sub(pattern, lambda m: fake_rel + m.group(1), new_text, flags=re.IGNORECASE)

    return new_text
