import mongoengine

# mongodb://<dbuser>:<dbpassword>@ds155091.mlab.com:55091/vpb

host = "ds155091.mlab.com"
port = 55091
db_name = "vpb"
user_name = "admin_real"
password = "admin123"


def connect():
    mongoengine.connect(db_name, host=host, port=port, username=user_name, password=password)
    print('connected to database')

def list2json(l):
    import json
    return [json.loads(item.to_json()) for item in l]

def item2json(item):
    import json
    return json.loads(item.to_json())
