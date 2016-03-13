class Drawing < ActiveRecord::Base

  enum privacy: [ :company, :division, :user]
  scope :moderator_access, -> (user_in){  includes(:user).where("(drawings.company_id = ?)",user_in.company_id) if user_in.present?}
  scope :user_access, -> (user_in){  includes(:user).where("(user_id = ?) or (privacy = ? and division_id IN (?)) or (privacy = ? and drawings.company_id = ?)", user_in.id, Drawing.privacies["division"], user_in.divisions.to_a, Drawing.privacies["company"], user_in.company_id) if user_in.present? }

  belongs_to :user
  belongs_to :division
  belongs_to :company
  has_attached_file :background,
                  url: "/system/:hash.:extension",
                  hash_secret: "abc123"
  validates_presence_of :company, :user
  validates_presence_of :division, :if => :division_testing?
  validate :division_belongs_to_user, :if => :division_testing?
  validate :company_belongs_to_user
  validates_inclusion_of :privacy, in: Drawing.privacies.keys
  validates_attachment :background, content_type: { content_type: ["image/jpeg", "image/gif", "image/png"] }

  def division_testing?
     val = (self.privacy == "division")
     if !val
        self.division_id = 0
     end
     return val
  end

  def division_belongs_to_user
      divisionBelongs = self.user.company.divisions.pluck(:id).include?(self.division_id)
      if !divisionBelongs
        errors.add(:invalid_division, 'Division Does not Belong to User')
      end
  end

  def company_belongs_to_user
     companyBelongs = (self.user.company.id == self.company_id)
     if !companyBelongs
       errors.add(:invalid_company, 'Company Does not Belong to User')
     end
  end

  def validateExistingDrawing(id)
    drawing_exists = true;
    valid_data = false;
    error_messages = {};
    if (!id.blank? && !(id == nil))
       if (Drawing.exists?(id: id))
          drawing_exists = true;
       end
    else
      error_messages[:id_blank] = "Drawing Does Not Exist"
    end
    if (drawing_exists)
      valid_data = true;
    end
    return [valid_data, error_messages]
  end

end
