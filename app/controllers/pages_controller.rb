class PagesController < ApplicationController
  layout :pages_layout
  def home
    logger.debug "From Pages_Home: #{session.inspect}"
  end

  def show
    redirect_to(root_path)
  end
  def about
  end

  def failed
  end

  def accessdenied
  end

  def recordnotfound
  end

  def not_found
    status_code = params[:code] || 500
    #flash.alert = "Status #{status_code}"
    render status_code.to_s, status: status_code
  end

  private
   def pages_layout
     "longpages"
   end
end
