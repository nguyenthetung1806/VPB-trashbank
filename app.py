from flask import Flask, render_template, request, redirect, session, Response, jsonify
from flask_restful import Resource, Api, reqparse
import mlab
import json
from base64 import b64encode
from bson.objectid import ObjectId
from mongoengine import *
from urllib.parse import parse_qs, urlparse
import pandas as pd
from io import BytesIO

app = Flask(__name__)
mlab.connect()
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('task')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/admin')
def admin():
    return render_template('admin.html')


@app.route('/admin/create-page')
def admin_createpage():
    return render_template('create_page.html')


@app.route('/admin/create-date')
def admin_createdate():
    return render_template('create_date.html')


@app.route('/admin/create-sheet')
def admin_createsheet():
    return render_template('create_sheet.html')


@app.route('/<group>/<page_name>/')
def page(group, page_name):
    return render_template('page.html', group=group, page_name=page_name)


@app.route('/create-sheet')
def create_sheet():
    return render_template('create-sheet.html')


class Date_Main(Document):
    date = StringField()


class Page_Main(Document):
    group = StringField()
    page = ListField()


class Comment_Main(Document):
    group = StringField()
    page = StringField()
    sheet = StringField()
    date = StringField()
    username = StringField()
    comment = StringField()
    action = StringField()


class Sheet_Main(Document):
    group = StringField()
    page = StringField()
    sheet = StringField()
    date = StringField()
    array = ListField()


class Comment_Create(Resource):
    def post(self):
        data = json.loads(request.data.decode('utf-8'))
        print(data)
        comment = Comment_Main(group=data['group'],
                               page=data['page'],
                               sheet=data['sheet'],
                               date=data['date'],
                               username=data['username'],
                               comment=data['comment'],
                               action=data['action'])
        comment.save()
        comment = comment.to_json()
        return Response(comment)


api.add_resource(Comment_Create, '/api/Comment')


class Comment_Get(Resource):
    def get(self, group, page, date, sheet):
        comment = Comment_Main.objects(group = group, page=page, date = date, sheet = sheet)
        comment = comment[1: 5]
        comment = comment.to_json()
        return Response(comment)


api.add_resource(Comment_Get, '/api/Comment/<group>/<page>/<date>/<sheet>')


class Sheet_Create(Resource):
    def post(self):
        array = request.files['array']
        array = BytesIO(array.read())
        df_array = pd.read_excel(array)
        df_array = df_array.round(2)
        df_array = df_array.fillna("")
        data_dict = dict(request.form)
        group = data_dict['group'][0]
        page = data_dict['page'][0]
        date = data_dict['date'][0]
        sheet = data_dict['sheet'][0]
        df_array = df_array.values.T.tolist()
        result = Sheet_Main(group=group,
                            page=page,
                            sheet=sheet,
                            date=date,
                            array=df_array
                            )
        result.save()
        result = result.to_json()
        return data_dict


api.add_resource(Sheet_Create, '/api/Sheet')


class Sheet_Get(Resource):
    def get(self, group, page):
        sheet = Sheet_Main.objects(group=group, page=page)
        sheet = sheet.to_json()
        return Response(sheet)


api.add_resource(Sheet_Get, '/api/Sheet/<group>/<page>')


class Sheet_Get_WithDate(Resource):
    def get(self, group, page, date):
        sheet = Sheet_Main.objects(group=group, page=page, date=date)
        sheet = sheet.to_json()
        return Response(sheet)


api.add_resource(Sheet_Get_WithDate, '/api/Sheet-Date/<group>/<page>/<date>')


class Page_Create(Resource):
    def post(self):
        data = json.loads(request.data.decode('utf-8'))
        data = Page_Main(group=data['group'],
                         page=data['page'],
                         )
        data.save()
        data = data.to_json()
        return Response(data)


api.add_resource(Page_Create, '/api/Page')


class Page_GetAll(Resource):
    def get(self):
        page = Page_Main.objects
        page = page.to_json()
        return Response(page)


api.add_resource(Page_GetAll, '/api/Page')


class Date_GetAll(Resource):
    def get(self):
        date = Date_Main.objects
        date = date.to_json()
        return Response(date)


api.add_resource(Date_GetAll, '/api/Date')


class Date_Create(Resource):
    def post(self):
        data = json.loads(request.data.decode('utf-8'))
        date = Date_Main(date=data['date'])
        date.save()
        date = date.to_json()
        return Response(date)


api.add_resource(Date_Create, '/api/Date')


if __name__ == '__main__':
    app.run(debug=True)
