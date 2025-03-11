import pymssql
import logging 
from interaction_with_servcm import RequestsServcm

logger = logging.getLogger('krivo')

class Forms():
    def __init__(self, user, date='WEEK'):
        self.user = user
        self.date = date

    def create_query(self):
        match self.date:
            case 'ALL':
                self.query = f"SELECT logs.error_text, logs.ppt_path, logs.slide_index, logs.shape_name, logs.error_date_time, md.filename  FROM dbo.CheckUuvStaffDic a JOIN dbo.CheckAllUuvResponsiblesRel b ON a.id = b.uuv_staff_id JOIN dbo.CheckMain_withAvtomat md ON md.guid=b.main_guid JOIN dbo.AutoUpdateLog logs ON logs.ppt_path LIKE CONCAT(md.folder_ppt_address, '%') WHERE a.name LIKE '%@user%'"
                self.parameters = [self.date, self.user]

            case _:
                self.query = f"SELECT logs.error_text, logs.ppt_path, logs.slide_index, logs.shape_name, logs.error_date_time, md.filename  FROM dbo.CheckUuvStaffDic a JOIN dbo.CheckAllUuvResponsiblesRel b ON a.id = b.uuv_staff_id JOIN dbo.CheckMain_withAvtomat md ON md.guid=b.main_guid JOIN dbo.AutoUpdateLog logs ON logs.ppt_path LIKE CONCAT(md.folder_ppt_address, '%') WHERE a.name LIKE '%@user%' AND logs.error_date_time >= DATEADD(@date, -1, GETDATE()) "
                self.parameters = [self.date, self.user]


    def get_sqlserver_connection(self):
        conn = pymssql.connect(
        )
        
    
    def get_forms(self, params=None):
            self.create_query()
            data = RequestsServcm.requests(self.query, self.parameters)
            if (data):
                logger.info(f'Extract data successfully')
            return data
        
    

    def get_forms2(self, params=None):
        query = self.create_query()
        conn = self.get_sqlserver_connection()
        logger.info("succefully connect to krivo")
        cursor = conn.cursor()

        try:
            cursor.execute(query, params or [])
            columns = [columns[0] for column in cursor.description]
            rows = cursor.fetchall()
            result = [dict(zip(columns, row)) for row in rows]
            logger.info('Extract data successfully')
            return result
        
        finally:
            cursor.close()
            conn.close()
        
    