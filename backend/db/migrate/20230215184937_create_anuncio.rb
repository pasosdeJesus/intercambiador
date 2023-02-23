class CreateAnuncio < ActiveRecord::Migration[7.0]
  def change
    create_table :anuncio do |t|
      t.float :ton
      t.float :margenflotante
      t.float :limiteinferior
      t.integer :maximotiempo
      t.references :usuario, null: false, foreign_key: true

      t.timestamps
    end
  end
end
