class AgregaDireccionAmigable < ActiveRecord::Migration[7.0]
  def up
    add_column :usuario, :direccion_amigable, :string, limit: 64
    Usuario.all.each do |u|
      menserr = "".dup
      u.direccion_amigable = TonwebHelper.direccion_a_amigable(
        u.direccion, menserr, true, true
      )
      if u.direccion_amigable == ''
        puts "No pudo convertir direccción: #{menserr}"
      else
        u.save
      end
    end
  end
  def down
    remove_column :usuario, :direccion_amigable
  end
end
