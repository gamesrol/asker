# asker
Twich.tv chatbot to manage questionnaires

## Configure
- Copy and rename js/config.js.tmpl to js/config.js and add your credentials.
- Copy and rename css/custom.css.tmpl to css/custom.css and add your style.
- Copy and rename data.js.tmpl to data.js and add your questions.
- To have messages cleared before viewers read them, set the chat to a delay of at least 2 seconds.
- Not change cliend_id
- Get your token in:
    https://id.twitch.tv/oauth2/authorize
        ?response_type=token
        &client_id=ryx33z1oht9oigg6lcgf7t6s7ks0zc
        &redirect_uri=http://localhost
        &scope=moderator%3Amanage%3Achat_messages+chat%3Aread+chat%3Aedit


## Usage
- Open with the obs or the program you use. As web, setting as source the local path of index.html 


