module ApplicationHelper
  def sortable(column, title = nil)
     title ||= column.titleize
     css_class = column == sort_column ? "current #{sort_direction}" : nil
     direction = column == sort_column && sort_direction == "asc" ? "desc" : "asc"
     link_to title, {:sort => column, :direction => direction, :srch_term => sort_search}, :class => css_class
  end

  def bootstrap_class_for(flash_type)
     case flash_type
     when "success"
       "alert-success"   # Green
     when "error"
       "alert-danger"    # Red
     when "alert"
       "alert-warning"   # Yellow
     when "notice"
       "alert-info"      # Blue
     else
       "alert-info"
     end
   end

   def bootstrap_class_for_valid(type)
     case type
     when "valid"
       ""
     else
       "bg-danger"
     end
   end

   def resource_name
     :user
   end

   def resource
     @resource ||= User.new
   end

   def devise_mapping
     @devise_mapping ||= Devise.mappings[:user]
   end
end
