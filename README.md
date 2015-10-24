#Sales Sketch

A barebones Sales Engineering Tool put together by Sean and Ian Ferenci
Ian's still learning this stuff... (Hee, Hee, Hee)

This application is in Progress but will look awesome when it's finished

## Deploying to Heroku

```sh
$ git push heroku master
$ heroku run rake db:migrate
$ heroku run rake assets:precompile
$ heroku open
$ heroku logs --tail

To peak at the database
$ heroku pg:psql
```

## Documentation

Give me time and I'll get the documentation done

- [Ruby on Heroku](https://devcenter.heroku.com/categories/ruby)

-Sean Ferenci, P.Eng.
September 10, 2015
