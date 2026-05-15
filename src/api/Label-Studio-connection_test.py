# 1. set up virtual environment and pip install label-studio-sdk
# 2. run label-studio to make the connection 


from label_studio_sdk import LabelStudio

LABEL_STUDIO_URL = "http://localhost:8080"   # or whatever port Label Studio uses
LABEL_STUDIO_API_KEY = "INSERT_API_HERE" # anytime you push, do not include your API Key
client = LabelStudio(
    base_url=LABEL_STUDIO_URL,
    api_key=LABEL_STUDIO_API_KEY,
)

