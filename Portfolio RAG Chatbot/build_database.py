from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
import os


###################################################### ENV VARIABLES ##################################################
DATA_PATH = "PDFs"
VECSTORE_PATH = "vector_store"
########################################################################################################################


# Parameters : Chunk Size, Overlap and Separators.
def split_documents(pdf_documents):
    
    chunk_splitter = RecursiveCharacterTextSplitter (
        chunk_size=400,             
        chunk_overlap=200,           
        length_function=len,
        separators=["###CHUNK###"]  
    )

    return chunk_splitter.split_documents(pdf_documents)

# Parameters : Vector Store, and Embedding function.
def store_chunks_in_vector_store(document_chunks):

    vector_store = Chroma(persist_directory = VECSTORE_PATH, embedding_function = OpenAIEmbeddings( model="text-embedding-3-small"))
    vector_store.add_documents(document_chunks)

    print(f"Added {len(document_chunks)} chunks to Chroma and saved the database.")
    

pdf_loader = PyPDFDirectoryLoader("PDFs")
pdf_pages = pdf_loader.load()

chunks = split_documents(pdf_pages)
for chunk in chunks:
    chunk.page_content = chunk.page_content.replace('###CHUNK###', '').strip()

print(f"Created {len(chunks)} document Chunks.")

store_chunks_in_vector_store(chunks)