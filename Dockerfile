# current stable LTS on top of debian image
FROM node:4.4.4-wheezy

# add global node stuff
RUN npm install -g sails@0.12.3 pm2@1.1.3

# create non-root user account
RUN groupadd -r sails && useradd -r -g sails sails

# create and expose the volume for the uploaded data
RUN mkdir /data && chown sails:sails /data
VOLUME /data

# install node modules to tmp to create a layer with
# dependencies installed
ADD app/package.json /tmp/package.json
RUN cd /tmp && npm install

# create and populate the main app folder
RUN mkdir /app && cp -a /tmp/node_modules /app && chown -R sails:sails /app
WORKDIR /app
COPY app /app

# default is production environment
ENV NODE_ENV production

# indicate sails listening port
EXPOSE 1337

# switch users
USER sails

# run the app
CMD ["/app/run.sh"]