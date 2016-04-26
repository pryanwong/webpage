Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true
  config.force_ssl = true
  # Enable Rack::Cache to put a simple HTTP cache in front of your application
  # Add `rack-cache` to your Gemfile before enabling this.
  # For large-scale production use, consider using a caching reverse proxy like nginx, varnish or squid.
  # config.action_dispatch.rack_cache = true

  # Disable Rails's static asset server (Apache or nginx will already do this).
  config.serve_static_assets = false

  # Compress JavaScripts and CSS.
  config.assets.js_compressor = :uglifier
  # config.assets.css_compressor = :sass

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = false
  #config.assets.paths << Rails.root.join("app", "assets", "fonts")
  # Generate digests for assets URLs.
  config.assets.digest = true


  # `config.assets.precompile` and `config.assets.version` have moved to config/initializers/assets.rb

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for nginx

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  # config.force_ssl = true

  # Set to :debug to see everything in the log.
  config.log_level = :fatal
  config.logger = Logger.new(STDOUT)

  # Prepend all log lines with the following tags.
  # config.log_tags = [ :subdomain, :uuid ]

  # Use a different logger for distributed setups.
  # config.logger = ActiveSupport::TaggedLogging.new(SyslogLogger.new)

  # Use a different cache store in production.
  # config.cache_store = :mem_cache_store

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.action_controller.asset_host = "http://assets.example.com"

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Disable automatic flushing of the log to improve performance.
  # config.autoflush_log = false

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  #Paperclip S3 development
  # Amazon Web Services - S3
  #config.paperclip_defaults = {
  #  :storage => :s3,
  #  :s3_protocol => :https,
  #  :url => "https://s3-us-west-1.amazonaws.com/",
  #  :s3_credentials => {
  #    :bucket => ENV['S3_BUCKET_NAME'],
  #    :access_key_id => ENV['AWS_ACCESS_KEY_ID'],
  #    :secret_access_key => ENV['AWS_SECRET_ACCESS_KEY'],
  #    :s3_region => ENV['s3_region']
  #  }
  #}

   #Paperclip.options[:content_type_mappings] = { jpeg: 'image/jpeg', jpg: 'image/jpeg' }

   # Make sure CloudFlare IP addresses are
   # removed from the X-Forwarded-For header
   # before our app sees them
   config.middleware.insert_before(Rails::Rack::Logger,
      RemoteIpProxyScrubber.filter_middleware,
        %w{
          103.21.244.0/22
          103.22.200.0/22
          103.31.4.0/22
          104.16.0.0/12
          108.162.192.0/18
          131.0.72.0/22
          141.101.64.0/18
          162.158.0.0/15
          172.64.0.0/13
          173.245.48.0/20
          188.114.96.0/20
          190.93.240.0/20
          197.234.240.0/22
          198.41.128.0/17
          199.27.128.0/21
        })

   # Make sure the customer's real IP address (remote_ip)
   # is used in our Rails logs.
   config.middleware.insert_before(Rails::Rack::Logger, RemoteIpProxyScrubber.patched_logger)
   config.middleware.delete(Rails::Rack::Logger)

end
