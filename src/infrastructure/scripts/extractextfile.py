import pdfplumber
import sys
from docx import Document

def extract_text(file_path):
    """
    Extracts text from a PDF or Word file.

    Args:
        file_path (str): Path to the file.

    Returns:
        str: Extracted text from the file.
    """
    try:
        if file_path.endswith('.pdf'):
            return extract_text_from_pdf(file_path)
        elif file_path.endswith('.docx'):
            return extract_text_from_word(file_path)
        else:
            raise ValueError("Unsupported file format. Only .pdf and .docx are supported.")
    except FileNotFoundError:
        print(f"Error: File not found: {file_path}")
        sys.exit(1)
    except Exception as e:
        print(f"Error while extracting text: {e}")
        sys.exit(1)

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    with pdfplumber.open(pdf_path) as pdf:
        text = ''
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:  # Ensure page_text is not None
                text += page_text + '\n'
    # Convert to UTF-8 if needed
    return text.encode('utf-8').decode('utf-8')

def extract_text_from_word(word_path):
    """Extracts text from a Word (.docx) file."""
    doc = Document(word_path)
    text = ''
    for paragraph in doc.paragraphs:
        text += paragraph.text + '\n'
    # Convert to UTF-8 if needed
    return text.encode('utf-8').decode('utf-8')

def label_text(text):
    """
    Labels the extracted text into sections like chapters, clauses, and transitories.

    Args:
        text (str): The text to be labeled.

    Returns:
        str: Text labeled with HTML-like tags.
    """
    try:
        labeled_text = []
        lines = text.split('\n')

        chapter_count = 0
        clause_count = 0

        for line in lines:
            if 'CAPÍTULO' in line:
                chapter_count += 1
                labeled_text.append(f'<h3 id="capitulo{chapter_count}" class="text-center fw-bold">{line}</h3>')  # Chapter tag
            elif 'CLÁUSULA' in line:
                clause_count += 1
                labeled_text.append(f'<h4 id="clausula{clause_count}">{line}</h4>')  # Clause tag
            elif 'PRIMERO' in line:
                labeled_text.append(f'<h4>{line}</h4>')  # Transitory tag
            elif 'SEGUNDO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            elif 'TERCERO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            elif 'CUARTO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            elif 'QUINTO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            elif 'SEXTO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            elif 'SÉPTIMO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            elif 'OCTAVO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            elif 'NOVENO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            elif 'DÉCIMO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            elif 'ONCEAVO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            elif 'UNDÉCIMO' in line:
                labeled_text.append(f'<h4>{line}</h4>')
            else:
                labeled_text.append(f'<p class="text-justify">{line}</p>')  # Generic paragraph

        return '\n'.join(labeled_text)
    except Exception as e:
        print(f"Error while labeling text: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_file>")
        sys.exit(1)

    file_path = sys.argv[1]

    # Extract text from the file
    extracted_text = extract_text(file_path)

    if not extracted_text.strip():
        print("Error: No text extracted from the file. Ensure the file is not empty or contains readable text.")
        sys.exit(1)

    # Convert to UTF-8 if not already
    extracted_text = extracted_text.encode('utf-8').decode('utf-8')

    # Label the extracted text
    labeled_text = label_text(extracted_text)

    # Print the labeled text
    print(labeled_text)



