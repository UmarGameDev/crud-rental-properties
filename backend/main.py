from fastapi import FastAPI

from backend.router import router
import sentry_sdk

sentry_sdk.init(
    dsn="https://d8f78416360669106e67f3d84e3bd401@o4510492429582336.ingest.us.sentry.io/4510492434890752",
    environment="production",
    traces_sample_rate=1.0,
    send_default_pii=True,
)
app = FastAPI()


@app.get('/')
def get_root():
    return {'message': 'Hello World!'}


app.include_router(router)
