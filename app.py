from flask import Flask, render_template, request, redirect, session, Response, jsonify
from flask_restful import Resource, Api, reqparse
import mlab
import json
from base64 import b64encode
from bson.objectid import ObjectId
from mongoengine import *
from urllib.parse import parse_qs, urlparse

app = Flask(__name__)
app.config["SECRET_KEY"] = "piudfpasudfpa7wr09a113Q$ả$#2221y"
mlab.connect()
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('task')


@app.route('/')
def create_page():
    return render_template('create_page.html')


@app.route('/page/<page_name>')
def page(page_name):
    return render_template('page.html', page_name=page_name)


class Page_Main(Document):
    page = StringField()


class Comment_Main(Document):
    page = StringField()
    username = StringField()
    comment = StringField()
    action = StringField()


class Array_Main(Document):
    page = StringField()
    array = ListField()


class Comment(Resource):
    def post(self):
        data = json.loads(request.data.decode('utf-8'))
        comment = Comment_Main(page=data['page'],
                               username=data['username'],
                               comment=data['comment'],
                               action=data['action'])
        comment.save()
        comment = comment.to_json()
        return Response(comment)


api.add_resource(Comment, '/api/Comment')


class Comment_Get(Resource):
    def get(self, page):
        comment = Comment_Main.objects(page=page)
        comment = comment[1: 5]
        comment = comment.to_json()
        return Response(comment)


api.add_resource(Comment_Get, '/api/Comment/<page>')


class Array(Resource):
    def post(self):
        data = json.loads(request.data.decode('utf-8'))
        data = Array_Main(page=data['page'],
                          array=data['array'])
        data.save()
        data = data.to_json()
        return Response(data)


api.add_resource(Array, '/api/Array')


class Array_Get(Resource):
    def get(self, page):
        array = Array_Main.objects.get(page=page)
        array = array.to_json()
        return Response(array)


api.add_resource(Array_Get, '/api/Array/<page>')


class Page_Create(Resource):
    def post(self):
        data = json.loads(request.data.decode('utf-8'))
        data = Page_Main(page=data['page'])
        data.save()
        data = data.to_json()
        return Response(data)


api.add_resource(Page_Create, '/api/Page')


# @app.route('/delete.follow/<bet_id>/<username>', methods=['GET','POST'])
# def delete_follow(bet_id, username):
#     bet = Contract_type_1.objects.with_id(str(bet_id))
#     account = Account.objects.get(username = username)
#     account.update(pull__bet_spectator = bet_id)
#     bet.update(pull__spectator = username)
#     url = '/profile/' + username
#     return redirect(url)
if __name__ == '__main__':
    app.run(debug=True)
