FROM python:3.12.3
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 50051
CMD ["python3", "-u", "main.py"]