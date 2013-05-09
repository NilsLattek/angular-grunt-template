# Angular template for new apps using grunt

Folder structure is based on [http://cliffmeyers.com/blog/2013/4/21/code-organization-angularjs-javascript](http://cliffmeyers.com/blog/2013/4/21/code-organization-angularjs-javascript).

##Setup:

    $ npm install .
    $ npm install -g grunt-cli
    $ npm install -g karma

Start a watch task and a live reload server at [localhost:8000](http://localhost:8000/build/index.html):

    $ grunt
    $ open http://localhost:8000/build/index.html

Run unittests from the console using phantomjs (additionaly you could start the watch task and open the test/testrunner.html in the browser):

    $ grunt test

Or use karma executable for continuous running:

    $ karma start

Production build (Make sure you know the convetions for [ngmin](https://github.com/btford/ngmin#conventions):

    $ grunt build


##Proxy support:
There are two ways for talking to a backend server. You could use [CORS](http://enable-cors.org/) or use grunt-connect-proxy which is preconfigured in the Gruntfile. Just look for the connect -> proxies section. By default every request to `/api` gets proxied to `localhost:3000/api`. Deactivate the proxy by removing `configureProxies` from the default task.