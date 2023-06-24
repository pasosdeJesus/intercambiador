class AgregaEnBlockchain < ActiveRecord::Migration[7.0]
  def change
    add_column :anuncioventa, :enblockchain, :boolean, default: false
  end
end
