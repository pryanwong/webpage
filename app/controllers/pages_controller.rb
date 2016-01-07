class PagesController < ApplicationController
  layout :pages_layout
  def home
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

  private
   def pages_layout
     "longpages"
   end
end
