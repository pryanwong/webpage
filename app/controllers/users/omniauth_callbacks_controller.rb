class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController


 def google_oauth2
      # You need to implement the method below in your model (e.g. app/models/user.rb)
      logger.debug "In Google Oauth2 Callbacks Controller"
      logger.debug "Request #{request.env["omniauth.auth"]}"
      begin
         @user = User.from_omniauth(request.env["omniauth.auth"], remote_ip)
         # @user.skip_confirmation!
         logger.debug "User: #{@user.inspect}"

         if @user.persisted?
           flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
           sign_in_and_redirect @user, :event => :authentication
         else
           session["devise.data"] = request.env["omniauth.auth"]
           redirect_to new_user_registration_url
         end
       rescue ActiveRecord::RecordNotFound
         flash[:error] = "Google User Not Registered"
         redirect_to root_path
       end

  end

  def linkedin
       # You need to implement the method below in your model (e.g. app/models/user.rb)
       logger.debug "In Google Oauth2 Callbacks Controller"
       logger.debug "Request #{request.env["omniauth.auth"]}"
       begin
          @user = User.from_omniauth(request.env["omniauth.auth"], remote_ip)
          # @user.skip_confirmation!
          logger.debug "User: #{@user.inspect}"

          if @user.persisted?
            flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Linkedin"
            sign_in_and_redirect @user, :event => :authentication
          else
            session["devise.data"] = request.env["omniauth.auth"]
            redirect_to new_user_registration_url
          end
    rescue ActiveRecord::RecordNotFound
      flash[:error] = "LinkedIn User Not Registered"
      redirect_to root_path
    end
   end


 def failure
   redirect_to '/accessdenied'
 end

end
