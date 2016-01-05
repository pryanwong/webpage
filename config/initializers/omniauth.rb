Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV["GOOGLE_CLIENT_ID"], ENV["GOOGLE_SECRET"],
    {
      scope: ['email'],
      access_type: 'offline'
    }

  provider :linkedin, ENV["LINKEDIN_CLIENT_ID"], ENV["LINKEDIN_SECRET"],
    {
      scope: 'r_emailaddress r_emailaddress',
      fields: ['id', 'first-name', 'last-name', 'location', 'picture-url', 'public-profile-url', 'email-address']
    }
end
