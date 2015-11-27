class Division < ActiveRecord::Base
    validates :name, presence: true
    has_many :user_memberships, :dependent => :restrict_with_error
    has_many :users, :through => :user_memberships


   def deleteDivision
      successfullyDeleted = self.destroy
      divisionErrors = {}
      if successfullyDeleted
        divisionErrors[:notice] = "Division Has Been Successfully Deleted "
      else
        if (!self.errors.empty?)
           self.errors.each do |attr,err|
             divisionErrors[attr] = err.to_s()
           end
        end
        divisionErrors[:could_not_update] = "Could Not Delete Division"
      end
      return [successfullyDeleted, divisionErrors]
   end

   def addDivision(company, div_name)
     divisionErrors = {}
     val = false
     if duplicate(company,div_name)
       divisionErrors[:could_not_update] = "Could Not Add Division: Duplicate Division Name"
     else
       self.name = div_name
       self.company_id = company.id
       if self.save
          divisionErrors[:notice] = "Division Added Successfully"
          val = true
       else
          if (!self.errors.empty?)
            self.errors.each do |attr,err|
              divisionErrors[attr] = err.to_s()
            end
          end
          divisionErrors[:notice] = "Division Not Added"
       end
    end
    return [val, divisionErrors]
   end

   def updateDivision(new_name)
     divisionErrors = {}
     val = false
     if duplicate(Company.find(self.company_id),new_name)
       divisionErrors[:could_not_update] = "Could Not Update Division: Duplicate Division Name"
     else
       if self.update(name: new_name)
          divisionErrors[:notice] = "Division Updated Successfully"
          val = true
       else
          if (!self.errors.empty?)
            self.errors.each do |attr,err|
              divisionErrors[attr] = err.to_s()
            end
          end
          divisionErrors[:error_not_added] = "Division Not Added"
       end
    end
    return [val, divisionErrors]
   end

   def validateExistingDivision(params)
     division_exists = true;
     error_messages = {};
     if (!params[:id].blank?)
        if (Division.exists?(id: params[:id]))
           user_exists = true;
        end
     else
       error_messages[:email_blank] = "Division Does Not Exist"
     end
     if (division_exists)
       valid_data = true;
     end
     return [valid_data, error_messages]
   end

   def validateDivision(params)
       #Determine if User already exists
       valid_data = false;
       div_param = false;
       error_messages = {};

       if (!params[:division][:name].blank?)
          div_param = true;
       else
          error_messages[:email_blank] = "Division Name not Provided"
       end
       if (div_param)
         valid_data = true;
       end
       return [valid_data, error_messages]
   end

   private

   def duplicate(company, div_name)
     divisionErrors = {}
     #check for duplicate
     divisions = company.divisions.pluck(:name)
     duplicate = divisions.include?(div_name)
     return duplicate
   end

end
