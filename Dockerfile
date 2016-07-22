# current stable LTS on top of debian image
FROM node:4.4.7-wheezy

# create non-root user account
RUN groupadd -r nodeuser && useradd -r -g nodeuser nodeuser

# add global node stuff
RUN npm install -g sails@0.12.3 pm2@1.1.3

# create and expose the volume for the data
RUN mkdir /data && chown nodeuser:nodeuser /data
VOLUME /data

# install node modules to tmp to create a layer with dependencies installed
ADD app/package.json /tmp/package.json
RUN cd /tmp && npm install

# create and populate the main app folder
RUN mkdir /app && cp -a /tmp/node_modules /app && chown nodeuser:nodeuser /app
COPY app /app

ENV NODE_ENV production

WORKDIR /app

USER nodeuser

EXPOSE 1337

CMD ["/app/run.sh"]