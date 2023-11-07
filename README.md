# Messaging App
<b>I have stopped working on this app in order to start developing a better messaging app: Superchat!

Made with Next.js, Typescript and Firebase, it's probably better that this but definitely better education-wise. Thanks for any contributions made to this project!
</b>
This app has been made with MERN Stack. It is still a work in progress and it's purely made for educational purposes, <i>any suggestions to improve the code or add new fancy features are welcome! </i>

<h2>Configuration</h2>

- In The react app root, create a .env file and add:
<ul>
<li>
A Google id, this is necessary for enabling google login services and can be obtained from this <a href="https://console.cloud.google.com/apis/dashboard"> link</a>.
Once you obtain the id, open the newly created .env file and type:
<pre>VITE_GOOGLE_ID=&ltYour_Google_Id&gt</pre>
</li>
<li>
The ExpressJs Server Link: <pre>VITE_SERVER_LINK=&ltYour_Server_Link&gt</pre>
</li>
</ul>

- In the ExpressJs app root, create a .env file and add:
<ul>
<li>Your MongoDB uri: <pre>MONGODB_URI=&ltYour_MongoDB_Uri&gt</pre></li>
<li>Your ExpressJs server port:<pre>SERVER_PORT=&ltYour_Server_Port&gt</pre></li>
<li>A secret hash for hashing account passwords:
<pre>SECRET_HASH = &ltYour_Secret_Hash&gt</pre>
</li>
<li>A JWT access token secret:<pre>ACCESS_TOKEN_SECRET = &ltYour_Access_Token_Secret&gt</pre></li>
<li>A JWT refresh token secret:<pre>ACCESS_TOKEN_SECRET = &ltYour_Refresh_Token_Secret&gt</pre></li>
</ul>

<h2>Starting the app</h2>
In order to start the app, you will need to:
<ul>
<li>Open Git Bash in the react app root and type <code>npm run dev</code></li>
<li>Open Git Bash in the ExpressJs app root and type <code>npm start</code></li>
</ul>

Thank you for your contributions!
