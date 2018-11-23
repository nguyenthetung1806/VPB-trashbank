from flask import Flask, render_template, request, redirect, session, Response, jsonify
from flask_restful import Resource, Api, reqparse
import mlab
import json
from mongoengine import *


class Date_Main(Document):
    date = StringField()


class Date_Create(Resource):
    def post(self):
        data = json.loads(request.data.decode('utf-8'))
        date = Date_Main(date=data['date'])
        date.save()
        date = date.to_json()
        return Response(date)


class Date_GetAll(Resource):
    def get(self):
        date = Date_Main.objects
        date = date.to_json()
        return Response(date)
