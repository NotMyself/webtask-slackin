'use latest';

import request from 'request-promise';
import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';

const app = express();

const team = 'ssdug';

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (req, res) => {
  getUserInfo(req.webtaskContext.secrets.slack_token)
    .then((info) => {
      res.send(renderForm(info));
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post('/invite', (req, res) => {
  sendInvite({
    token: req.webtaskContext.secrets.slack_token,
    email: req.body.email
  })
    .then((info) => {
      console.log(info);
      res.send(renderThanks());
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.get('/slack.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(renderSlackSvg());
});

app.get('/badge.svg', (req, res) => {
  getUserInfo(req.webtaskContext.secrets.slack_token)
    .then((info) => {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(renderBadgeSvg(info));
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = fromExpress(app);

function getUserInfo(slack_token) {
  const message = {
    uri: `https://${team}.slack.com/api/users.list`,
    qs: {
      token: slack_token,
      presence: true
    },
    json: true,
    transform: (body) => {
      console.log(body);
      return {
        total: body.members.length,
        active: body.members.filter(user => user.presence === 'active').length
      };
    }
  };

  return request.get(message);
}

function sendInvite(email) {
  const message = {
    uri: `https://${team}.slack.com/api/users.admin.invite`,
    qs: email,
    json: true
  };

  return request.get(message);
}

function renderForm(info) {
  info = info || { active: 0, total: 0 };

  return `
  <html>
    <head>
        <title>Join ${team.toUpperCase()} on Slack!</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,user-scalable=no">
        <link rel="shortcut icon" href="https://slack.global.ssl.fastly.net/272a/img/icons/favicon-32.png">
    </head>
    <div class="splash">
        <div class="logos">
            <div class="logo slack"></div>
        </div>
        <p>
            Join <b>${team.toUpperCase()}</b>
            on Slack.
        </p>
        <p class="status">
            <b class="active">${info.active}</b>
            users online now of <b class="total">${info.total}</b>
            registered.
        </p>
        <form id="invite" action="invite/" method="post">
            <input type="email" name="email" placeholder="you@yourdomain.com" autofocus=true class="form-item" required>
            <button type="submit">Get my Invite</button>
        </form>
        <p class="signin">
            or <a href="https://${team}.slack.com" target="_top">sign in</a>
            .
        </p>
        <footer>
            Powered by <a href="https://webtask.io">Auth0 Webtask.io</a> based on 
            <a href="http://rauchg.com/slackin" target="_blank">Slackin</a>
        </footer>
        <style>
        ${renderCss()}
        </style>
    </div>
</html>
  `;
}

function renderThanks(info) {
  info = info || { active: 0, total: 0 };

  return `
  <html>
    <head>
        <title>Join ${team.toUpperCase()} on Slack!</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,user-scalable=no">
        <link rel="shortcut icon" href="https://slack.global.ssl.fastly.net/272a/img/icons/favicon-32.png">
        <link rel="stylesheet" href="css">
    </head>
    <div class="splash">
        <div class="logos">
            <div class="logo slack"></div>
        </div>
        <p>
            Your invite to <b>${team.toUpperCase()}</b>
            Slack invite is on it's way.
        </p>
        <p class="status">
            <b class="active">${info.active}</b>
            users online now of <b class="total">${info.total}</b>
            registered.
        </p>
        <footer>
            Powered by <a href="https://webtask.io">Auth0 Webtask.io</a> based on 
            <a href="http://rauchg.com/slackin" target="_blank">Slackin</a>
        </footer>
        <style>
        ${renderCss()}
        </style>
    </div>
</html>
  `;
}

function renderCss() {
  return `
            html {
                font-size: 10px
            }

            .splash {
                width: 30rem;
                margin: 20rem auto;
                text-align: center;
                font-family: "Helvetica Neue", Helvetica, Arial
            }

            @media (max-width: 50rem) {
                .splash {
                    margin-top:10rem
                }
            }

            .head {
                margin-bottom: 4rem
            }

            .logos {
                position: relative;
                margin-bottom: 4rem
            }

            .logo {
                width: 4.8rem;
                height: 4.8rem;
                display: inline-block;
                background-size: cover
            }

            .logo.slack {
                background-image: url(slack.svg)
            }

            p {
                font-size: 1.5rem;
                margin: .5rem 0
            }

            select {
                background: none
            }

            button, .form-item {
                font-size: 1.2rem;
                margin-top: 1rem;
                vertical-align: middle;
                display: block;
                text-align: center;
                box-sizing: border-box;
                width: 100%;
                padding: .9rem
            }

            button {
                color: #fff;
                font-weight: bold;
                border-width: 0;
                background: #E01563;
                text-transform: uppercase;
                cursor: pointer;
                appearence: none;
                -webkit-appearence: none;
                outline: 0;
                transition: background-color 150ms ease-in, color 150ms ease-in
            }

            button:disabled {
                color: #9B9B9B;
                background-color: #D6D6D6;
                cursor: default;
                pointer-events: none
            }

            button.error {
                background-color: #F4001E;
                text-transform: none
            }

            button.success:disabled {
                color: #fff;
                background-color: #68C200
            }

            button:not(.disabled):active {
                background-color: #7A002F
            }

            b {
                transition: transform 150ms ease-in
            }

            b.grow {
                transform: scale(1.3)
            }

            form {
                margin-top: 2rem;
                margin-bottom: 0
            }

            input {
                color: #9B9B9B;
                border: .1rem solid #D6D6D6
            }

            input:focus {
                color: #666;
                border-color: #999;
                outline: 0
            }

            .active {
                color: #E01563
            }

            p.signin {
                padding: 1rem 0 1rem;
                font-size: 1.1rem
            }

            p.signin a {
                color: #E01563;
                text-decoration: none
            }

            p.signin a:hover {
                background-color: #E01563;
                color: #fff
            }

            footer {
                color: #D6D6D6;
                font-size: 1.1rem;
                margin: 20rem auto 0;
                width: 30rem;
                text-align: center
            }

            footer a {
                color: #9B9B9B;
                text-decoration: none;
                border-bottom: .1rem solid #9B9B9B
            }

            footer a:hover {
                color: #fff;
                background-color: #9B9B9B
            }
  `;
}

function renderBadgeSvg(info) {
  info = info || { active: 0, total: 0 };

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="87" height="20">
    <rect rx="3" width="87" height="20" fill="#555"/>
    <rect rx="3" x="47" width="40" height="20" fill="#E01563"/>
    <path d="M47 0h4v20h-4z" fill="#E01563"/>
    <g text-anchor="middle" font-family="Verdana" font-size="11">
      <text fill="#010101" fill-opacity=".3" x="24" y="15">slack</text>
      <text fill="#fff" x="24" y="14">slack</text>
      <text fill="#010101" fill-opacity=".3" x="67" y="15">${info.active}/${info.total}</text>
      <text fill="#fff" x="67" y="14">${info.active}/${info.total}</text>
    </g>
  </svg>
  `;
}

function renderSlackSvg() {
  return `
  <svg width="118" height="118" viewBox="0 0 118 118" xmlns="http://www.w3.org/2000/svg">
    <title>Group</title>
    <g fill="none" fill-rule="evenodd">
        <path d="M10.258 62.86c-4.395.032-8.118-2.587-9.49-6.674-.053-.16-.1-.314-.143-.466C-.87 50.484 2.03 45.008 7.23 43.255L90.613 15.32a11.31 11.31 0 0 1 3.046-.446c4.51-.036 8.33 2.64 9.74 6.816l.12.403c1.56 5.452-2.32 10.32-6.96 11.88l-82.92 28.31a10.88 10.88 0 0 1-3.39.576" fill="#70CADB"/>
        <path d="M24.157 103.867c-4.428.032-8.165-2.55-9.52-6.578-.05-.16-.1-.31-.143-.47a10.28 10.28 0 0 1 6.596-12.59l83.388-28.19a10.71 10.71 0 0 1 3.307-.56c4.442-.036 8.344 2.68 9.72 6.752l.13.426c.803 2.813.328 5.98-1.272 8.477-1.195 1.86-4.96 3.494-4.96 3.494L27.7 103.264c-1.165.39-2.355.593-3.54.604" fill="#E01765"/>
        <path d="M93.572 104.043a10.233 10.233 0 0 1-9.802-6.976L55.94 14.402l-.14-.465c-1.506-5.27 1.392-10.77 6.59-12.522a10.27 10.27 0 0 1 3.2-.542c1.608-.012 3.164.35 4.63 1.074a10.214 10.214 0 0 1 5.157 5.913l27.828 82.658.08.265c1.563 5.473-1.33 10.976-6.527 12.726-1.03.34-2.103.52-3.184.53" fill="#E8A723"/>
        <path d="M52.205 117.97a10.242 10.242 0 0 1-9.807-6.984L14.575 28.323a19.1 19.1 0 0 1-.14-.46 10.235 10.235 0 0 1 6.583-12.523 10.333 10.333 0 0 1 3.187-.535 10.24 10.24 0 0 1 9.805 6.98l27.824 82.664c.052.14.1.3.14.45a10.235 10.235 0 0 1-6.588 12.53 10.294 10.294 0 0 1-3.18.53" fill="#3EB890"/>
        <path d="M79.852 85.43l19.405-6.636-6.343-18.84-19.428 6.568 6.366 18.907" fill="#CC1F27"/>
        <path d="M38.55 99.55l19.402-6.633-6.39-18.982-19.424 6.567 6.41 19.05" fill="#361238"/>
        <path d="M66.037 44.396l19.407-6.625-6.268-18.62-19.444 6.52 6.305 18.73" fill="#65863A"/>
        <path d="M24.73 58.498l19.407-6.625-6.346-18.856-19.44 6.513 6.39 18.968" fill="#1A937D"/>
    </g>
</svg>
  `;
}
