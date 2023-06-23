class AgregaUltimopesoportonAnuncioventa < ActiveRecord::Migration[7.0]
  def change
    add_column :anuncioventa, :ultimopesoporton_id, :integer
    add_foreign_key :anuncioventa, :pesoporton, column: :ultimopesoporton_id
  end
end
