from python:slim
COPY requirements.txt /opt/requirements.txt
RUN pip3 install -r /opt/requirements.txt
COPY youtube.py /opt/youtube.py
WORKDIR /opt
ENTRYPOINT [ "celery","-A","youtube","worker","-E" ]