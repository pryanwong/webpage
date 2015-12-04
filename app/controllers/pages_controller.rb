class PagesController < ApplicationController
  layout :pages_layout
  def home
  end

  def about
  end

  def failed
  end

  def accessdenied
  end

  private
   def pages_layout
     "longpages"
   end
end
