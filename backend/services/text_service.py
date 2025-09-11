import spacy
from faker import Faker
import re
from datetime import datetime, timedelta

nlp = spacy.load("en_core_web_sm")
faker = Faker()

# Entity map for spaCy entities
ENTITY_MAP = {
    "PERSON": faker.first_name,
    "GPE": faker.city,
    "ORG": faker.company,
    "DATE": lambda: faker.date(pattern="%d %B"),
}

# Relative dates mapping
RELATIVE_DATES = {
    "yesterday": (datetime.today() - timedelta(days=1)).strftime("%d %B"),
    "today": datetime.today().strftime("%d %B"),
    "tomorrow": (datetime.today() + timedelta(days=1)).strftime("%d %B"),
}

def anonymize_text(text: str) -> str:
    doc = nlp(text)
    new_text = text
    replaced_entities = {}

    # 1️⃣ Replace spaCy recognized entities
    for ent in doc.ents:
        if ent.label_ in ENTITY_MAP:
            fake_value = ENTITY_MAP[ent.label_]()
            if ent.text not in replaced_entities:
                replaced_entities[ent.text] = fake_value
            else:
                fake_value = replaced_entities[ent.text]
            pattern = r'\b' + re.escape(ent.text) + r'(?=\b|[.,!?])'
            new_text = re.sub(pattern, fake_value, new_text)

    # 2️⃣ Replace remaining proper nouns (NNP)
    for token in doc:
        if token.tag_ == "NNP" and token.text not in replaced_entities:
            fake_value = faker.first_name()
            replaced_entities[token.text] = fake_value
            pattern = r'\b' + re.escape(token.text) + r'(?=\b|[.,!?])'
            new_text = re.sub(pattern, fake_value, new_text)

    # Replace relative dates (after names/cities replacement)
    for rel_word, fake_rel in RELATIVE_DATES.items():
    # Match relative word with optional punctuation after it
        pattern = r'\b' + re.escape(rel_word) + r'\b([.,!?]?)'
        new_text = re.sub(pattern, lambda m: fake_rel + m.group(1), new_text, flags=re.IGNORECASE)


    return new_text
