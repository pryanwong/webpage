# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160522020923) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "companies", force: true do |t|
    t.string  "name"
    t.integer "licenses"
    t.string  "portal"
  end

  create_table "divisions", force: true do |t|
    t.string  "name"
    t.integer "company_id"
  end

  create_table "drawings", force: true do |t|
    t.text     "drawing"
    t.string   "customer"
    t.string   "description"
    t.integer  "user_id"
    t.string   "opportunity"
    t.integer  "opportunity_id"
    t.integer  "version"
    t.text     "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "privacy",        default: 0, null: false
    t.integer  "division_id",    default: 0, null: false
    t.integer  "company_id",     default: 0, null: false
  end

  create_table "drawingvers", force: true do |t|
    t.text     "drawingtext"
    t.integer  "drawing_id"
    t.datetime "ver_updated_at"
    t.datetime "ver_created_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "prices", force: true do |t|
    t.integer  "company_id"
    t.integer  "version"
    t.string   "name"
    t.text     "price"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "product_id"
  end

  create_table "user_memberships", force: true do |t|
    t.integer "user_id"
    t.integer "division_id"
  end

  add_index "user_memberships", ["division_id"], name: "index_user_memberships_on_division_id", using: :btree
  add_index "user_memberships", ["user_id"], name: "index_user_memberships_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                  default: "",                            null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,                             null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                                                     null: false
    t.datetime "updated_at",                                                     null: false
    t.string   "uid"
    t.integer  "role"
    t.integer  "company_id"
    t.string   "timezone",               default: " Eastern Time (US & Canada)"
    t.string   "provider"
    t.string   "password"
    t.string   "encrypted_password"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "widgets", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "stock"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
