class Company < ActiveRecord::Base
    has_many :users, :dependent => :restrict_with_error
    has_many :divisions, :dependent => :restrict_with_error
    validates :name, presence: true, uniqueness: true
    validates :licenses, presence: true, numericality: { only_integer: true }

    def companyParamsValid(params)
      #Determine if User already exists
      valid_data = false;
      comp_param = false;
      license_param = false;
      error_messages = {};

      if (!params[:company][:name].blank?)
         comp_param = true;
      else
         error_messages[:email_blank] = "Company Name not Provided"
      end

      if (!params[:company][:licenses].blank?)
         if params[:company][:licenses].is_a? Integer
            license_param = true;
         else
            error_messages[:license_param] = "Licenses must be an Integer"
         end
      else
         error_messages[:license_param] = "Licenses not Provided"
      end

      if (div_param && license_param)
        valid_data = true;
      end
      return [valid_data, error_messages]
    end

    def companyValid(id )
      company_exists = true;
      error_messages = {};
      if (!id.blank? && !(id == nil))
         if (Company.exists?(id: id))
            company_exists = true;
         end
      else
        error_messages[:id_blank] = "Company Does Not Exist"
      end
      if (company_exists)
        valid_data = true;
      end
      return [valid_data, error_messages]
    end


    def additionalUserLicensed
        flashval = {}
        val = false;
        if (self.users.size < self.licenses)
           val = true;
        else
           flashval[:error_license] = "Cannot Add User:  All Licenses Have Been Used"
        end
        return [val, flashval];
    end

    def deleteCompany
       successfullyDeleted = self.destroy
       companyErrors = {}
       if successfullyDeleted
         companyErrors[:notice] = "Division Has Been Successfully Deleted "
       else
         if (!self.errors.empty?)
            self.errors.each do |attr,err|
              companyErrors[attr] = err.to_s()
            end
         end
         companyErrors[:could_not_update] = "Could Not Delete Division"
       end
       return [successfullyDeleted, companyErrors]
    end

    private

    def duplicate(company_name)
      companyErrors = {}
      #check for duplicate
      companies = company.all.pluck(:name).map(&:upcase)
      duplicate = companies.include?(company_name.upcase)
      return duplicate
    end
end
