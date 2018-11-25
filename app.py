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
# API
from api_date import Date_Main, Date_Create, Date_GetAll
from api_page import Page_Main, Page_Create, Page_GetAll
from api_sheet import Sheet_Main, Sheet_Create, Sheet_Get, Sheet_Get_WithDate
from api_comment import Comment_Main, Comment_Create, Comment_Get, Comment_Put, Comment_Delete

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


@app.route('/create-template')
def create_template():
    return render_template('create-tempalate.html')


api.add_resource(Comment_Create, '/api/Comment')
api.add_resource(Comment_Get, '/api/Comment/<group>/<page>/<date>')
api.add_resource(Comment_Put, '/api/Comment/<cmtact>/<id>')
api.add_resource(Comment_Delete, '/api/Comment/<id>')


api.add_resource(Sheet_Create, '/api/Sheet')
api.add_resource(Sheet_Get, '/api/Sheet/<group>/<page>')
api.add_resource(Sheet_Get_WithDate, '/api/Sheet-Date/<group>/<page>/<date>')


api.add_resource(Page_Create, '/api/Page')
api.add_resource(Page_GetAll, '/api/Page')


api.add_resource(Date_GetAll, '/api/Date')
api.add_resource(Date_Create, '/api/Date')


class Template_Main(Document):
    template = ListField()


if __name__ == '__main__':
    app.run(debug=True)
