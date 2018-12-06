import mongoengine

# mongodb://<dbuser>:<dbpassword>@ds155091.mlab.com:55091/vpb

host = "ds123844.mlab.com"
port = 23844
db_name = "vpb-rb"
user_name = "admin"
password = "vpbank12345"


def connect():
    mongoengine.connect(db_name, host=host, port=port, username=user_name, password=password)
    print('connected to database')

def list2json(l):
    import json
    return [json.loads(item.to_json()) for item in l]

def item2json(item):
    import json
    return json.loads(item.to_json())
