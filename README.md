In each directorly (./react and ./nodejs) run:
“npm install”

Install xampp
Run mySQL on localhost
Create a database with user
Put the details into .env file in nodejs directory
Go to app.js in nodejs directory and make sure:

"db_setup.functions.refreshRelationshipMemory();" is commented
“await db_setup.functions.alterTables(true, false);” is uncommented
Then run "node app.js"
Comment “await db_setup.functions.alterTables(true, false);”
Uncomment "db_setup.functions.refreshRelationshipMemory();"
Run node app.js again

Then you can run react app using "npm start" in react dir.
React will be hosted on "localhost:3000" and nodejs on "localhost:3001"

# You can also uncomment "newAdmin" line in app.js to create new admin account.
