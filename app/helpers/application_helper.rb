module ApplicationHelper
  def sortable(column, title = nil)
     title ||= column.titleize
     css_class = column == sort_column ? "current #{sort_direction}" : nil
     direction = column == sort_column && sort_direction == "asc" ? "desc" : "asc"
     link_to title, {:sort => column, :direction => direction}, :class => css_class
  end

  def sortable2(column, title = nil)
     title ||= column.titleize
     css_class = column == sort_column_user ? "current #{sort_direction}" : nil
     direction = column == sort_column_user && sort_direction == "asc" ? "desc" : "asc"
     link_to title, {:sort => column, :direction => direction}, :class => css_class
  end

end
