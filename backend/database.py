import sqlite3


DATABASE_NAME = "jobtracker.db"


def get_db():
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection