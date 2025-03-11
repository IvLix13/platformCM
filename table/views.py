from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ControlCM
from .serializer import ControlCMEntrySeializer, KRIVODataSerialzer
from manager.models import CustomUser
import logging
import requests
import pymssql

logger = logging.getLogger('table')
"""class RequestsServcm():
    def requests(sql_query, parameters):
        # URL API на ASP.NET
       payload = {
            "Query": sql_query,
            "Parameters": parameters
            }

        logger.info(f"{payload}: Data sended")
        response = requests.post(url, json=payload)
        #response = "getdata"
        if response.status_code == 200:
            data = response.json()
            print("data from sbd2")
            return data
        else:
            print("Ошибка:", response.status_code, response.text)"""

class Forms():
    def __init__(self, user, date='WEEK'):
        self.user_before_search = CustomUser.objects.get(userlogin=user)
        self.user = f"{self.user_before_search.f} {self.user_before_search.i[0]}.{self.user_before_search.o[0]}."
        self.date = date

    def create_query(self):
        match self.date:
            case 'ALL':
                self.query = f"SELECT logs.error_text, logs.ppt_path, logs.slide_index, logs.shape_name, logs.error_date_time, md.filename  FROM dbo.CheckUuvStaffDic a JOIN dbo.CheckAllUuvResponsiblesRel b ON a.id = b.uuv_staff_id JOIN dbo.CheckMain_withAvtomat md ON md.guid=b.main_guid JOIN dbo.AutoUpdateLog logs ON logs.ppt_path LIKE CONCAT(md.folder_ppt_address, '%') WHERE a.name LIKE '%{self.user}%'"
                self.parameters = [self.date, self.user]

            case _:
                self.query = f"SELECT logs.error_text, logs.ppt_path, logs.slide_index, logs.shape_name, logs.error_date_time, md.filename  FROM dbo.CheckUuvStaffDic a JOIN dbo.CheckAllUuvResponsiblesRel b ON a.id = b.uuv_staff_id JOIN dbo.CheckMain_withAvtomat md ON md.guid=b.main_guid JOIN dbo.AutoUpdateLog logs ON logs.ppt_path LIKE CONCAT(md.folder_ppt_address, '%') WHERE a.name LIKE '%{self.user}%' AND logs.error_date_time >= DATEADD({self.date}, -1, GETDATE()) "
                self.parameters = [self.date, self.user]

    
    def get_forms(self, params=None):
        self.create_query()
        #data = RequestsServcm.requests(self.query, self.parameters)
        conn = pymssql.connect(
        )
        logger.info(f"Query:{self.query}")
        cursor = conn.cursor()
        try:
            cursor.execute(self.query, params or [])
            columns = [column[0] for column in cursor.description]
            rows = cursor.fetchall()
            result = [dict(zip(columns, row)) for row in rows]
            logger.info(f"Data from sbd2 for {self.user}: {result}")
            return result
        finally:
            cursor.close()
            conn.close()
            


"""
def get_start_data(user):
    date = 'WEEK'
    userlogin = 'Likhobaba305'
    userlogin = CustomUser.objects.get(userlogin=userlogin)
    username_for_search = f"{userlogin.f} {userlogin.i[0]}.{userlogin.o[0]}."
    f = Forms(username_for_search, date)
    data = f.get_forms() # получаем данные из KRIVO.dbo.AutoUpdateLog
    logger.info(f"Get KRIVO data for {userlogin}: {data}\n End Data of {userlogin}.\n\n\n")   
    return data
    

"""




