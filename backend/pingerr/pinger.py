import base64
import requests
print("Pinger is running")
url = "https://forms.office.com/Pages/ResponsePage.aspx?id=9NpbLPKP2Uu9VHxQqyGVkLnj6G_GfHtLguCYqsDH3etUNzc3WTZXSVNGNjAyMDFURDdaMzdJN1FMMC4u&origin=QRCode"
print(requests.get(url).text)