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


class Comment_Delete(Resource):
    def get(self, _id):
        comment = Comment_Main.objects.with_id(_id)
        comment.delete()
        return Response('deleted')


class Comment_Put(Resource):
    def get(self, cmtact, _id):
        comment = Comment_Main.objects.with_id(_id)
        data = json.loads(request.data.decode('utf-8'))
        if cmtact == "comment":
            comment.update(comment=data['cmtact'])
        elif cmtact == "action":
            comment.update(action=data['cmtact'])

        return Response(comment)
