class SessionsController < ApplicationController

  def create
   logger.fatal "In SessionsController Create"
   logger.fatal env["omniauth.auth"]
   user = User.from_omniauth(env["omniauth.auth"])
   if !user.nil?
     session[:user_id] = user.id
     session[:company_id] = user.company_id
     logger.fatal "User Role #{user_path(user.id)}"
     redirect_to user_path(user.id)
   else
     logger.fatal "User is nil"
     redirect_to failed_path
   end
 end

 def destroy
   session[:user_id] = nil
   session[:company_id] = nil
   cookies.delete('_optecture_session')
   reset_session
   redirect_to root_path
 end

end
