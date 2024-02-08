from fastapi import FastAPI, BackgroundTasks, HTTPException, Query
from fastapi.responses import JSONResponse
import uuid
import asyncio
import requests
import json
app = FastAPI()
response1 = {}
token_expiration_status = {}

@app.get('/', response_class=JSONResponse)
def hello():
    return {"message": "doodhpeelo"}

@app.get('/status', response_class=JSONResponse)
def status():
    return {'response': "Active hit"}

@app.get('/get_all_codes', response_class=JSONResponse)
def get_all_codes():
    return response1

@app.get('/get_qr_codes', response_class=JSONResponse)
async def get_qr_codes(background_tasks: BackgroundTasks):
    for i in range(50):
        response1["qr:" + str(i)] = await get_qr_code(i)
    background_tasks.add_task(expire_qr_code)
    return response1

async def expire_qr_code():
    for i in range(50):
        await asyncio.sleep(5)

        response1["qr:" + str(i)]['qr'] = 'expired'

async def get_qr_code(i):
    website = "localhost:8000"
    unique_token = str(uuid.uuid4())
    attendance_link="input attendance link"
    tokenized_link = f"http://{website}/verify?token={unique_token}&id={i}&attendancelink={attendance_link}"
    return {'tokenized_link':tokenized_link, 'token': unique_token, 'qr': 'active',}

@app.get('/verify', response_class=JSONResponse)
async def verify(token: str, id: int = Query(None, alias='id')):
    # Check if token is present in your system
    if token in response1["qr:" + str(id)]["token"] and response1["qr:" + str(id)]['qr'] == 'active':
        attendance_status=await requests.get(response1["qr:" + str(id)]["attendancelink"])
        return {attendance_status.json()}
    
    raise HTTPException(status_code=404, detail="Verification failed")


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000, debug=True)
