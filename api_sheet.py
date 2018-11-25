from flask import Flask, render_template, request, redirect, session, Response, jsonify
from flask_restful import Resource, Api, reqparse
import mlab
import json
from mongoengine import *
from io import BytesIO
import pandas as pd

class Sheet_Main(Document):
    group = StringField()
    page = StringField()
    sheet = StringField()
    date = StringField()
    array = ListField()


class Sheet_Create(Resource):
    def post(self):
        array = request.files['data']
        array = BytesIO(array.read())
        df_array = pd.read_excel(array)
        df_array = df_array.round(2)
        df_array = df_array.fillna("")
        df_array = df_array.T.reset_index().values.T.tolist()
        data_dict = dict(request.form)
        group = data_dict['group'][0]
        page = data_dict['page'][0]
        date = data_dict['date'][0]
        sheet = data_dict['sheet'][0]
        result = Sheet_Main(group=group,
                            page=page,
                            sheet=sheet,
                            date=date,
                            array=df_array
                            )
        result.save()
        result = result.to_json()
        print(result)

        return data_dict


class Sheet_Get(Resource):
    def get(self, group, page):
        sheet = Sheet_Main.objects(group=group, page=page)
        sheet = sheet.to_json()
        return Response(sheet)


class Sheet_Get_WithDate(Resource):
    def get(self, group, page, date):
        sheet = Sheet_Main.objects(group=group, page=page, date=date)
        sheet = sheet.to_json()
        return Response(sheet)
