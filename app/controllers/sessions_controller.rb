class SessionsController < ApplicationController

  def create
   user = User.from_omniauth(env["omniauth.auth"])
   if !user.nil?
     session[:user_id] = user.id
     redirect_to drawings_path
   else
     redirect_to failed_path
   end
 end

 def destroy
   session[:user_id] = nil
   reset_session
   redirect_to root_path
 end

end
