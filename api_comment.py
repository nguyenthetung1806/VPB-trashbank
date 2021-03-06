from flask import Flask, render_template, request, redirect, session, Response, jsonify
from flask_restful import Resource, Api, reqparse
import mlab
import json
from mongoengine import *


class Comment_Main(Document):
    group = StringField()
    page = StringField()
    date = StringField()
    comment = StringField()
    action = StringField()


class Comment_Create(Resource):
    def post(self):
        data = json.loads(request.data.decode('utf-8'))
        print(data)
        comment = Comment_Main(group=data['group'],
                               page=data['page'],
                               date=data['date'],
                               comment=data['comment'],
                               action=data['action'])
        comment.save()
        comment = comment.to_json()
        return Response(comment)


class Comment_Get(Resource):
    def get(self, group, page, date):
        comment = Comment_Main.objects(
            group=group, page=page, date=date)
        comment = comment.to_json()
        return Response(comment)


class Comment_GetOne(Resource):
    def get(self, _id):
        comment = Comment_Main.objects.with_id(_id)
        comment = comment.to_json()
        return Response(comment)


class Comment_Delete(Resource):
    def delete(self, _id):
        comment = Comment_Main.objects.with_id(_id)
        comment.delete()
        return Response('deleted')


class Comment_Put(Resource):
    def put(self, _id):
        comment = Comment_Main.objects.with_id(_id)
        data = json.loads(request.data.decode('utf-8'))
        comment.update(comment=data['comment'], action=data['action'])
        return Response(comment)
