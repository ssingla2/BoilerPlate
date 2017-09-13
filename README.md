# Escala Boilerplate

## Quick start

1. Clone this repo i.e., `git clone http://gitlab.infoedge.com/static5/escala-boilerplate.git projectName` <br/>
2. Move to the appropriate directory i.e., `cd projectName` <br/>
3. Please copy and paste `package.json` file in parallel to `projectName` to share node_modules throughout the group and run `npm install` to install dependencies. <br/>
4. Again, repeat step 2. <br/>
5. Run `rimraf .git` in order to clean the git repo. <br/>
6. At this point you can run `nodemon server.js` to see the app at `http://localhost:3000`.


## Connect it to github

1. Type `git init`. <br/>
2. Type `git add --all` to add all of the relevant files and do commit by `git commit -m "your message here..."`. <br/>
3. Now go to gitlab and log in to your account. <br/>
4. Click the `New Project` button in the top-right and click `Create Project` button. <br/>
5. Now add your local repo to remote repo by `git remote add origin repoUrl`. <br/>
6. Push your changes with `git push origin master`.


## Dependencies

1. You need to clone repo `100` in parallel to your project by running <br/>
   `git clone http://gitlab.infoedge.com/static5/100.git`


## Steps to build

1. You can build this project by running <br/>
   `grunt build --target=dev` 
   <br/>
   Here, in target you can specify the build environment. For example, dev, test & stag. <br/>
   This gives us power to do environment specific configuration for our project. <br/>

Now you're ready to go!


## Steps to test

1. You can test this project by running <br/>
    `npm test or grunt test`

## Boilerplate Tree


### Abstract Directory Structure

* gen
* src
	+ app
    	+ root
    		+ actionTypes
    		+ routeConfig.js
    		+ routeDependencies.js
    	+ `<flowName>`
    	+ vendor   
    	+ config.js
    + c
    + j
    + resources
    	+ svg
	+ sass
	+ coverage
	+ test
	    +  _it
	        +   `<apiName>`-spec.js
	    +  _matcher
	    +  `<flowName>`
	        +  `<fileName>`-spec.js
* expressRoute.js
* Gruntfile.js
* main.html
* server.js <br/>
...


### Detailed Directory Structure

1. `app`: App folder contain different flows of your app like, root, newflow etc. You can define your new flow here.
2. `app/root`: Root contain global things that are shared by other flows like, Root component, Route config, Route dependencies etc. You can define shared things here.
3. `app/root/actionTypes`: Common action types across the app . You can define new action type here.
4. `app/root/routeConfig.js`: Config file for app route.
5. `app/root/routeDependencies.js`: Define your route related dependencies here.
6. `app/<flowName>`: Dummy flow to give you a head start. You can rename it accordingly.
7. `app/vendor`: Vendor contains third party and internal libraries.
8. `app/config.js`: Common configuration for the app. You can define resource URL's, constants etc. here.
9. `c`: Contains generated css files.
9. `j`: Contains generated JS files.
10. `resources/svg`: Contains svg files. This svg are automatically converted into webfonts when you run build command. To generate webfont simply add svg here and make a build.
11. `sass`: Source folder for sass files. Write your css here.
12. `coverage` : Coverage report folder for test cases. View your testcases in .html format here.
13. `test` : Unit testcase and integration testcases are kept here.
14. `test/_it/<apiName>-spec.js` : Integration test contains schema based testcases of Api(s).
15. `test/<flowName>/<fileName>-spec.js` : Unit test cases file for each file in app/ folder.
12. `expressRoute.js`: App routing handled here, you can introduce a new route in this file.
13. `Gruntfile.js`: Contains build config for different flows. If you are introducing a new flow then you need to add its build config here.
14. `main.html`: Main page of our application. You can use this page for locally running the app.
15. `server.js`: This file is used by local node server to handle app routing and remote api handling.
