# import fitz
import csv
import os
import traceback

from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar

from pathlib import Path
from typing import Iterable, Any

CATALOGUE_FILE = "class_catalog.pdf"
CSV_FILE = 'classes.csv'

def clear():
    # Clear csv file
    with open(CSV_FILE, 'w', newline="") as file:
        file.truncate()
        print("CSV FILE SUCCESSFULLY CLEARED")

    print("------------- Done Clearing -------------")

typ = input("> ")
if typ.lower() == 'clear':
    clear()
    exit()
elif typ.lower() != "run":
    print("NO FILE")
    exit()

print("Creating Dataset...")



# def extract_text_by_font(pdf_path, min_font_size, bold_font_names):

#     return extracted_text

""" 
    Section Header: 30, AAAAAA+TimesNewRomanPS-BoldMT
    Class Name: 12, AAAAAA+TimesNewRomanPS-BoldMT
    Class ID: 12, AAAAAA+TimesNewRomanPS-BoldMT
    
    Prerequisites: 12, DAAAAA+TimesNewRomanPS-BoldItalicMT or AAAAAA+TimesNewRomanPS-BoldMT
    
    Grade Levels: 11, DAAAAA+TimesNewRomanPS-BoldItalicMT
    Credits: 11, DAAAAA+TimesNewRomanPS-BoldItalicMT
    
    Description: 12, BAAAAA+TimesNewRomanPSMT


    Order of Operations:
    1. Identify section [category = "section_header"]
        Section global variable is set to text
    2. [next = text] until first class id found [category = None]

    3. Class ID located [if next == "id": [category = "id"] [next = "description"] else: [category = "first_section_id"]]
        if category == "first_section_id", set name to next and id to text

    4. Append onto description until prereq header is found

    5. Add prereq text

    6. Add grades
    7. Add credits [next = "name"]

"""    

def catagorize_text(font, size, text, next):
    text = text.strip()
    category = None

    if font == "AAAAAA+TimesNewRomanPS-BoldMT": 
        """
            Possible Text Types:
            Section Header (30)
            Class Name (12)
            Class ID (12)
            Prerequisites (12)
        """
        if size == 30:
            category = "section_header"
        elif size == 12 or size == 11:
            if next == "name":
                category = "name"
                next = "id"
            elif len(text) < 9:
                if next == "id":
                    category = "id"
                    next = "description"
                else:
                    category = "first_section_id"
            elif ("Prerequisites: " in text or "Prerequisite: " in text):
                next = "prerequisites"
                category = "prerequisites"
                text = text.replace("Prerequisites: ", "").replace("Prerequisite: ", "")
            else:
                next = text
    elif font == "BAAAAA+TimesNewRomanPSMT" and size == 12: 
        """
            Possible Text Types:
            Description (12)
            Prerequisite Description (12)
        """
        if next == "description":
            category = "description"
        elif next == "prerequisites":
            category = "prerequisites"
            # next = "grades"
    elif font == "DAAAAA+TimesNewRomanPS-BoldItalicMT": 
        """
            Possible Text Types:
            Prerequisites (12)
            Grade Levels (11)
            Credits (11)
        """    
        if size == 12:
            if "Prerequisite" in text:
                next = "prerequisites"
        elif size == 11:
            # grades
            if next == "prerequisites" or next == "description":
                category = "grades"
                next = "credits"
            elif next == "credits":
                next = "name"
                category = "credits"
    return (category, text, next)

schoolClass = {}
schoolClasses = []
next = "section"
category = ""
section = ""
pages = extract_pages(CATALOGUE_FILE)

for page_num, page_layout in enumerate(pages):
    if page_num < 13 or page_num > 25:
        continue
    # page_layout = pages[i]
    for element in page_layout:
        if isinstance(element, LTTextContainer):
            for text_line in element:
                if not isinstance(text_line, Iterable): 
                    continue
                
                font = ""
                size = 0

                for character in text_line:
                    if isinstance(character, LTChar):
                        size = round(character.size)
                        font = character.fontname

                        break
                
                text = text_line.get_text()
                if "      " in text:
                    text_vals = text.split("      ")
                    schoolClass["name"] = text_vals[1]
                    text = text_vals[0]
                    next = "description"
                    category = "id"
                else:
                    category, text, next = catagorize_text(font, size, text, next)
                # print(text_line.get_text(), category, next)
                print(category, next, text, "\n\n")

                if category == "section_header":
                    section = text
                elif category == "description" or category == "prerequisites":
                    if not category in schoolClass:
                        schoolClass[category] = text
                    else:
                        schoolClass[category] += " " + text
                elif category == "first_section_id":
                    schoolClass["id"] = text
                    schoolClass["name"] = next
                    next = "description"
                elif category == "credits":
                    schoolClass["credits"] = text
                    schoolClass["section"] = section
                    if not "prerequisites" in schoolClass:
                        schoolClass["prerequisites"] = "None"

                    schoolClasses.append(schoolClass)
                    schoolClass = {}
                elif category != None:
                    schoolClass[category] = text
    print(f"\r{page_num - 12}/{56} | {round((((page_num - 12)/56) * 100), 2)}% ", end="")


print(schoolClasses)


# # Create and populate the CSV file
fieldnames = ["name", "id", "description", "prerequisites", "section", "grades", "credits"]
with open("classes.csv", "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(schoolClasses)

print("\n------------- Done -------------")