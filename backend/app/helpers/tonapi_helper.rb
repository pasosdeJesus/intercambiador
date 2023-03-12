# frozen_string_literal: true

module TonapiHelper

  def getAccountInfo(direccion, red, prob)
    url = red + "/v1/account/getInfo" + "?account=#{direccion}"
    resp = Msip::InternetHelper::obtener(url, prob)
    if resp.nil?
      return [prob]
    end
    return JSON.parse(resp)
  end
  module_function :getAccountInfo


  # Basado en respuesta de StackOverflow que no logro ubicar 
  def dividir_en_trozos(string, size)
    Array.new(((string.length + size - 1) / size)) { |i| 
      string.byteslice(i * size, size) 
    }
  end
  module_function :dividir_en_trozos

  def bigint_a_repcadena(b)
    bs = b.to_s(2)
    r = bs.length % 8
    if r != 0
      bs = ("0" * (8-r)) + bs   # Alinea a 8 bits
    end
    dividir_en_trozos(bs, 8).map {|bc| bc.to_i(2).chr}.join
  end
  module_function :bigint_a_repcadena

  def repcadena_a_bigint(c)
    bin = c.bytes.map{|d| d.to_s(2)}.map{|b| b.rjust(8, '0')}.join
    bin.to_i(2)
  end
  module_function :repcadena_a_bigint

end

