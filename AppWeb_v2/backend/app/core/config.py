from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    SECRET_KEY: str = "EPRAN123_CHANGE_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    DB_DRIVER: str = "ODBC Driver 17 for SQL Server"
    DB_SERVER: str = "172.174.41.110"
    DB_NAME: str = "epran-qa"
    DB_USER: str = "dev"
    DB_PASSWORD: str = "abcd1234*"

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    AZURE_STORAGE_CONNECTION_STRING: str = ""
    AZURE_CONTAINER_NAME: str = "epran"
    AZURE_ACCOUNT_NAME: str = "saeprandat001"

    VAPID_PRIVATE_KEY: str = ""
    VAPID_PUBLIC_KEY: str = ""
    VAPID_EMAIL: str = "mailto:admin@epran.com"

    SCHEDULER_INTERVAL_MINUTES: int = 60
    SCHEDULER_TIMEZONE: str = "America/Caracas"

    FRONTEND_URL: str = "http://localhost:4200"

    @property
    def DATABASE_URL(self) -> str:
        driver = self.DB_DRIVER.replace(" ", "+")
        return (
            f"mssql+pyodbc://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_SERVER}/{self.DB_NAME}"
            f"?driver={driver}&TrustServerCertificate=yes"
        )

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
