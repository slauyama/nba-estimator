# NBA Predictor app

## Goal

Have a working scraper that views basketball standings at basketball reference.com and then saves it to a DB.
Build out a NextJS site that references this DB

## Decisions

### Scoring

One win is one point with a max score of 1230 based on the number of games in a NBA season (15 \* 82)

#### Options for modifier based on submission date

In order to make earlier guesses more important the number of wins could be multiplied again the percentage of season completed. Either percentage of days to end of regular season or percentage of games played.

~~1. Based on date submitted~~

~~- Not as accurate but would be easier to implement~~

1. Based on number of games played

   ~~- Cons: Would need to calculate the number of games played on every day~~

   - Solution: Save in localstorage the number of games current played when saved that could factor in the percentage season complete

#### Risk

Both are subject to risk of when scraping data occurs and when games are actually played. If games are blowouts or finalized before the scraping occurs users could add that win. This is a minor risk and will not be accounted for.

### Hosting

Ideally I want to host it on digital ocean.

#### Static Site

Before we support oauth or the ability to save estimates I think ideally we just render out static html pages daily and push that to the digital ocean version of an s3 bucket. Need to figure out domain name registration. But I want to get something up first before making more optimizations

#### Dynamic Site

After we will need access to a node server that can also talk to some hosted DB.

## To Do

- Host site
- Add Reset button
- Listen to storage event changes to avoid manipulation
- Create cron job to update standings
  - Use a different source aside from basketballreference
- Host DB online
- Export / import standings
- Upload screenshot using Imgur API
- Tests?

### Oauth (User login)

- Reddit Oauth
- Add support to save result to user profile
- Create post using Reddit API

### Long Tail

- Tracking / Analytics

### Done

- Remove light mode
- Add scoring system
- Make app responsive
- Create Image Sprite for speed optimization
- Fix svg sprites
- Add validation on input to render outline of Validity State
- Add save date to localStorage
- Need to determine validation for season estimate
  - Based on number of games in East in West we dont want estimates that have only the East winning games
- Save number of current wins to localStorage
- Add save button
- Save should be the only way to update local storage
- Save button should open confirmation dialog
