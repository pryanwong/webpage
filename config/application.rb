require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

#module RubyGettingStarted
module Optecture
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.before_configuration do
     env_file = File.join(Rails.root, 'config', 'local_env.yml')
     # puts "Env File: #{env_file}"
     # puts "Exists: #{File.exists?(env_file)}"
     # puts "YAML: #{YAML.load(File.open(env_file))[Rails.env].inspect}"
     YAML.load(File.open(env_file))[Rails.env].each do |key, value|
       # puts "YAML key: #{key}, value: #{value}"
       ENV[key.to_s] = value.to_s
     end if File.exists?(env_file)
    end
    config.action_mailer.raise_delivery_errors = true
    config.action_mailer.perform_deliveries = true
    config.action_mailer.delivery_method = :smtp
    #config.assets.paths << "#{Rails.root}/app/assets/fonts"
    #config.assets.precompile << /\.(?:svg|eot|woff|ttf)\z/

    #config.action_mailer.smtp_settings = {
    #  address: "smtp.gmail.com",
    #  port: "587",
    #  domain: "gmail.com",
    #  user_name: ENV["GOOGLE_CONTACT_EMAIL"],
    #  password: ENV["GOOGLE_CONTACT_EMAIL_PASS"],
    #  authentication: "plain",
    #  enable_starttls_auto: true
    #}

    config.generators do |g|
       g.test_framework :rspec,
          :fixtures => true,
          :view_specs => false,
          :helper_specs => false,
          :routing_specs => false,
          :controller_specs => true,
          :request_specs => true
       g.fixture_replacement :factory_girl, :dir => "spec/factories"
    end

    config.action_mailer.smtp_settings = {
      address: "smtpout.secureserver.net",
      port:     "80",
      domain: "www.fiveforces.ca",
      authentication: "plain",
      user_name: ENV["GODADDY_CONTACT_EMAIL"],
      password: ENV["GODADDY_CONTACT_EMAIL_PASS"]
    }

   config.action_mailer.default_url_options = {
      :host => 'localhost:5000'
   }

   config.action_dispatch.perform_deep_munge = false
   #config.assets.enabled = true
   #config.assets.initialize_on_precompile = false

   config.exceptions_app = self.routes

  end
end
