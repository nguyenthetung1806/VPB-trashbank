import mongoengine

#mongodb://<dbuser>:<dbpassword>@ds117136.mlab.com:17136/lincognito

host = "ds117136.mlab.com"
port = 17136
db_name = "lincognito"
user_name = "admin"
password = "admin"


def connect():
    mongoengine.connect(db_name, host=host, port=port, username=user_name, password=password)

def list2json(l):
    import json
    return [json.loads(item.to_json()) for item in l]


def item2json(item):
    import json
    return json.loads(item.to_json())
