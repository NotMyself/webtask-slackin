# Webtask Slackin [![Join us](https://webtasks.iamnotmyself.com/notmyself/ssdug-slackin/badge.svg)](https://webtasks.iamnotmyself.com/notmyself/ssdug-slackin/) [![Deploy](https://cdn.auth0.com/webtask/temp/button.svg)](https://webtask-button-hack.now.sh)

Webtask Slackin is a Serverless implementation of [Guillermo Rauch](https://github.com/rauchg)'s [Slackin](https://github.com/rauchg/slackin) for [Webtask.io](https://webtask.io/). It is specifically intended to address cold start issues that smaller groups have when hosting on free tier cloud providers like Heroku & Azure. If you have ever setup Slackin for your group and encountered broken badge images becuase of response timeouts, then Webtask Slackin is for you.

## Features
- A landing page you can point users to to fill in their emails and recieve an invite (`https://{your wt container}.run.webtask.io/webtask-slackin`).
- A SVG badge that works well for static mediums (like GitHub README Pages).
- Super simple deployment to [Webtask.io](https://webtask.io/).

## Usage
To deploy the webtask from the command line, follow these steps:

**Note:** These steps assume you have the [Wetask CLI](https://webtask.io/cli) installed and initialized.

1. Clone the repository `git clone https://github.com/NotMyself/webtask-slackin.git`
1. Update the `.meta` file to include your Slack team name
1. Copy the `.env_example` file to a `.env` file
1. Update the `.env` file to include your Slack API token
1. Run the script `scripts/publish`

The output will look like this:

![Deployment](docs/images/deployment.png?raw=true "Deployment")

**Note:** The URL at the end of the output is where your webtask is hosted.

### Tips

Your team id is what you use to access your login page on Slack (eg: https://**{this}**.slack.com).

You can find or generate your API test token at [api.slack.com/web](https://api.slack.com/web) – note that the user you use to generate the token must be an admin. You need to create a dedicated `@slackin-inviter` user (or similar), mark that user an admin, and use a test token from that dedicated admin user.  Note that test tokens have actual permissions so you do not need to create an OAuth 2 app. Also check out the Slack docs on [generating a test token](https://get.slack.help/hc/en-us/articles/215770388-Creating-and-regenerating-API-tokens).

### Badges
#### SVG ([demo](https://webtasks.iamnotmyself.com/notmyself/ssdug-slackin/badge.svg))

```html
<img src="https://{your wt container}.run.webtask.io/webtask-slackin/badge.svg">
```

```markdown
[![Join us](https://{your wt container}.run.webtask.io/webtask-slackin/badge.svg)](https://{your wt container}.run.webtask.io/webtask-slackin/)
```
