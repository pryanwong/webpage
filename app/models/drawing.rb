class Drawing < ActiveRecord::Base

  enum privacy: [ :company, :division, :user]
  scope :moderator_access, -> (user_in){  includes(:user).where("(drawings.company_id = ?)",user_in.company_id) if user_in.present?}
  scope :user_access, -> (user_in){  includes(:user).where("(user_id = ?) or (privacy = ? and division_id IN (?)) or (privacy = ? and drawings.company_id = ?)", user_in.id, Drawing.privacies["division"], user_in.divisions.to_a, Drawing.privacies["company"], user_in.company_id) if user_in.present? }

  belongs_to :user
  belongs_to :division
  belongs_to :company

end
