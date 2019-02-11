#!/usr/bin/env bash
echo "Creating user for MongoDB..."
mongo admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --eval "
db = db.getSiblingDB(\`"$DATABASE\`");
db.createUser({
    user: \`"$APP_USER\`",
    pwd: \`"$APP_PASSWORD\`",
    roles: [
        {
            role: 'readWrite',
            db: \`"$DATABASE\`"
        }
    ]
});
"
echo "Finished creating user for MongoDB"
