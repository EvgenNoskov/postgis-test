FROM python:3.12-alpine

# upgrade pip
RUN pip install --upgrade pip



# permissions and nonroot user for tightened security
RUN adduser -D nonroot
RUN mkdir /home/app/ && chown -R nonroot:nonroot /home/app
RUN mkdir -p /var/log/flask-app && touch /var/log/flask-app/flask-app.err.log && touch /var/log/flask-app/flask-app.out.log
RUN chown -R nonroot:nonroot /var/log/flask-app
WORKDIR /home/app
USER nonroot

# copy all the files to the container
COPY --chown=nonroot:nonroot . .

# venv
ENV VIRTUAL_ENV=/home/app/venv


# python setup
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV ENV=prod
RUN pip install pipenv build psycopg2-binary waitress
RUN pipenv install

RUN python -m build --wheel
RUN pip install ./dist/app-0.0.1-py3-none-any.whl

