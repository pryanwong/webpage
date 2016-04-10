class SessionsController < ApplicationController

  def create
   logger.info "Entering SessionsController#create"
   logger.debug env["omniauth.auth"]
   user = User.from_omniauth(env["omniauth.auth"])
   if !user.nil?
     session[:user_id] = user.id
     session[:company_id] = user.company_id
     logger.debug "User Role #{user_path(user.id)}"
     logger.info "Leaving SessionsController#create"
     redirect_to user_path(user.id)
   else
     logger.debug "User is nil"
     logger.info "Leaving SessionsController#create"
     redirect_to failed_path
   end
 end

 def destroy
   logger.info "Entering SessionsController#destroy"
   session[:user_id] = nil
   session[:company_id] = nil
   cookies.delete('_optecture_session')
   reset_session
   logger.info "Leaving SessionsController#destroy"
   redirect_to root_path
 end

end
