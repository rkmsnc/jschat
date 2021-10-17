# jschat
A Javascript Chat Application with NodeJs Server using Websockets

### Server 
    npm install && nodejs server.js
    
### Client
    <html>

    <head>
      <title>My Chat</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="jschat.css" />
    </head>

    <body>
      <div class="chat-main"></div>
      <script type="text/javascript" src="jschat.js"></script>
      <script>
        new JSChat({
          https: false,
          wss: false,
          httpHost: '127.0.0.1:8000',
          wsHost: '127.0.0.1:5000',
          chatTitle: 'JSChat',
          loginTitle: 'Login as',
          loginButtonText: 'Let me in'
        })
      </script>
    </body>

    </html>

### Screenshots
<img src="https://github.com/rkmsnc/jschat/raw/main/jschat.png" style="height:300px"><img src="https://github.com/rkmsnc/jschat/raw/main/jschat2.png" style="height:300px"><img src="https://github.com/rkmsnc/jschat/raw/main/jschat3.png" style="height:300px">
