namespace :maintenance do
  desc "Turn maintenance mode of Heroku App on"
  task :on, [:app] => :environment do |task, args|
    puts "Turning on maintenance for #{args.app}"
    run_command("maintenance:on", args.app)
  end

  desc "Turn maintenance mode of Heroku App off"
  task :off, [:app] => :environment do |task, args|
    puts "Turning off maintenance for #{args.app}"
    run_command("maintenance:off", args.app)
  end

  desc "Maintenance status of App"
  task :status, [:app] => :environment do |task, args|
    puts "Maintenance status of #{args.app}"
    run_command("maintenance", args.app)
  end

  desc "Promote in Pipeline"
  task :promote, [:level] => :environment do |task, args|
    puts "Promote from #{args.level}"
    case args.level
    when "review"
        run_command_no_app("pipelines:promote -a reviewoptecture --to stagingoptecture")
    when "staging"
        run_command_no_app("pipelines:promote -a stagingoptecture --to whispering-beach-5923")
    else
        puts "level should be either review or staging"
    end
  end

  desc "Setup to automate migrate and seed commands for review phase"
  task :setup, [:level] => :environment do |task, args|
    puts "Seed #{args.level}"
    run_command("run rake db:migrate", args.level)
    run_command("run rake db:seed", args.level)
  end

  def run_command(cmd, app_name)
    Bundler.with_clean_env do
      sh build_command(cmd, app_name)
    end
  end

  def run_command_no_app(cmd)
    Bundler.with_clean_env do
      sh build_command_no_app(cmd)
    end
  end

  def build_command(cmd, app_name)
    "heroku #{cmd} --app #{app_name}"
  end

  def build_command_no_app(cmd)
    "heroku #{cmd}"
  end

end
