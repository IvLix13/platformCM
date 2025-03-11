import requests

class RequestsServcm():
    def requests(sql_query, parameters):
        # URL API на ASP.NET
        
        # Формируем данные для отправки
        payload = {
            "Query": sql_query,
            "Parameters": parameters
            }

# Отправляем POST-запрос
        response = requests.post(url, json=payload)

        # Обработка ответа
        if response.status_code == 200:
            data = response.json()
            print("data from sbd2")
            return data
        else:
            print("Ошибка:", response.status_code, response.text)

    

