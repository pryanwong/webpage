source 'https://rubygems.org'

ruby '2.3.0', :engine => 'jruby', :engine_version => '9.0.0.0'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails'
# Use postgresql as the database for Active Record
gem 'activerecord-jdbcpostgresql-adapter'
gem 'rails_12factor', group: :production
# Use SCSS for stylesheets
gem 'sass-rails'
gem 'bootstrap-sass'
gem 'non-stupid-digest-assets'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.0.0'
gem 'coffee-script-source', '1.8.0'
# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer',  platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0',          group: :doc

# Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
gem 'spring',        group: :development

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

gem 'tzinfo-data', platforms: [:mingw, :mswin, :jruby]

gem 'puma'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Use debugger
# gem 'debugger', group: [:development, :test]

gem 'omniauth'
gem 'omniauth-oauth2', '1.3.1'
gem 'omniauth-google'
gem "omniauth-google-oauth2", '~>0.4.1'
gem 'omniauth-linkedin-oauth2'
gem 'cancancan', '~> 1.10'
gem 'devise'
gem "jscolor-rails"
gem 'jquery-turbolinks' #adding turbo
gem 'haml' #haml gem
gem 'will_paginate'
#gem 'paperclip', :git=> 'https://github.com/thoughtbot/paperclip', :ref => '523bd46c768226893f23889079a7aa9c73b57d68'
gem 'aws-sdk'
gem 'remote_ip_proxy_scrubber'

#will_paginate_bootstrap is added to provide bootstrap formatting to will_paginate
gem 'will_paginate-bootstrap'

group :development, :test do
  # gem 'guard-jruby-minitest'
  # gem 'guard-jruby-rspec'
  gem 'rspec-rails', '~> 3.0'
  gem 'guard-rspec', '4.6.5'
  gem 'guard', '2.11.0'
  gem 'factory_girl_rails'
  gem 'derailed'
  # gem 'guard'
end

group :test do
  gem 'faker'
  gem 'capybara'
  gem 'launchy'
  gem 'minitest'
end
