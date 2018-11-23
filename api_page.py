from flask import Flask, render_template, request, redirect, session, Response, jsonify
from flask_restful import Resource, Api, reqparse
import mlab
import json
from mongoengine import *


class Page_Main(Document):
    group = StringField()
    page = ListField()


class Page_GetAll(Resource):
    def get(self):
        page = Page_Main.objects
        page = page.to_json()
        return Response(page)


class Page_Create(Resource):
    def post(self):
        data = json.loads(request.data.decode('utf-8'))
        data = Page_Main(group=data['group'],
                         page=data['page'],
                         )
        data.save()
        data = data.to_json()
        return Response(data)
