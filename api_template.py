from flask import Flask, render_template, request, redirect, session, Response, jsonify
from flask_restful import Resource, Api, reqparse
import mlab
import json
from mongoengine import *


class Template_Main(Document):
    template_name = StringField()
    template_css_row = ListField()
    template_css_column = ListField()


class Template_Main(Resource):
    def post(self):
        template = json.loads(request.data.decode('utf-8'))
        template = Template_Main(template_name=data['template_name'],
                                 template_css_row=data['template_css_row'],
                                 )
        template.save()
        template = date.to_json()
        return Response(template)


class Date_GetAll(Resource):
    def get(self):
        date = Date_Main.objects
        date = date.to_json()
        return Response(date)
