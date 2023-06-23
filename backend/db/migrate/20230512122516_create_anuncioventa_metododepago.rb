class CreateAnuncioventaMetododepago < ActiveRecord::Migration[7.0]
  def change
    create_table :anuncioventa_metododepago do |t|
      t.integer :anuncioventa_id, null: false
      t.integer :metododepago_id, null: false

      t.timestamps
    end
    add_foreign_key :anuncioventa_metododepago, :anuncioventa
    add_foreign_key :anuncioventa_metododepago, :metododepago
  end
end
