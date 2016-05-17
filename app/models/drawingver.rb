class Drawingver < ActiveRecord::Base

  belongs_to :drawing
  scope :moderator_access, -> (user_in){  includes(:user).where("(drawingvers.drawings.company_id = ?)",user_in.company_id) if user_in.present?}
  scope :user_access, -> (user_in){  includes(:user).where("(user_id = ?) or (privacy = ? and division_id IN (?)) or (privacy = ? and drawingvers.drawings.company_id = ?)", user_in.id, Drawing.privacies["division"], user_in.divisions.to_a, Drawing.privacies["company"], user_in.company_id) if user_in.present? }

  validates_presence_of :drawing, :drawing_id,:ver_updated_at, :ver_created_at


end
