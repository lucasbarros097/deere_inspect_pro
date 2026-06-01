from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://postgres:postgres@db:5432/deere_inspect"
    app_name: str = "Deere Inspect API"
    api_prefix: str = "/api"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
