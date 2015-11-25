class Drawing < ActiveRecord::Base

  enum privacy: [ :company, :division, :user]
  belongs_to :user
  belongs_to :division
  belongs_to :company

end
