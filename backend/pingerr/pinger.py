import base64
import requests
print("Pinger is running")
url = ""
print(requests.get(url).text)