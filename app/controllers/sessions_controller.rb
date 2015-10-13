class SessionsController < ApplicationController

  def create
   user = User.from_omniauth(env["omniauth.auth"])
   logger.fatal "In Session Controller"
   logger.fatal "User Role #{user.id}"
   if !user.nil?
     session[:user_id] = user.id
     session[:company_id] = user.company_id
     logger.fatal "User Role #{user_path(user.id)}"
     redirect_to user_path(user.id)
   else
     redirect_to failed_path
   end
 end

 def destroy
   session[:user_id] = nil
   session[:company_id] = nil
   reset_session
   redirect_to root_path
 end

end
