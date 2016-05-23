class CustomFailure < Devise::FailureApp
    def redirect_url
       puts "In Custom Failure Redirect_url"
       root_path
    end

    # You need to override respond to eliminate recall
    def respond
      if http_auth?
        puts "In Custom Failure http_auth"
        http_auth
      else
        puts "In Custom Failure redirect"
        redirect
      end
    end
  end
