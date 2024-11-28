import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:123456@127.0.0.1/newproject'  #问题出在这里，需要正确连接数据库
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)  
    FLASK_ADMIN_SWATCHLIST = ['models.Data']