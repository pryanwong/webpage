Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV["GOOGLE_CLIENT_ID"], ENV["GOOGLE_SECRET"],
    {
      :access_type => 'online',
      :prompt => ''
    }

  provider :linkedin, ENV["LINKEDIN_CLIENT_ID"], ENV["LINKEDIN_SECRET"],
    {
      scope: 'r_basicprofile r_emailaddress',
      fields: ['id', 'first-name', 'last-name', 'location', 'picture-url', 'public-profile-url', 'email-address']
    }
end

OmniAuth.config.on_failure = Proc.new { |env|
  OmniAuth::FailureEndpoint.new(env).redirect_to_failure
}
