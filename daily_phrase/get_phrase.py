import random
import os
from django.conf import settings



class GetPhrase():
    def __init__(self):
        self.extract_phrase()
        

    def extract_phrase(self):
        file_path = os.path.join(settings.DATA_DIR, "phrase.txt")
        with open(file_path, "r", encoding="utf-8") as f:
            self.phrases = {i: line.strip() for i, line in enumerate(f, 1)}
      
    def get_some_phrase(self):
        random_phrase = random.choice(list(self.phrases.values()))
        return random_phrase


        