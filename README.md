# Squeakr

## #Development

`yarn run dev`

-- or --

`yarn run frontend:dev`

`yarn run backend:dev`

## push to heroku

`heroku git:remote -a squeakr-web`

`git push heroku master`

## explore heroku files 

`heroku run bash`

## stop heroku build

`heroku plugins:install heroku-builds` (only once)

`heroku builds:cancel BUILD_UUID -a APP_NAME`

## yarn audit fix

```
npm i --package-lock-only
rm yarn.lock
npm audit fix
yarn import
rm package-lock.json
```

## add a package (will change if I stop using heroku)

`yarn add <pkg-name> --ignore-engines`

## Hot formula

actions = (len(comments) + len(reaction) + len(views))

hot = int(log10(actions) + (min(actions, 1) * date_created.ms / 45000))

## #Features I still want

* ability to change avatar thumbnail to a picture
* embedding a post in another website
* toggle between fluid grid (should I try react-stack-grid again?) and one column list
* add UT
* clean up bugs (obviously)
