import os
from pathlib import Path
from datetime import timedelta, datetime
import base64
from decouple import config

# ------------------------------------------------------------
# BASE DIRECTORY
BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------------------------
# SECURITY
SECRET_KEY = config("DJANGO_SECRET_KEY", default="your-secret-key")
DEBUG = config("DEBUG", default=False, cast=bool)
ALLOWED_HOSTS =['*']

# ------------------------------------------------------------
# INSTALLED APPS
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",

    # Local apps
    "Users",
    "payment",
    "withdrawal",
    "rentals",
    "support",
]

# ------------------------------------------------------------
# MIDDLEWARE
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ------------------------------------------------------------
# URLS & WSGI
ROOT_URLCONF = "Liquidity.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "Liquidity.wsgi.application"

# ------------------------------------------------------------
# DATABASE — MySQL (cPanel)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST"),
        "PORT": config("DB_PORT", cast=int),
        "OPTIONS": {
            "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# ------------------------------------------------------------
# AUTH & PASSWORD VALIDATION
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTH_USER_MODEL = "Users.CustomUser"

# ------------------------------------------------------------
# INTERNATIONALIZATION
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Nairobi"
USE_I18N = True
USE_TZ = True

# ------------------------------------------------------------
# STATIC & MEDIA FILES
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles" 

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ------------------------------------------------------------
# REST FRAMEWORK & JWT
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ------------------------------------------------------------
# CORS SETTINGS
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "https://front.liquiinvestke.co.ke",
    "https://liquiinvestke.co.ke",
    "https://www.liquiinvestke.co.ke",
    "http://localhost:5173"
]

# ------------------------------------------------------------
# CSRF & SESSION SECURITY
CSRF_TRUSTED_ORIGINS = [
    "https://front.liquiinvestke.co.ke",
    "https://liquiinvestke.co.ke",
    "https://www.liquiinvestke.co.ke",
]
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = "None"

# ------------------------------------------------------------
# SECURITY HEADERS
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# ------------------------------------------------------------
# EMAIL (GMAIL SMTP)
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST")
EMAIL_PORT = config("EMAIL_PORT", cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", cast=bool)
EMAIL_HOST_USER = config("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = config("EMAIL_PASSWORD")
DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL", default=EMAIL_HOST_USER)

# ------------------------------------------------------------
# M-PESA CONFIG
MPESA_ENV = config("MPESA_ENV", default="production")
MPESA_BASE_URL = (
    "https://sandbox.safaricom.co.ke"
    if MPESA_ENV == "sandbox"
    else "https://api.safaricom.co.ke"
)
MPESA_CONSUMER_KEY = config("MPESA_CONSUMER_KEY")
MPESA_CONSUMER_SECRET = config("MPESA_CONSUMER_SECRET")
MPESA_SHORTCODE = config("MPESA_SHORTCODE")
MPESA_PASSKEY = config("MPESA_PASSKEY")
MPESA_CALLBACK_URL = config("MPESA_CALLBACK_URL")
MPESA_INITIATOR_NAME = config("MPESA_INITIATOR_NAME")
MPESA_INITIATOR_PASSWORD = config("MPESA_INITIATOR_PASSWORD")
MPESA_TILL_NUMBER=config("MPESA_TILL_NUMBER")
MPESA_BASE64_ENCODED_CREDENTIALS = base64.b64encode(
    f"{MPESA_CONSUMER_KEY}:{MPESA_CONSUMER_SECRET}".encode()
).decode()

# Note: For production, generate timestamp dynamically in your views/functions
MPESA_TIMESTAMP = datetime.now().strftime("%Y%m%d%H%M%S")
MPESA_PASSWORD = base64.b64encode(
    f"{MPESA_SHORTCODE}{MPESA_PASSKEY}{MPESA_TIMESTAMP}".encode()
).decode()

# ------------------------------------------------------------
# LOGGING
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG" if DEBUG else "INFO",
    },
}

# ------------------------------------------------------------
# DEFAULT PRIMARY KEY FIELD TYPE
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"