class MessageImage

  include ActiveModel::Model
  include ActiveModel::Conversion
  include ActiveModel::Validations

  attr_accessor :email1, :email2, :email3, :email4, :content, :company_id, :user_id, :drawing_id, :from,:imageData

  @company_id
  @user_id
  @drawing_id

  validates :email1,
    presence: true


end
