# logger_config.py
import logging
import sys
from loguru import logger

class InterceptHandler(logging.Handler):
    def emit(self, record):
        try:
            log_level = logger.level(record.levelname).name
        except ValueError:
            log_level = record.levelno  # Fallback to standard logging level

        logger_opt = logger.opt(depth=6, exception=record.exc_info)
        logger_opt.log(log_level, record.getMessage())

def setup_loguru_for_fastapi():
    # Remove existing Uvicorn and FastAPI loggers
    logging.getLogger("uvicorn").handlers = []
    logging.getLogger("uvicorn.error").handlers = []
    logging.getLogger("uvicorn.access").handlers = []

    # Set up Loguru to handle everything
    logger.remove()
    logger.add(
        sys.stdout,
        format="{time:HH:mm:ss} | {level: <8} | {module}:{function}:{line} - {message}",
        level="INFO",
        backtrace=True,
        diagnose=True
    )

    # Intercept default logging and route to loguru
    logging.basicConfig(handlers=[InterceptHandler()], level=0)
