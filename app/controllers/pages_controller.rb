class PagesController < ApplicationController
  layout :pages_layout
  def home
  end

  def about
  end

  def contact
  end

  def failed
  end

  private
   def pages_layout
     "pages"
   end
end
