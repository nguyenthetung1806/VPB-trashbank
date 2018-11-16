import mongoengine

#mongodb://<dbuser>:<dbpassword>@ds117136.mlab.com:17136/lincognito

host = "ds039311.mlab.com"
port = 39311
db_name = "bom_web_app"
user_name = "admin"
password = "admin123456"


def connect():
    mongoengine.connect(db_name, host=host, port=port, username=user_name, password=password)

def list2json(l):
    import json
    return [json.loads(item.to_json()) for item in l]

def item2json(item):
    import json
    return json.loads(item.to_json())
