class SessionsController < ApplicationController

  def create
   logger.info "Entering SessionsController#create"
   logger.debug env["omniauth.auth"]
   user = User.from_omniauth(env["omniauth.auth"], remote_ip())
   if !user.nil?
     session[:user_id] = user.id
     session[:company_id] = user.company_id
     session[:role] = user.role
     session[:email] = user.email
     session[:timezone] = user.timezone
     logger.debug "User Role #{user_path(user.id)}"
     logger.info "Leaving SessionsController#create"
     redirect_to user_path(user.id)
   else
     logger.debug "User is nil"
     logger.info "Leaving SessionsController#create"
     flash[:error] = "User Login Failed"
     redirect_to failed_path
   end
 end

 def destroy
   logger.info "Entering SessionsController#destroy"
   session[:user_id] = nil
   session[:company_id] = nil
   session[:role] = nil
   session[:email] = nil
   session[:timezone] = nil
   cookies.delete('_optecture_session')
   reset_session
   logger.info "Leaving SessionsController#destroy"
   redirect_to root_path
 end

end
