class CreaPesoporton < ActiveRecord::Migration[7.0]
  def change
    create_table :pesoporton do |t|
      t.column :valor, :decimal
      t.timestamp :desde
      t.timestamp :hasta
      t.timestamps
    end
  end
end
